import restify from 'restify';
import restifyPlugins from 'restify-plugins';
import errs from 'restify-errors';
import { Contact, Message } from '../../entities';
import { EmailService } from '../../usecases';
import { SendGrid } from '../../infrastructures';

// ImprovementOpportunity: better organize the rest folder, e.g. create routes file.

class RestInterface {
    constructor(config, analytics) {
        this._config = config;
        this._server = restify.createServer();
        this._analytics = analytics;
        this._emailService = new EmailService(new SendGrid(this._config.sendGrid));
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
                onDeliveryError: () => {
                    next(new errs.InternalError('Encountered Error while attempting to send email'));
                    // this._analytics.relayError('Unable to deliver message');
                },
                onInvalidRecipent: () => {
                    next(new errs.BadRequestError('Invalid to or to_name'));
                    // this._analytics.relayInfo('Unable to deliver message');
                    // res.send("Bad Request: Invalid recipient")
                },
                onInvalidSender: () => {
                    next(new errs.BadRequestError('Invalid from or from_name'));
                    // this._analytics.relayInfo('Unable to deliver message');
                    // res.send("Bad Request: Invalid sender")
                },
                onInvalidMessage: () => {
                    next(new errs.BadRequestError('Invalid subject or body'));
                    // this._analytics.relayInfo('Unable to deliver message');
                    // res.send("Bad Request: Invalid message")
                },
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