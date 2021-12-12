import restify from 'restify';
import restifyPlugins from 'restify-plugins';

class RestInterface {
    constructor(config) {
        this._config = config;
        this._server = restify.createServer();
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
        this._server.post('/email', (req, res, next) => {
            res.send(req.body);
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