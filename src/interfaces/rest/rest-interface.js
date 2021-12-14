import restify from 'restify';
import restifyPlugins from 'restify-plugins';
import errs from 'restify-errors';
import { Contact, Message } from '../../entities';
import { EmailService } from '../../usecases';
import { SendGrid, MailGun } from '../../infrastructures';

const SUPPORTED_COURIERS = {
    mailGun: { cstr: MailGun, envLookup: 'MG_API_KEY' },
    sendGrid: { cstr: SendGrid, envLookup: 'SG_API_KEY' },
};

const createCourier = config => {
    const type = config.email_providers.default;
    const { cstr: Courier, envLookup } = SUPPORTED_COURIERS[type] || {};
    if (!Courier) {
        throw new Error(`Unsupported Courier Service, please use one of the following: ${Object.keys(SUPPORTED_COURIERS).join(',')}`);
    }

    const options = config.email_providers.services[type];
    return new Courier({ ...options, key: process.env[envLookup] });
}

class RestInterface {
    constructor(config, analytics) {
        this._config = config;
        this._server = restify.createServer();
        this._analytics = analytics;

        const courier = createCourier(config)
        this._emailService = new EmailService(courier);
        this._addMiddlewares();
        this._addRoutes();
        this._startServer();
    }

    _addMiddlewares() {
        this._server.use(restifyPlugins.jsonBodyParser({ mapParams: true }));
        this._server.use(restifyPlugins.acceptParser(this._server.acceptable));
        this._server.use(restifyPlugins.fullResponse());
    }

    _addRoutes() {
        this._server.post('/email', async (req, res, next) => {
            if (!req.is('application/json')) {
                next(new errs.InvalidContentError("Expects 'application/json'"));
                return;
            }


            const { to, to_name, from, from_name, subject, body } = req.body;
            const sender = new Contact(from_name, from);
            const recipient = new Contact(to_name, to);
            const message = new Message(subject, body);
            await this._emailService.sendEmail(sender, recipient, message, {
                onSuccess: () => {
                    this._analytics.relayInfo('success');
                    res.send("All good");
                    next();
                },
                onDeliveryError: e => {
                    this._analytics.relayError('InternalServerError: Unable to deliver message');
                    next(new errs.InternalError('Encountered Error while attempting to send email'));
                },
                onInvalidRecipent: () => {
                    this._analytics.relayInfo('ValidationError: Unable to deliver message, invalid to or to_name');
                    next(new errs.BadRequestError('Invalid to or to_name'));
                },
                onInvalidSender: () => {
                    this._analytics.relayInfo('ValidationError: Unable to deliver message, invalid from or from_name');
                    next(new errs.BadRequestError('Invalid from or from_name'));
                },
                onInvalidMessage: () => {
                    this._analytics.relayInfo('ValidationError: Unable to deliver message, invalid subject or body');
                    next(new errs.BadRequestError('Invalid subject or body'));
                },
                onUnauthorizedError: () => {
                    this._analytics.relayInfo('Unable to deliver message');
                    next(new errs.UnauthorizedError('Unthorized, please make sure your email is registered on mailgun or send grid'));
                }
            });
            next();
        })
    }

    _startServer() {
        this._server.listen(this._config.port, () => {
            console.log('%s listening at %s', this._server.name, this._server.url);
        });
    }
}

export default RestInterface;