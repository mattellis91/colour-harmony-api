const colorConverter = require('../../lib/colorConverter');
const colorCalculator = require('../../lib/colorCalculator');
const util = require('../../lib/util');
const validator = require('../../lib/validator');
const response = require('../../lib/response');
express = require('express');router = express.Router();

router.get('/',(req, res, next) => {
    getDarkenResponse(req,res,undefined);
});

const getDarkenResponse = (req,res,method) => {
    const params = req.query;
    const color = util.getColorValue(params);
    if(!color) {
        return res.send(response.buildErrorResponse(req,2,response.NO_COLOR_PROVIDED));
    }
    let validCheck;
    let rgb;
    return res.send(color);
    switch(color.type) {
        case 'hex': 
            validCheck = validator.isValidHex(color.value);
            if(!validCheck.success) {
                //return res.send(response.buildErrorResponse(req,2,validCheck.error));
            }
            return res.send(response.buildSuccessResponse(req, harmonyMethod(color.value, color.value)));
        case 'hsl': 
            validCheck = validator.isValidHsl(color.value);
            if(!validCheck.success) {
                //eturn res.send(response.buildErrorResponse(req,2,validCheck.error));
            }
            const hslObj = {'h' : color.value[0], 's': color.value[1], 'l': color.value[2]};
            rgb = colorConverter.hslToRgb(Number.parseInt(hslObj.h) / 360, Number.parseInt(hslObj.s) / 100, Number.parseInt(hslObj.l) / 100);
            //return res.send(response.buildSuccessResponse(req, harmonyMethod(rgb, hslObj)));
        case 'hsv': 
            validCheck = validator.isValidHsv(color.value);
            if(!validCheck.success) {
                return res.send(response.buildErrorResponse(req,2,validCheck.error));
            }
            const hsvObj = {'h' : color.value[0], 's': color.value[1], 'v': color.value[2]};
            rgb = colorConverter.hsvToRgb(hsvObj.h / 360,hsvObj.s / 100,hsvObj.v / 100);
            //return res.send(response.buildSuccessResponse(req,harmonyMethod(rgb, hsvObj)));
        case 'rgb': 
            validCheck = validator.isValidRgb(color.value);
            if(!validCheck.success) {
                return res.send(response.buildErrorResponse(req,2,validCheck.error));
            }
            rgb = {'r' : color.value[0], 'g': color.value[1], 'b': color.value[2]};
            //return res.send(response.buildSuccessResponse(req,harmonyMethod(rgb,rgb)));
    }
}

module.exports = router;