import Contact from './contact';
import ValidationError from './validation-error';

describe('Contact', () => {
    describe('#name getter', () => {
        it('returns the contact\'s name', () => {
            const contact = new Contact('Name', 'Email');
            expect(contact.name).toEqual('Name');
        })
    })

    describe('#email getter', () => {
        it('returns the contact\'s email', () => {
            const contact = new Contact('Name', 'Email');
            expect(contact.email).toEqual('Email');
        });
    });

    describe('#validate()', () => {
        describe('when the contact is valid', () => {
            it('returns null', () => {
                const contact = new Contact('First Last', 'first.last@email.com');
                expect(contact.validate()).toBeNull();
            });
        });

        describe('when the name is missing', () => {
            it('returns a validation error', () => {
                const contact = new Contact('', 'first.last@email.com');
                expect(contact.validate()).toBeInstanceOf(ValidationError);
            });
        });

        describe('when the email is missing', () => {
            it('returns a validation error', () => {
                const contact = new Contact('First Last', '');
                expect(contact.validate()).toBeInstanceOf(ValidationError);
            });
        });

        describe('when the email is not formatted properly', () => {
            it('returns a validation error', () => {
                const contact = new Contact('', 'not an email');
                expect(contact.validate()).toBeInstanceOf(ValidationError);
            });
        });
    });
});