import CustomValidationError from '../entities/validation-error';

const escapeHtml = unsafe => unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");

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

export { escapeHtml, schemaValidate };