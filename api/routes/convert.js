const colorConverter = require('../../lib/colorConverter');
const util = require('../../lib/util');
const validator = require('../../lib/validator');
const response = require('../../lib/response');
express = require('express');
router = express.Router();

const validateRoute = (req, getMethod, validateMethod, colorType) => {
    const params = req.query;
    const color = colorType ? getMethod(params,colorType) : getMethod(params) ;
    if(!color) {
        return response.buildErrorResponse(req,2,response.NO_COLOR_PROVIDED);
    }
    const validCheck = validateMethod(color);
    if(!validCheck.success) {
        return response.buildErrorResponse(req,2,validCheck.error);
    }
    return {color: color, status : 1}
}

router.get('/hexToRGB',(req, res, next) => {
    const validRouteResponse = validateRoute(req, util.getHex, validator.isValidHex);
    if(validRouteResponse.status !== 1) {
        return res.send(validRouteResponse);
    }
    hex = validRouteResponse.color;
    return res.send(response.buildSuccessResponse(req, colorConverter.convertHextoRGB(hex)));
});

router.get('/hexToHSV',(req, res, next) => {
    const validRouteResponse = validateRoute(req, util.getHex, validator.isValidHex);
    if(validRouteResponse.status !== 1) {
        return res.send(validRouteResponse);
    }
    const hex = validRouteResponse.color;
    const rgb = colorConverter.convertHextoRGB(hex);
    return res.send(response.buildSuccessResponse(req, colorConverter.rgbToHsv(rgb.r,rgb.g,rgb.b)));
});

router.get('/hexToHSL',(req, res, next) => {
    const validRouteResponse = validateRoute(req, util.getHex, validator.isValidHex);
    if(validRouteResponse.status !== 1) {
        return res.send(validRouteResponse);
    }
    const hex = validRouteResponse.color;
    const rgb = colorConverter.convertHextoRGB(hex);
    return res.send(response.buildSuccessResponse(req, colorConverter.rgbToHsl(rgb.r,rgb.g,rgb.b)));
});


router.get('/hexToAll',(req, res, next) => {
    const validRouteResponse = validateRoute(req, util.getHex, validator.isValidHex);
    if(validRouteResponse.status !== 1) {
        return res.send(validRouteResponse);
    }
    const hex = validRouteResponse.color;
    const rgb = colorConverter.convertHextoRGB(hex);
    const hsl = colorConverter.rgbToHsl(rgb.r,rgb.g,rgb.b);
    const hsv = colorConverter.rgbToHsv(rgb.r,rgb.g,rgb.b);
    return res.send(response.buildSuccessResponse(req, {
        hsl:hsl,
        hsv:hsv,
        rgb:rgb
    }));
});

router.get('/RGBtoHex',(req, res, next) => {
    const validRouteResponse = validateRoute(req, util.getColorArray, validator.isValidRgb, 'rgb');
    if(validRouteResponse.status !== 1) {
        return res.send(validRouteResponse);
    }
    const rgb = validRouteResponse.color;
    return res.send(response.buildSuccessResponse(req, colorConverter.convertRGBtoHex({r:rgb[0], g:rgb[1], b:rgb[2]})));
});

router.get('/RGBtoHSV',(req, res, next) => {
    const validRouteResponse = validateRoute(req, util.getColorArray, validator.isValidRgb, 'rgb');
    if(validRouteResponse.status !== 1) {
        return res.send(validRouteResponse);
    }
    const rgb = validRouteResponse.color;
    return res.send(response.buildSuccessResponse(req, colorConverter.rgbToHsv(rgb[0],rgb[1],rgb[2])));
});

router.get('/RGBtoHSL',(req, res, next) => {
    const validRouteResponse = validateRoute(req, util.getColorArray, validator.isValidRgb, 'rgb');
    if(validRouteResponse.status !== 1) {
        return res.send(validRouteResponse);
    }
    const rgb = validRouteResponse.color;
    return res.send(response.buildSuccessResponse(req, colorConverter.rgbToHsl(rgb[0],rgb[1],rgb[2])));
});

router.get('/RGBtoAll',(req, res, next) => {
    const validRouteResponse = validateRoute(req, util.getColorArray, validator.isValidRgb, 'rgb');
    if(validRouteResponse.status !== 1) {
        return res.send(validRouteResponse);
    }
    const rgb = validRouteResponse.color;
    const hex = colorConverter.convertRGBtoHex({r:rgb[0], g:rgb[1], b:rgb[2]});
    const hsv = colorConverter.rgbToHsv(rgb[0],rgb[1],rgb[2]);
    const hsl = colorConverter.rgbToHsl(rgb[0],rgb[1],rgb[2]);
    return res.send(response.buildSuccessResponse(req, {
        hex: hex,
        hsv: hsv,
        hsl: hsl
    }));
});

router.get('/HSVtoHex',(req, res, next) => {
    const validRouteResponse = validateRoute(req, util.getColorArray, validator.isValidHsv, 'hsv');
    if(validRouteResponse.status !== 1) {
        return res.send(validRouteResponse);
    }
    const color = validRouteResponse.color
    const hsvObj = {'h' : Number.parseInt(color[0]), 's': Number.parseInt(color[1]), 'v': Number.parseInt(color[2])};
    const rgb = colorConverter.hsvToRgb(hsvObj.h / 360,hsvObj.s / 100,hsvObj.v / 100);
    return res.send(response.buildSuccessResponse(req, colorConverter.convertRGBtoHex(rgb)));
        
});

router.get('/HSVtoRGB',(req, res, next) => {
    const validRouteResponse = validateRoute(req, util.getColorArray, validator.isValidHsv, 'hsv');
    if(validRouteResponse.status !== 1) {
        return res.send(validRouteResponse);
    }
    const color = validRouteResponse.color
    const hsvObj = {'h' : Number.parseInt(color[0]), 's': Number.parseInt(color[1]), 'v': Number.parseInt(color[2])};
    return res.send(response.buildSuccessResponse(req, colorConverter.hsvToRgb(hsvObj.h / 360,hsvObj.s / 100,hsvObj.v / 100)));
});

router.get('/HSVtoHSL',(req, res, next) => {
    const validRouteResponse = validateRoute(req, util.getColorArray, validator.isValidHsv, 'hsv');
    if(validRouteResponse.status !== 1) {
        return res.send(validRouteResponse);
    }
    const color = validRouteResponse.color
    const hsvObj = {'h' : Number.parseInt(color[0]), 's': Number.parseInt(color[1]), 'v': Number.parseInt(color[2])};
    const rgb = colorConverter.hsvToRgb(hsvObj.h / 360,hsvObj.s / 100,hsvObj.v / 100);
    return res.send(response.buildSuccessResponse(req, colorConverter.rgbToHsl(rgb.r,rgb.g,rgb.b)));
});

router.get('/HSVtoAll',(req, res, next) => {
    const validRouteResponse = validateRoute(req, util.getColorArray, validator.isValidHsv, 'hsv');
    if(validRouteResponse.status !== 1) {
        return res.send(validRouteResponse);
    }
    const color = validRouteResponse.color
    const hsvObj = {'h' : Number.parseInt(color[0]), 's': Number.parseInt(color[1]), 'v': Number.parseInt(color[2])};
    const rgb = colorConverter.hsvToRgb(hsvObj.h / 360,hsvObj.s / 100,hsvObj.v / 100);
    const hex = colorConverter.convertRGBtoHex(rgb);
    const hsl = colorConverter.rgbToHsl(rgb.r,rgb.g,rgb.b);
    return res.send(response.buildSuccessResponse(req, {
        rgb:rgb,
        hex:hex,
        hsl:hsl
    }));
});

router.get('/HSLtoHex',(req, res, next) => {
    const validRouteResponse = validateRoute(req, util.getColorArray, validator.isValidHsl, 'hsl');
    if(validRouteResponse.status !== 1) {
        return res.send(validRouteResponse);
    }
    const color = validRouteResponse.color
    const hslObj = {'h' : color[0], 's': color[1], 'l': color[2]};
    const rgb = colorConverter.hslToRgb(hslObj.h / 360, hslObj.s / 100, hslObj.l / 100);
    return res.send(response.buildSuccessResponse(req, colorConverter.convertRGBtoHex(rgb)));
});

router.get('/HSLtoRGB',(req, res, next) => {
    const validRouteResponse = validateRoute(req, util.getColorArray, validator.isValidHsl, 'hsl');
    if(validRouteResponse.status !== 1) {
        return res.send(validRouteResponse);
    }
    const color = validRouteResponse.color
    const hslObj = {'h' : color[0], 's': color[1], 'l': color[2]};
    return res.send(response.buildSuccessResponse(req, colorConverter.hslToRgb(hslObj.h / 360, hslObj.s / 100, hslObj.l / 100)));
});

router.get('/HSLtoHSV',(req, res, next) => {
    const validRouteResponse = validateRoute(req, util.getColorArray, validator.isValidHsl, 'hsl');
    if(validRouteResponse.status !== 1) {
        return res.send(validRouteResponse);
    }
    const color = validRouteResponse.color
    const hslObj = {'h' : color[0], 's': color[1], 'l': color[2]};
    const rgb = colorConverter.hslToRgb(hslObj.h / 360, hslObj.s / 100, hslObj.l / 100);
    return res.send(response.buildSuccessResponse(req, colorConverter.rgbToHsv(rgb.r,rgb.g,rgb.b)));
});

router.get('/HSLtoAll',(req, res, next) => {
    const validRouteResponse = validateRoute(req, util.getColorArray, validator.isValidHsl, 'hsl');
    if(validRouteResponse.status !== 1) {
        return res.send(validRouteResponse);
    }
    const color = validRouteResponse.color
    const hslObj = {'h' : color[0], 's': color[1], 'l': color[2]};
    const rgb = colorConverter.hslToRgb(hslObj.h / 360, hslObj.s / 100, hslObj.l / 100);
    const hsv = colorConverter.rgbToHsv(rgb.r,rgb.g,rgb.b);
    const hex = colorConverter.convertRGBtoHex(rgb);
    return res.send(response.buildSuccessResponse(req, {
        rgb:rgb,
        hsv:hsv,
        hex:hex
    }));
});


module.exports = router;