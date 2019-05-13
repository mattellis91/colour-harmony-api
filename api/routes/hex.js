colorCalculator = require('../../colorCalculator');
express = require('express');
router = express.Router();

router.get('/complementary/:hexcode', (req, res, next) => {
    res.send(colorCalculator.calculateComplementary(req.params.hexcode));
});

router.get('/splitcomplementary/:hexcode', (req, res, next) => {
    res.send(colorCalculator.calculateSplitComplementary(req.params.hexcode));
});

router.get('/triadic/:hexcode', (req, res, next) => {
    res.send(colorCalculator.calculateTriadic(req.params.hexcode));
});

router.get('/tetradic/:hexcode', (req, res, next) => {
    res.send(colorCalculator.calculateTetradic(req.params.hexcode));
});

router.get('/analagous/:hexcode', (req, res, next) => {
    res.send(colorCalculator.calculateAnalagous(req.params.hexcode));
});

module.exports = router;