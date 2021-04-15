const validator = {
    isValidHex : (hex) => {
        const regex = /^([0-9a-f]{6})$/i;
        if(!regex.test(hex)) {
            return false;
        }   
        return true;
    }
}


module.exports = validator;