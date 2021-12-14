import Courier from "./courier";
import axios from 'axios';

class SendGrid extends Courier {
    constructor(options) {
        super();
        this._options = options;
    }

    async sendMessage(sender, recipient, message) {
        const url = `${this._options.host}/mail/send`;
        const data = {
            personalizations: [
              {
                from: { email: sender.email, name: sender.name },
                to: [{ email: recipient.email, name: recipient.name }],
              }
            ],
            from: { email: sender.email, name: sender.name },
            replyTo: { email: sender.email, name: sender.name },
            subject: message.subject,
            content: [
              {
                type: 'text/html',
                value: message.body
              }
            ],
          };

        return axios.post(url, data, { 
          headers: {
            Authorization: `Bearer ${this._options.key}`,
          }
        });
    }
}

export default SendGrid;