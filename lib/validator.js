const validator = {

    INVALID_HEX: "Hex code must be valid hex code with 6 characters",
    INVALID_HSL_LENGTH: "hsl property must have 3 components",
    INVALID_HSV_LENGTH: "hsv property must have 3 components",
    INVALID_RGB_LENGTH: "rgb property must have 3 components",
    INVALID_H_COMPONENT: "h component must be an integer between 0 and 360",
    INVALID_SL_COMPONENTS: "s and l components must be an integer between 0 and 100",
    INVALID_SV_COMPONENTS: "s and v components must be an integer between 0 and 100",
    INVALID_RGB_COMPONENTS: `rbg components must be integers between 0 and 255`,
    INVALID_PERCENTAGE: "percentage must be an integer between 0 and 100",
    INVALID_DEGREES: "degrees must be an integer between 0 and 360",
    INVALID_STEPS: "steps must be provided and be an integer",
    
    isValidHex : (hex) => {
        const regex = /^([0-9a-f]{6})$/i;
        if(!regex.test(hex)) {
            return {success:false, error: validator.INVALID_HEX};
        }   
        return {success:true, error: null};
    },

    isValidHsl: (hsl) => {
        if(hsl.length !== 3){
            return {success: false, error:validator.INVALID_HSL_LENGTH}
        }
        const hRegex =/^([0-9]|[1-9][0-9]|[12][0-9]{2}|3[0-5][0-9]|360)$/;
        if(!hRegex.test(hsl[0])) {
            return {success:false, error: validator.INVALID_H_COMPONENT}
        }
        const slRegex =/^([0-9]|[1-9][0-9]|100)$/;
        for(let i = 1; i < hsl.length; i++) {
            if(!slRegex.test(hsl[i])) {
                return {sucess:false, error: validator.INVALID_SL_COMPONENTS}
            }
        }
        return {success:true, error:null}
    },

    isValidDegrees: (degrees) => {
        const degreesRegex =/^([0-9]|[1-9][0-9]|[12][0-9]{2}|3[0-5][0-9]|360)$/;
        if(!degreesRegex.test(degrees)) {
            return {success:false, error: validator.INVALID_DEGREES}
        }
        return {success:true, error:null}
    },

    isValidSteps: (steps) => {
        const isValidSteps = Number.isInteger(steps);
        if(!isValidSteps) {
            return {success:false, error: validator.INVALID_STEPS}
        }
        return {success:true, error:null}
    },

    isValidHsv: (hsv) => {
        if(hsv.length !== 3){
            return {success: false, error:validator.INVALID_HSV_LENGTH}
        }
        const hRegex =/^([0-9]|[1-9][0-9]|[12][0-9]{2}|3[0-5][0-9]|360)$/;
        if(!hRegex.test(hsv[0])) {
            return {success:false, error: validator.INVALID_H_COMPONENT}
        }
        const slRegex =/^([0-9]|[1-9][0-9]|100)$/;
        for(let i = 1; i < hsv.length; i++) {
            if(!slRegex.test(hsv[i])) {
                return {sucess:false, error: validator.INVALID_SV_COMPONENTS}
            }
        }
        return {success:true, error:null}
    },

    isValidRgb: (rgb) => {
        if(rgb.length !== 3){
            return {success:false, error:validator.INVALID_RGB_LENGTH};
        }
        for(componentIndex in rgb) {
            const regex = /^([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])$/;
            if(!(regex.test(rgb[componentIndex]))){
                return {success:false, error:validator.INVALID_RGB_COMPONENTS};
            }
        }
        return {success:true, error:null};
    },

    isValidPercentage: (percentage) => {
        const regex = /^([0-9]|[1-9][0-9]|100)$/;
        if(!regex.test(percentage)) {
            return {success:false, error:validator.INVALID_PERCENTAGE};
        }
        return {success:true, error:null};
    }
}


module.exports = validator;