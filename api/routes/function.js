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

router.get('/blend', (req,res,next) => {
    const params = req.query;
    const colors = util.getStartEndColorValues(params);
    const mode = util.getMode(params);
    const percentage = util.getPercentage(params);
    const functionColors = [];
    let rgb;
    if(colors.length === 2) {
        for(let i = 0; i < 2; i ++) {
            switch(colors[i].type) {
                case 'hex':
                    validCheck = validator.isValidHex(colors[i].value);
                    if(!validCheck.success) {
                        return res.send(response.buildErrorResponse(req,2,validCheck.error));
                    }
                    rgb = colorConverter.convertHextoRGB(colors[i].value);
                    functionColors.push({
                        sourceRGB :"rgb("+rgb.r+","+rgb.g+","+rgb.b+")",
                        sourceOriginal: colors[i].value
                    });
                    break;
                case 'hsl':
                    validCheck = validator.isValidHsl(colors[i].value);
                    if(!validCheck.success) {
                        return res.send(response.buildErrorResponse(req,2,validCheck.error));
                    }
                    const hslObj = {'h' : colors[i].value[0], 's': colors[i].value[1], 'l': colors[i].value[2]};
                    rgb = colorConverter.hslToRgb(Number.parseInt(hslObj.h) / 360, Number.parseInt(hslObj.s) / 100, Number.parseInt(hslObj.l) / 100);
                    functionColors.push({
                        sourceRGB: "rgb("+rgb.r+","+rgb.g+","+rgb.b+")",
                        sourceOriginal: hslObj
                    });
                    break;
                case 'hsv':
                    validCheck = validator.isValidHsv(colors[i].value);
                    if(!validCheck.success) {
                        return res.send(response.buildErrorResponse(req,2,validCheck.error));
                    }
                    const hsvObj = {'h' : colors[i].value[0], 's': colors[i].value[1], 'v': colors[i].value[2]};
                    rgb = colorConverter.hsvToRgb(hsvObj.h / 360,hsvObj.s / 100,hsvObj.v / 100);        
                    functionColors.push({
                        sourceRGB: "rgb("+rgb.r+","+rgb.g+","+rgb.b+")",
                        sourceOriginal: hsvObj
                    });
                case 'rgb':
                    validCheck = validator.isValidRgb(colors[i].value);
                    if(!validCheck.success) {
                        return res.send(response.buildErrorResponse(req,2,validCheck.error));
                    }
                    functionColors.push({
                        sourceRGB: "rgb("+colors[i].value[0]+","+colors[i].value[1]+","+colors[i].value[2]+")",
                        sourceOriginal: {r:colors[i].value[0], g:colors[i].value[1], b:colors[i].value[2]}
                    });
            }
        }
        const result = colorCalculator.blend(functionColors[0].sourceRGB, functionColors[1].sourceRGB,
            functionColors[0].sourceOriginal, functionColors[1].sourceOriginal, Number.parseInt(percentage) / 100, mode);
        return res.send(response.buildSuccessResponse(req,result));
    } else {
        return res.send(response.buildErrorResponse(req,2,response.NO_START_END_COLOR_PROVIDED));
    }
});

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