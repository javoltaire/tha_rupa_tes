import Courier from "./courier";

class SendGrid extends Courier {
    async sendMessage(sender, recipient, message) {
        return new Promise((resolve) => setTimeout(() => {
            resolve(console.log(sender, recipient, message))
        }, 5))
    }
}

export default SendGrid;