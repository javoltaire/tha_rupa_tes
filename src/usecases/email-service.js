class EmailService {
    constructor(courier) {
        this._courier = courier;
    }

    async sendEmail(sender, recipient, message, {
        onSuccess = () => { },
        onDeliveryError = () => { },
        onInvalidRecipent = () => { },
        onInvalidSender = () => { },
        onInvalidMessage = () => { },
        onUnauthorizedError = () => { }
    } = {}) {
        const senderError = sender.validate();
        if (senderError) {
            onInvalidSender(senderError, sender);
            return;
        }

        const recipientError = recipient.validate();
        if (recipientError) {
            onInvalidRecipent(recipientError, recipient);
            return;
        }

        const messageError = message.validate();
        if (messageError) {
            onInvalidMessage(messageError, message);
            return;
        }

        try {
            await this._courier.sendMessage(sender, recipient, message);
            onSuccess(sender, recipient, message);
        } catch (e) {
            if (e.response?.status === 401) {
                onUnauthorizedError(e)
            } else {
                onDeliveryError(e);
            }
        }
    }
}

export default EmailService;