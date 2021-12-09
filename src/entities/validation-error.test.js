import ValidationError from './validation-error';

describe('ValidationError', () => {
    describe('#details getter', () => {
        it('returns the details of the error', () => {
            const err = new ValidationError('InvalidEntity', {});
            expect(err.details).toEqual({});
        })
    })
});