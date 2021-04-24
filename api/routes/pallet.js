const colorConverter = require('../../lib/colorConverter');
const colorCalculator = require('../../lib/colorCalculator');
const util = require('../../lib/util');
const validator = require('../../lib/validator');
const response = require('../../lib/response');
express = require('express');router = express.Router();

router.get('/monochromatic',(req, res, next) => {
    const params = req.query;
    const color = util.getColorValue(params);
    const direction = util.getDirection(params);
    const steps = Number.parseInt(util.getSteps(params));
    if(!color) {
        return res.send(response.buildErrorResponse(req,2,response.NO_COLOR_PROVIDED));
    }
    const validStepsChecks = validator.isValidSteps(steps);
    if(!validStepsChecks.success) {
        return res.send(response.buildErrorResponse(req,2,validStepsChecks.error));
    }
    let validCheck;
    let rgb;
    let hsl;
    let result;
    switch(color.type) {
        case 'hex': 
            validCheck = validator.isValidHex(color.value);
            if(!validCheck.success) {
                return res.send(response.buildErrorResponse(req,2,validCheck.error));
            }
            rgb = colorConverter.convertHextoRGB(color.value);
            console.log(rgb);
            hsl = colorConverter.rgbToHsl(rgb.r,rgb.g,rgb.b);
            console.log(hsl);
            result = colorCalculator.generateMonochrome(hsl,color.value,steps,direction);
            return res.send(response.buildSuccessResponse(req,result));
        case 'hsl': 
            validCheck = validator.isValidHsl(color.value);
            if(!validCheck.success) {
                return res.send(response.buildErrorResponse(req,2,validCheck.error));
            }
            hsl = {'h' : color.value[0], 's': color.value[1], 'l': color.value[2]};
            result = colorCalculator.generateMonochrome(hsl,hsl,steps,direction);
            return res.send(response.buildSuccessResponse(req,result));
        case 'hsv': 
            validCheck = validator.isValidHsv(color.value);
            if(!validCheck.success) {
                return res.send(response.buildErrorResponse(req,2,validCheck.error));
            }
            const hsvObj = {'h' : color.value[0], 's': color.value[1], 'v': color.value[2]};
            rgb = colorConverter.hsvToRgb(hsvObj.h / 360,hsvObj.s / 100,hsvObj.v / 100);
            hsl = colorConverter.rgbToHsl(rgb.r,rgb.g,rgb.b);
            result = colorCalculator.generateMonochrome(hsl,hsvObj,steps,direction);
            return res.send(response.buildSuccessResponse(req,result));
        case 'rgb': 
            validCheck = validator.isValidRgb(color.value);
            if(!validCheck.success) {
                return res.send(response.buildErrorResponse(req,2,validCheck.error));
            }
            rgb = {r: color.value[0],g: color.value[1],b: color.value[2]}
            hsl = colorConverter.rgbToHsl(rgb.r,rgb.g,rgb.b);
            result = colorCalculator.generateMonochrome(hsl,rgb,steps,direction);
            return res.send(response.buildSuccessResponse(req,result));
    }
});

router.get('/gradient',(req, res, next) => {
    const params = req.query;
    const colors = util.getStartEndColorValues(params);
    const steps = Number.parseInt(util.getSteps(params));
    const validStepsChecks = validator.isValidSteps(steps);
    if(!validStepsChecks.success) {
        return res.send(response.buildErrorResponse(req,2,validStepsChecks.error));
    }
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
                        sourceRGB :[rgb.r, rgb.g, rgb.b],
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
                        sourceRGB: [rgb.r, rgb.g, rgb.b],
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
                        sourceRGB: [rgb.r, rgb.g, rgb.b],
                        sourceOriginal: hsvObj
                    });
                case 'rgb':
                    validCheck = validator.isValidRgb(colors[i].value);
                    if(!validCheck.success) {
                        return res.send(response.buildErrorResponse(req,2,validCheck.error));
                    }
                    functionColors.push({
                        sourceRGB: colors[i].value,
                        sourceOriginal: {r:colors[i].value[0], g:colors[i].value[1], b:colors[i].value[2]}
                    });
            }
        }
        const result = colorCalculator.interpolateColors(functionColors[0].sourceRGB, functionColors[1].sourceRGB, 
            functionColors[0].sourceOriginal, functionColors[1].sourceOriginal, steps);
        return res.send(response.buildSuccessResponse(req,result));
    } else {
        return res.send(response.buildErrorResponse(req,2,response.NO_START_END_COLOR_PROVIDED));
    }
});

module.exports = router;