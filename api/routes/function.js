const colorConverter = require('../../lib/colorConverter');
const colorCalculator = require('../../lib/colorCalculator');
const util = require('../../lib/util');
const validator = require('../../lib/validator');
const response = require('../../lib/response');
express = require('express');router = express.Router();

router.get('/darken',(req, res, next) => {
    getDarkenResponse(req,res,undefined);
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

//TODO: add lighten route
//TODO: add shift route
//TODO: add invert route
//TODO: add blend route


const getDarkenLightenResponse = (req,res,method) => {
    const params = req.query;
    const color = util.getColorValue(params);
    const percentage = util.getPercentage(params);
    if(!color) {
        return res.send(response.buildErrorResponse(req,2,response.NO_COLOR_PROVIDED));
    }
    validPercentage = validator.isValidPercentage(percentage);
    if(!validPercentage.success) {
        return res.send(response.buildErrorResponse(req,2,validPercentage.error));
    }
    let validCheck;
    let rgb;
    switch(color.type) {
        case 'hex': 
            validCheck = validator.isValidHex(color.value);
            if(!validCheck.success) {
                //return res.send(response.buildErrorResponse(req,2,validCheck.error));
            }
        case 'hsl': 
            validCheck = validator.isValidHsl(color.value);
            if(!validCheck.success) {
                //eturn res.send(response.buildErrorResponse(req,2,validCheck.error));
            }
            const hslObj = {'h' : color.value[0], 's': color.value[1], 'l': color.value[2]};
            rgb = colorConverter.hslToRgb(Number.parseInt(hslObj.h) / 360, Number.parseInt(hslObj.s) / 100, Number.parseInt(hslObj.l) / 100);
        case 'hsv': 
            validCheck = validator.isValidHsv(color.value);
            if(!validCheck.success) {
                return res.send(response.buildErrorResponse(req,2,validCheck.error));
            }
        const hsvObj = {'h' : color.value[0], 's': color.value[1], 'v': color.value[2]};
        rgb = colorConverter.hsvToRgb(hsvObj.h / 360,hsvObj.s / 100,hsvObj.v / 100);
        case 'rgb': 
            validCheck = validator.isValidRgb(color.value);
            if(!validCheck.success) {
                return res.send(response.buildErrorResponse(req,2,validCheck.error));
            }
            const result = colorCalculator.darken(color,Number.parseInt(percentage) / 100);
            return res.send(response.buildSuccessResponse(req,result));
    }
}
//
module.exports = router;