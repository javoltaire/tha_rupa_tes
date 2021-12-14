import FormData from 'form-data';
import Courier from "./courier";
import axios from 'axios';
import { escapeHtml } from "../../utils";

class MailGun extends Courier {
    constructor(options) {
        super();
        this._options = options;
    }

    get _baseUrl() {
        return `${this._options.host}/${this._options.domain}`
    }

    async sendMessage(sender, recipient, message) {
        const url = `${this._baseUrl}/messages`;
        const data = new FormData();
        data.append('from', `${sender.name} <${sender.email}>`);
        data.append('to', `${recipient.name} <${recipient.email}>`);
        data.append('subject', message.subject);
        data.append('text', escapeHtml(message.body));

        return axios.post(url, data, {
            auth: {
                username: this._options.username,
                password: this._options.key
            },
            headers: data.getHeaders()
        });
    }
}

export default MailGun;