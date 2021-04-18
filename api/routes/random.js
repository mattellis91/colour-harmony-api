const colorCalculator = require('../../lib/colorCalculator');
const util = require('../../lib/util');
const validator = require('../../lib/validator');
const response = require('../../lib/response');
express = require('express');router = express.Router();

router.get('/',(req, res, next) => {
    res.send("random");
});

module.exports = router;