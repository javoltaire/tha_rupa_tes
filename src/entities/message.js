import * as yup from 'yup';
import { schemaValidate } from '../utils'

const schema = yup.object().shape({
    subject: yup.string().required(),
    body: yup.string().required(),
});

class Message {
    constructor(subject, body) {
        this._subject = subject;
        this._body = body;
    }

    get subject() {
        return this._subject;
    }

    get body() {
        return this._body;
    }

    validate() {
        return schemaValidate(this, schema);
    }
}

export default Message;