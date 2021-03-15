module.exports = {
    getError(errors, property) {
        try {
            return errors.mapped()[property].msg
        } catch (err) {
            return "";
        }
    }
}