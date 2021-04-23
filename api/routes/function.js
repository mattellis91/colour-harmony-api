const colorConverter = require('../../lib/colorConverter');
const colorCalculator = require('../../lib/colorCalculator');
const util = require('../../lib/util');
const validator = require('../../lib/validator');
const response = require('../../lib/response');
express = require('express');router = express.Router();


router.get('/darken',(req, res, next) => {
    getDarkenOrLightenResponse(req,res,'darken');
});

router.get('/lighten',(req, res, next) => {
    getDarkenOrLightenResponse(req,res,'lighten');
});

router.get('/invert',(req, res, next) => {
    const params = req.query;
    const color = util.getColorValue(params);
    if(!color) {
        return res.send(response.buildErrorResponse(req,2,response.NO_COLOR_PROVIDED));
    }
    let hex;
    let rgb;
    let result;
    switch(color.type) {
        case 'hex': 
            validCheck = validator.isValidHex(color.value);
            if(!validCheck.success) {
                return res.send(response.buildErrorResponse(req,2,validCheck.error));
            }
            result = colorCalculator.invertColor(color.value, color.value);
            return res.send(response.buildSuccessResponse(req,result));
        case 'hsl': 
            validCheck = validator.isValidHsl(color.value);
            if(!validCheck.success) {
                return res.send(response.buildErrorResponse(req,2,validCheck.error));
            }
            const hslObj = {'h' : color.value[0], 's': color.value[1], 'l': color.value[2]};
            rgb = colorConverter.hslToRgb(Number.parseInt(hslObj.h) / 360, Number.parseInt(hslObj.s) / 100, Number.parseInt(hslObj.l) / 100);
            hex = colorConverter.convertRGBtoHex(rgb);
            result = colorCalculator.invertColor(hex,hslObj);
            return res.send(response.buildSuccessResponse(req,result));
        case 'hsv': 
            validCheck = validator.isValidHsv(color.value);
            if(!validCheck.success) {
                return res.send(response.buildErrorResponse(req,2,validCheck.error));
            }
            const hsvObj = {'h' : color.value[0], 's': color.value[1], 'v': color.value[2]};
            rgb = colorConverter.hsvToRgb(hsvObj.h / 360,hsvObj.s / 100,hsvObj.v / 100);
            hex = colorConverter.convertRGBtoHex(rgb);
            result = colorCalculator.invertColor(hex,hsvObj);
            return res.send(response.buildSuccessResponse(req,result));
        case 'rgb': 
            validCheck = validator.isValidRgb(color.value);
            if(!validCheck.success) {
                return res.send(response.buildErrorResponse(req,2,validCheck.error));
            }
            rgb = {r:color.value[0], g:color.value[1], b:color.value[2]};
            hex = colorConverter.convertRGBtoHex(rgb);
            result = colorCalculator.invertColor(hex,rgb);
            return res.send(response.buildSuccessResponse(req,result));
    }
});


router.get('/shift',(req,res,next) => {
    const params = req.query;
    const color = util.getColorValue(params);
    const degrees = Number.parseInt(util.getDegreesAmount(params));
    if(!color) {
        return res.send(response.buildErrorResponse(req,2,response.NO_COLOR_PROVIDED));
    }
    validateDegrees = validator.isValidDegrees(degrees);
    if(!validateDegrees.success) {
        return res.send(response.buildErrorResponse(req,2,response.validateDegrees.error));
    }
    let rgb;
    let result;
    switch(color.type) {
        case 'hex': 
            validCheck = validator.isValidHex(color.value);
            if(!validCheck.success) {
                return res.send(response.buildErrorResponse(req,2,validCheck.error));
            }
            rgb = colorConverter.convertHextoRGB(color.value);
            result = colorCalculator.shiftHue(rgb,degrees,color.value);
            return res.send(response.buildSuccessResponse(req,result));
        case 'hsl': 
            validCheck = validator.isValidHsl(color.value);
            if(!validCheck.success) {
                return res.send(response.buildErrorResponse(req,2,validCheck.error));
            }
            const hslObj = {'h' : color.value[0], 's': color.value[1], 'l': color.value[2]};
            rgb = colorConverter.hslToRgb(Number.parseInt(hslObj.h) / 360, Number.parseInt(hslObj.s) / 100, Number.parseInt(hslObj.l) / 100);
            result = colorCalculator.shiftHue(rgb,degrees,hslObj);
            return res.send(response.buildSuccessResponse(req,result));
        case 'hsv': 
            validCheck = validator.isValidHsv(color.value);
            if(!validCheck.success) {
                return res.send(response.buildErrorResponse(req,2,validCheck.error));
            }
            const hsvObj = {'h' : color.value[0], 's': color.value[1], 'v': color.value[2]};
            rgb = colorConverter.hsvToRgb(hsvObj.h / 360,hsvObj.s / 100,hsvObj.v / 100);
            result = colorCalculator.shiftHue(rgb,degrees,hsvObj);
            return res.send(response.buildSuccessResponse(req,result));
        case 'rgb': 
            validCheck = validator.isValidRgb(color.value);
            if(!validCheck.success) {
                return res.send(response.buildErrorResponse(req,2,validCheck.error));
            }
            rgb = {r:color.value[0], g:color.value[1], b:color.value[2]}
            result = colorCalculator.shiftHue(rgb,degrees,rgb);
            return res.send(response.buildSuccessResponse(req,result));
    }
});

router.get('/random',(req, res, next) => {

    //TODO: add option to 
    const hex = colorCalculator.getRandomHex();
    const rgb = colorConverter.convertHextoRGB(hex);
    const hsv = colorConverter.rgbToHsv(rgb.r, rgb.g, rgb.b);
    const hsl = colorConverter.rgbToHsl(rgb.r, rgb.g, rgb.b);
    return res.send(response.buildSuccessResponse(req, {
        hex: hex,
        rgb: rgb,
        hsv: hsv,
        hsl: hsl
    }));
});

//TODO: add blend route

const getDarkenOrLightenResponse = (req,res,type) => {
    const params = req.query;
    const color = util.getColorValue(params);
    const percentage = util.getPercentage(params);
    const mode = util.getMode(params);
    const sign = type === 'darken' ? -1 : 1; 
    let rgb;
    if(!color) {
        return res.send(response.buildErrorResponse(req,2,response.NO_COLOR_PROVIDED));
    }
    validPercentage = validator.isValidPercentage(percentage);
    if(!validPercentage.success) {
        return res.send(response.buildErrorResponse(req,2,validPercentage.error));
    }
    let validCheck;
    let result;
    switch(color.type) {
        case 'hex': 
            validCheck = validator.isValidHex(color.value);
            if(!validCheck.success) {
                return res.send(response.buildErrorResponse(req,2,validCheck.error));
            }
            rgb = colorConverter.convertHextoRGB(color.value);
            result = colorCalculator.darkenOrLighten(rgb,Number.parseInt(percentage) / 100, color.value, sign, mode);
            return res.send(response.buildSuccessResponse(req,result));
        case 'hsl': 
            validCheck = validator.isValidHsl(color.value);
            if(!validCheck.success) {
                return res.send(response.buildErrorResponse(req,2,validCheck.error));
            }
            const hslObj = {'h' : color.value[0], 's': color.value[1], 'l': color.value[2]};
            rgb = colorConverter.hslToRgb(Number.parseInt(hslObj.h) / 360, Number.parseInt(hslObj.s) / 100, Number.parseInt(hslObj.l) / 100);
            result = colorCalculator.darkenOrLighten(rgb,Number.parseInt(percentage) / 100, hslObj, sign, mode);
            return res.send(response.buildSuccessResponse(req,result));
        case 'hsv': 
            validCheck = validator.isValidHsv(color.value);
            if(!validCheck.success) {
                return res.send(response.buildErrorResponse(req,2,validCheck.error));
            }
            const hsvObj = {'h' : color.value[0], 's': color.value[1], 'v': color.value[2]};
            rgb = colorConverter.hsvToRgb(hsvObj.h / 360,hsvObj.s / 100,hsvObj.v / 100);
            result = colorCalculator.darkenOrLighten(rgb,Number.parseInt(percentage) / 100, hsvObj, sign, mode);
            return res.send(response.buildSuccessResponse(req,result));
        case 'rgb': 
            validCheck = validator.isValidRgb(color.value);
            if(!validCheck.success) {
                return res.send(response.buildErrorResponse(req,2,validCheck.error));
            }
            rgb = {r:color.value[0], g:color.value[1], b:color.value[2]}
            result = colorCalculator.darkenOrLighten(rgb,Number.parseInt(percentage) / 100, rgb, sign, mode);
            return res.send(response.buildSuccessResponse(req,result));
    }
}

module.exports = router;