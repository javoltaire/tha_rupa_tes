import EmailService from './email-service';
import Courier from '../infrastructures/couriers/courier';
import { Contact, Message, ValidationError } from '../entities';

jest.mock('../entities/Contact');
jest.mock('../entities/Message');

class MockCourier extends Courier {
    constructor({ mockSend = jest.fn() } = {}) {
        super();
        this._mockSend = mockSend;
    }

    async sendMessage(sender, recipient, message) {
        return new Promise((resolve, reject) => setTimeout(() => {
            console.log('helllslsllsllsllooooooo')
            try {
                resolve(this._mockSend());
            } catch (e) {
                reject(e);
            }
        }, 5))
    }
}

describe('EmailService', () => {
    let mockSendMessage;
    let courier;
    let sender;
    let recipient;
    let message;
    let service;

    beforeEach(() => {
        Contact.mockClear();
        Message.mockClear();
    });

    beforeEach(() => {
        mockSendMessage = jest.fn();
        courier = new MockCourier({ mockSend: mockSendMessage });
        sender = new Contact();
        recipient = new Contact();
        message = new Message();
        service = new EmailService(courier);
    })

    describe('#sendEmail()', () => {
        describe('when all contacts and message are valid', () => {
            beforeEach(() => {
                jest.spyOn(sender, 'validate').mockReturnValue(null);
                jest.spyOn(recipient, 'validate').mockReturnValue(null);
                jest.spyOn(message, 'validate').mockReturnValue(null);
            });

            it('attempts to deliver the message', async () => {
                await service.sendEmail(sender, recipient, message, { onSuccess: jest.fn() });
                expect(mockSendMessage).toHaveBeenCalled();
            });
        });

        describe('when the sender is not valid', () => {
            beforeEach(() => {
                jest.spyOn(message, 'validate').mockReturnValue(null);
                jest.spyOn(recipient, 'validate').mockReturnValue(null);
                jest.spyOn(sender, 'validate').mockReturnValue(new ValidationError('Bad', {}));
            });

            it('does NOT attempt to deliver the message', async () => {
                await service.sendEmail(sender, recipient, message, { onSuccess: jest.fn() });
                expect(mockSendMessage).not.toHaveBeenCalled();
            });

            it('notifies that the sender is not valid', async () => {
                const mockonInvalidSender = jest.fn();
                await service.sendEmail(sender, recipient, message, { onInvalidSender: mockonInvalidSender });
                expect(mockonInvalidSender).toHaveBeenCalled();
            });
        });

        describe('when the recipient is not valid', () => {
            beforeEach(() => {
                jest.spyOn(sender, 'validate').mockReturnValue(null);
                jest.spyOn(message, 'validate').mockReturnValue(null);
                jest.spyOn(recipient, 'validate').mockReturnValue(new ValidationError('Bad', {}));
            });

            it('does NOT attempt to deliver the message', async () => {
                await service.sendEmail(sender, recipient, message, { onSuccess: jest.fn() });
                expect(mockSendMessage).not.toHaveBeenCalled();
            });

            it('notifies that the message is not valid', async () => {
                const mockOnInvalidRecipent = jest.fn();
                await service.sendEmail(sender, recipient, message, { onInvalidRecipent: mockOnInvalidRecipent });
                expect(mockOnInvalidRecipent).toHaveBeenCalled();
            });
        });

        describe('when the message is not valid', () => {
            beforeEach(() => {
                jest.spyOn(sender, 'validate').mockReturnValue(null);
                jest.spyOn(recipient, 'validate').mockReturnValue(null);
                jest.spyOn(message, 'validate').mockReturnValue(new ValidationError('Bad', {}));
            });

            it('does NOT attempt to deliver the message', async () => {
                await service.sendEmail(sender, recipient, message, { onSuccess: jest.fn() });
                expect(mockSendMessage).not.toHaveBeenCalled();
            });

            it('notifies that the message is not valid', async () => {
                const mockOnInvalidMessage = jest.fn();
                await service.sendEmail(sender, recipient, message, { onInvalidMessage: mockOnInvalidMessage });
                expect(mockOnInvalidMessage).toHaveBeenCalled();
            });
        });

        describe('when an error occurs while attempting to deliver the message', () => {
            beforeEach(() => {
                courier = new MockCourier({ mockSend: jest.fn().mockImplementation(() => { throw new Error('Service down') })})
                service = new EmailService(courier);
                jest.spyOn(sender, 'validate').mockReturnValue(null);
                jest.spyOn(recipient, 'validate').mockReturnValue(null);
                jest.spyOn(message, 'validate').mockReturnValue(null);
            });

            it('notifies of the failure', async () => {
                const mockOnDeliveryError = jest.fn();
                await service.sendEmail(sender, recipient, message, { onDeliveryError: mockOnDeliveryError });
                expect(mockOnDeliveryError).toHaveBeenCalled();
            });
        })
    });
});