colorCalculator = require('../../colorCalculator');
express = require('express');
router = express.Router();

router.get('/complementary/:r/:g/:b', (req, res, next) => {
    let rgb = [req.params.r, req.params.g, req.params.b];
    res.send(colorCalculator.calculateComplementary(rgb));
});

router.get('/splitcomplementary/:r/:g/:b', (req, res, next) => {
    let rgb = [req.params.r, req.params.g, req.params.b];
    res.send(colorCalculator.calculateSplitComplementary(rgb));
});

router.get('/triadic/:r/:g/:b', (req, res, next) => {
    let rgb = [req.params.r, req.params.g, req.params.b];
    res.send(colorCalculator.calculateTriadic(rgb));
});

router.get('/tetradic/:r/:g/:b', (req, res, next) => {
    let rgb = [req.params.r, req.params.g, req.params.b];
    res.send(colorCalculator.calculateTetradic(rgb));
});

router.get('/analagous/:r/:g/:b', (req, res, next) => {
    let rgb = [req.params.r, req.params.g, req.params.b];
    res.send(colorCalculator.calculateAnalagous(rgb));
});

module.exports = router;