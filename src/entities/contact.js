import * as yup from 'yup';
import { schemaValidate } from '../utils'

const schema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().required().email(),
});

class Contact {
    constructor(name, email) {
        this._name = name;
        this._email = email;
    }

    get name() {
        return this._name;
    }

    get email() {
        return this._email;
    }

    validate() {
        return schemaValidate(this, schema);
    }
}

export default Contact;