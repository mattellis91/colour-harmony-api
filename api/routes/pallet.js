const colorConverter = require('../../lib/colorConverter');
const colorCalculator = require('../../lib/colorCalculator');
const util = require('../../lib/util');
const validator = require('../../lib/validator');
const response = require('../../lib/response');
express = require('express');router = express.Router();

router.get('/monochromatic',(req, res, next) => {
    getDarkenResponse(req,res,undefined);
});

router.get('/gradient',(req, res, next) => {
    
});

module.exports = router;