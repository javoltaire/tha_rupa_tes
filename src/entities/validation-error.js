class ValidationError extends Error {
    constructor(messageStr, details) {
        super(messageStr);
        this._details = details;
    }

    get details() {
        return this._details;
    }
}

export default ValidationError;