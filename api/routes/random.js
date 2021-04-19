const colorConverter = require('../../lib/colorConverter');
const colorCalculator = require('../../lib/colorCalculator');
const util = require('../../lib/util');
const validator = require('../../lib/validator');
const response = require('../../lib/response');
express = require('express');router = express.Router();

router.get('/',(req, res, next) => {
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

module.exports = router;