import restify from 'restify';
import restifyPlugins from 'restify-plugins';
import { Contact, Message } from '../../entities';
import { EmailService } from '../../usecases';
import { SendGrid } from '../../infrastructures';

class RestInterface {
    constructor(config, analytics) {
        this._config = config;
        this._server = restify.createServer();
        this._analytics = analytics;
        this._emailService = new EmailService(new SendGrid());
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
            const { to, to_name, from, from_name, subject, body } = req.body;
            const sender = new Contact(from_name, from);
            const recipient = new Contact(to_name, to);
            const message = new Message(subject, body);
            await this._emailService.sendEmail(sender, recipient, message, {
                onSuccess: () => {
                    this._analytics.relayInfo('success');
                    res.send("All good");
                },
                onDeliveryError: () => {
                    this._analytics.relayError('Unable to deliver message');
                    res.send('Internal Server Error');
                },
                onInvalidRecipent: () => {
                    this._analytics.relayInfo('Unable to deliver message');
                    res.send("Bad Request: Invalid recipient")
                },
                onInvalidSender: () => {
                    this._analytics.relayInfo('Unable to deliver message');
                    res.send("Bad Request: Invalid sender")
                },
                onInvalidMessage: () => {
                    this._analytics.relayInfo('Unable to deliver message');
                    res.send("Bad Request: Invalid message")
                },
            })
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