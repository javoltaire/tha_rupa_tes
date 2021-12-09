import Message from './message';
import ValidationError from './validation-error';

describe('Message', () => {
    describe('#subject getter', () => {
        it('returns the subject value', () => {
            const message = new Message('Subject', 'Body');
            expect(message.subject).toEqual('Subject');
        })
    })

    describe('#body getter', () => {
        it('returns the content body value', () => {
            const message = new Message('Subject', 'Body');
            expect(message.body).toEqual('Body');
        });
    });

    describe('#validate()', () => {
        describe('when the message is valid', () => {
            it('returns null', () => {
                const message = new Message('Subject', 'Body');
                expect(message.validate()).toBeNull();
            });
        });

        describe('when the subject is missing', () => {
            it('returns a validation error', () => {
                const message = new Message('', 'Body');
                expect(message.validate()).toBeInstanceOf(ValidationError);
            });
        });

        describe('when the body is missing', () => {
            it('returns a validation error', () => {
                const message = new Message('Subject', '');
                expect(message.validate()).toBeInstanceOf(ValidationError);
            });
        });
    });
});