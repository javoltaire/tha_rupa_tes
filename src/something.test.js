import Something from "./something";

describe('Something', () => {
    let subject;

    beforeEach(() => {
        subject = new Something('mything');
    });

    describe('#thing', () => {
        it('returns the thing', () => {
            expect(subject.thing).toEqual('mything');
        });
    });
});