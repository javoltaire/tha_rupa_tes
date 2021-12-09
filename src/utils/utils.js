import CustomValidationError from '../entities/validation-error';

const schemaValidate = (value, schema) => {
    try {
        schema.validateSync(value);
    } catch (e) {
        if (e.name === 'ValidationError') {
            // TODO parse e for specific field errors
            return new CustomValidationError('Invalid Contact', {}) 
        }
    }
    return null;
}

export { schemaValidate };