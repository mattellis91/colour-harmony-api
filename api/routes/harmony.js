const colorCalculator = require('../../lib/colorCalculator');
const util = require('../../lib/util');
const validator = require('../../lib/validator');
const error = require('../../lib/error');
express = require('express');router = express.Router();

router.get('/complementary',(req, res, next) => {
    const params = req.query;
    const color = util.getColorValue(params);
    if(!color) {
        return res.send(error.buildErrorResponse(req,2,error.NO_COLOR_PROVIDED));
    }
    switch(color.type) {
        case 'hex': 
            if(!validator.isValidHex(color.value)) {
                return res.send(error.buildErrorResponse(req,2,error.INVALID_HEX));
            }
        case 'hsl': 
            break;
        
        case 'hsv': 
            break;
        
        case 'rgb': 
            break;
        
    }
    res.send(color);
});

const validateParams = (params) => {
    console.log(params)
}

module.exports = router;