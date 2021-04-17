
colorConverter = require('../../lib/colorConverter');
express = require('express');
router = express.Router();

//refactor routes to use external validation methods from validation
//refactor routes to use error responses from errors

router.get('/hexToRGB',(req, res, next) => {
    if(req.query.hasOwnProperty('hex')) {
        let hex = req.query.hex;
        const regex = /^([0-9a-f]{6})$/i;
        if(!regex.test(hex)) {
            return res.send({
                status: 2,
                path:`${req.baseUrl}${req.path}`,
                message: "hex code must be valid hex code with 6 characters"
            })
        }
        const result = colorConverter.convertHextoRGB(hex);
        if(typeof(result) === 'object' && result.hasOwnProperty('r')
            && result.hasOwnProperty('g') && result.hasOwnProperty('b')
        ) {
            return res.send({
                status: 1,
                path:`${req.baseUrl}${req.path}`,
                hex: hex,
                rgb: result 
            });
        }

        return res.send({
            status:0,
            path:`${req.baseUrl}${req.path}`,
            message: "Error converting hex to RGB"
        });
    } else {
        return res.send({
            status: 2,
            path:`${req.baseUrl}${req.path}`,
            message: "query missing hex property"
        });
    }
});

router.get('/hexToHSV',(req, res, next) => {
    if(req.query.hasOwnProperty('hex')){
        const hex = req.query.hex;
        const regex = /^([0-9a-f]{6})$/i;
        if(!regex.test(hex)) {
            return res.send({
                status: 2,
                path:`${req.baseUrl}${req.path}`,
                message: "hex code must be valid hex code with 6 characters"
            })
        }
        const rgb = colorConverter.convertHextoRGB(hex);

        //failed to do hex to rgb conversion needed for final conversion 
        if(!(typeof(rgb) === 'object' && rgb.hasOwnProperty('r')
            && rgb.hasOwnProperty('g') && rgb.hasOwnProperty('b')
        )) {
            return res.send({
                status: 0,
                path:`${req.baseUrl}${req.path}`,
                message: "Error converting hex to HSV"
            });
        }
        
        const result = colorConverter.rgbToHsv(rgb.r,rgb.g,rgb.b);
        if(typeof(result) === 'object' && result.hasOwnProperty('h')
            && result.hasOwnProperty('s') && result.hasOwnProperty('v')
        ){
            return res.send({
                status: 1,
                path:`${req.baseUrl}${req.path}`,
                hex: hex,
                hsv: result
            })
        }

        return res.send({
            status: 0,
            path:`${req.baseUrl}${req.path}`,
            message: "Error converting hex to HSV"
        });

    } else {
        return res.send({
            status: 2,
            path:`${req.baseUrl}${req.path}`,
            message: "query missing hex property"
        });
    }
});

router.get('/hexToHSL',(req, res, next) => {
    if(req.query.hasOwnProperty('hex')){
        const hex = req.query.hex;
        const regex = /^([0-9a-f]{6})$/i;
        if(!regex.test(hex)) {
            return res.send({
                status: 2,
                path:`${req.baseUrl}${req.path}`,
                message: "hex code must be valid hex code with 6 characters"
            })
        }
        const rgb = colorConverter.convertHextoRGB(hex);

        //failed to do hex to rgb conversion needed for final conversion 
        if(!(typeof(rgb) === 'object' && rgb.hasOwnProperty('r')
            && rgb.hasOwnProperty('g') && rgb.hasOwnProperty('b')
        )) {
            return res.send({
                status: 0,
                path:`${req.baseUrl}${req.path}`,
                message: "Error converting hex to HSL"
            });
        }
        
        const result = colorConverter.rgbToHsl(rgb.r,rgb.g,rgb.b);
        if(typeof(result) === 'object' && result.hasOwnProperty('h')
            && result.hasOwnProperty('s') && result.hasOwnProperty('l')
        ){
            return res.send({
                status: 1,
                path:`${req.baseUrl}${req.path}`,
                hex: hex,
                hsl: result
            })
        }

        return res.send({
            status: 0,
            path:`${req.baseUrl}${req.path}`,
            message: "Error converting hex to HSL"
        });

    } else {
        return res.send({
            status: 2,
            path:`${req.baseUrl}${req.path}`,
            message: "query missing hex property"
        });
    }
});

router.get('/RGBtoHex',(req, res, next) => {
    if(req.query.hasOwnProperty('rgb')) {
        let rgb = req.query.rgb;
        const rgbList = req.query.rgb.split(',');
        if(rgbList.length !== 3){
            return res.send({
                status: 2,
                path:`${req.baseUrl}${req.path}`,
                message: `rbg property must have 3 components`
            })
        }

        for(componentIndex in rgbList) {
            const regex = /^([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])$/;
            if(!(regex.test(rgbList[componentIndex]))){
                return res.send({
                    status: 2,
                    path:`${req.baseUrl}${req.path}`,
                    message: `rbg components must be integers between 0 and 255`
                });
            }
            rgbList[componentIndex] = Number.parseInt(rgbList[componentIndex])
        }
        const rbgObj = {'r' : rgbList[0], 'g' : rgbList[1], 'b' : rgbList[2]};
        const result = colorConverter.convertRGBtoHex(rbgObj);
        if(result) {
            return res.send({
                status: 1,
                path:`${req.baseUrl}${req.path}`,
                rgb: rbgObj,
                hex: result 
            });
        }
        return res.send({
            status:0,
            path:`${req.baseUrl}${req.path}`,
            message: "Error converting RGB to hex"
        });
    } else {
        return res.send({
            status: 2,
            path:`${req.baseUrl}${req.path}`,
            message: "query missing rgb property"
        });
    }
});

router.get('/RGBtoHSV',(req, res, next) => {
    if(req.query.hasOwnProperty('rgb')) {
        const rgbList = req.query.rgb.split(',');
        if(rgbList.length !== 3){
            return res.send({
                status: 2,
                path:`${req.baseUrl}${req.path}`,
                message: `rbg property must have 3 components`
            })
        }

        for(componentIndex in rgbList) {
            const regex = /^([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])$/;
            if(!(regex.test(rgbList[componentIndex]))){
                return res.send({
                    status: 2,
                    path:`${req.baseUrl}${req.path}`,
                    message: `rbg components must be integers between 0 and 255`
                });
            }
            rgbList[componentIndex] = Number.parseInt(rgbList[componentIndex])
        }
        const rgbObj = {'r' : rgbList[0], 'g' : rgbList[1], 'b' : rgbList[2]};
        const result = colorConverter.rgbToHsv(rgbObj.r, rgbObj.g, rgbObj.b);
        if(typeof(result) === 'object' && result.hasOwnProperty('h')
            && result.hasOwnProperty('s') && result.hasOwnProperty('v')
        ){
            return res.send({
                status: 1,
                path:`${req.baseUrl}${req.path}`,
                rgb: rgbObj,
                hsv: result
            })
        }

        return res.send({
            status: 0,
            path:`${req.baseUrl}${req.path}`,
            message: "Error converting RGB to HSV"
        });

    } else {
        return res.send({
            status: 2,
            path:`${req.baseUrl}${req.path}`,
            message: "query missing hex rgb"
        });
    }
    
});

router.get('/RGBtoHSL',(req, res, next) => {
    if(req.query.hasOwnProperty('rgb')) {
        let rgb = req.query.rgb;
        const rgbList = req.query.rgb.split(',');
        if(rgbList.length !== 3){
            return res.send({
                status: 2,
                path:`${req.baseUrl}${req.path}`,
                message: `rbg property must have 3 components`
            })
        }

        for(componentIndex in rgbList) {
            const regex = /^([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])$/;
            if(!(regex.test(rgbList[componentIndex]))){
                return res.send({
                    status: 2,
                    path:`${req.baseUrl}${req.path}`,
                    message: `rbg components must be integers between 0 and 255`
                });
            }
            rgbList[componentIndex] = Number.parseInt(rgbList[componentIndex])
        }
        const rgbObj = {'r' : rgbList[0], 'g' : rgbList[1], 'b' : rgbList[2]};
        const result = colorConverter.rgbToHsl(rgbObj.r,rgbObj.g,rgbObj.b);
        if(typeof(result) === 'object' && result.hasOwnProperty('h')
            && result.hasOwnProperty('s') && result.hasOwnProperty('l')
        ){
            return res.send({
                status: 1,
                path:`${req.baseUrl}${req.path}`,
                rgb: rgbObj,
                hsl: result
            })
        }

        return res.send({
            status: 0,
            path:`${req.baseUrl}${req.path}`,
            message: "Error converting RGB to HSL"
        });

    } else {
        return res.send({
            status: 2,
            path:`${req.baseUrl}${req.path}`,
            message: "query missing rgb property"
        });
    }
});

router.get('/HSVtoHex',(req, res, next) => {
    if(req.query.hasOwnProperty('hsv')){
        const hsvList = req.query.hsv.split(',');
        if(hsvList.length !== 3){
            return res.send({
                status: 2,
                path:`${req.baseUrl}${req.path}`,
                message: `hsv property must have 3 components`
            })
        }
        const hRegex =/^([0-9]|[1-9][0-9]|[12][0-9]{2}|3[0-5][0-9]|360)$/;
        if(!hRegex.test(hsvList[0])) {
            return res.send({
                status: 2,
                path:`${req.baseUrl}${req.path}`,
                message: `h component must be between 0 and 360`
            });
        }
        const svRegex =/^([0-9]|[1-9][0-9]|100)$/;
        for(let i = 1; i < hsvList.length; i++) {
            if(!svRegex.test(hsvList[i])) {
                return res.send({
                    status: 2,
                    path:`${req.baseUrl}${req.path}`,
                    message: `s and v components must be between 0 and 100`
                }); 
            }
        }
        const hsvObj = {'h' : Number.parseInt(hsvList[0]), 's': Number.parseInt(hsvList[1]), 'v': Number.parseInt(hsvList[2])};
        const rgbObj = colorConverter.hsvToRgb(hsvObj.h / 360,hsvObj.s / 100,hsvObj.v / 100);
        console.log(rgbObj)
        const result = colorConverter.convertRGBtoHex(rgbObj);
        if(result) {
            return res.send({
                status: 1,
                path:`${req.baseUrl}${req.path}`,
                hsv: hsvObj,
                hex: result 
            });
        }
        return res.send({
            status:0,
            path:`${req.baseUrl}${req.path}`,
            message: "Error converting HSV to hex"
        });

    } else {
        return res.send({
            status: 2,
            path:`${req.baseUrl}${req.path}`,
            message: "query missing hsv property"
        });   
    }
});

router.get('/HSVtoRGB',(req, res, next) => {
    if(req.query.hasOwnProperty('hsv')){
        const hsvList = req.query.hsv.split(',');
        if(hsvList.length !== 3){
            return res.send({
                status: 2,
                path:`${req.baseUrl}${req.path}`,
                message: `hsv property must have 3 components`
            })
        }
        const hRegex =/^([0-9]|[1-9][0-9]|[12][0-9]{2}|3[0-5][0-9]|360)$/;
        if(!hRegex.test(hsvList[0])) {
            return res.send({
                status: 2,
                path:`${req.baseUrl}${req.path}`,
                message: `h component must be between 0 and 360`
            });
        }
        const svRegex =/^([0-9]|[1-9][0-9]|100)$/;
        for(let i = 1; i < hsvList.length; i++) {
            if(!svRegex.test(hsvList[i])) {
                return res.send({
                    status: 2,
                    path:`${req.baseUrl}${req.path}`,
                    message: `s and v components must be between 0 and 100`
                }); 
            }
        }
        const hsvObj = {'h' : Number.parseInt(hsvList[0]), 's': Number.parseInt(hsvList[1]), 'v': Number.parseInt(hsvList[2])};
        const result = colorConverter.hsvToRgb(hsvObj.h / 360,hsvObj.s / 100,hsvObj.v / 100);
        if(typeof(result) === 'object' && result.hasOwnProperty('r')
            && result.hasOwnProperty('g') && result.hasOwnProperty('b')
        ) {
            return res.send({
                status: 1,
                path:`${req.baseUrl}${req.path}`,
                hsv: hsvObj,
                rgb: result
            });
        }
        return res.send({
            status:0,
            path:`${req.baseUrl}${req.path}`,
            message: "Error converting HSV to RBG"
        });

    } else {
        return res.send({
            status: 2,
            path:`${req.baseUrl}${req.path}`,
            message: "query missing hsv property"
        });   
    }
});

router.get('/HSVtoHSL',(req, res, next) => {
    if(req.query.hasOwnProperty('hsv')){
        const hsvList = req.query.hsv.split(',');
        if(hsvList.length !== 3){
            return res.send({
                status: 2,
                path:`${req.baseUrl}${req.path}`,
                message: `hsv property must have 3 components`
            })
        }
        const hRegex =/^([0-9]|[1-9][0-9]|[12][0-9]{2}|3[0-5][0-9]|360)$/;
        if(!hRegex.test(hsvList[0])) {
            return res.send({
                status: 2,
                path:`${req.baseUrl}${req.path}`,
                message: `h component must be between 0 and 360`
            });
        }
        const svRegex =/^([0-9]|[1-9][0-9]|100)$/;
        for(let i = 1; i < hsvList.length; i++) {
            if(!svRegex.test(hsvList[i])) {
                return res.send({
                    status: 2,
                    path:`${req.baseUrl}${req.path}`,
                    message: `s and v components must be between 0 and 100`
                }); 
            }
        }
        const hsvObj = {'h' : Number.parseInt(hsvList[0]), 's': Number.parseInt(hsvList[1]), 'v': Number.parseInt(hsvList[2])};
        const rgbObj = colorConverter.hsvToRgb(hsvObj.h / 360,hsvObj.s / 100,hsvObj.v / 100);
        if(!(typeof(rgbObj) === 'object' && rgbObj.hasOwnProperty('r')
            && rgbObj.hasOwnProperty('g') && rgbObj.hasOwnProperty('b')
            )) {
                return res.send({
                    status:0,
                    path:`${req.baseUrl}${req.path}`,
                    message: "Error converting HSV to HSL"
                });
        }
        const result = colorConverter.rgbToHsl(rgbObj.r,rgbObj.g,rgbObj.b);
        if(typeof(result) === 'object' && result.hasOwnProperty('h')
            && result.hasOwnProperty('s') && result.hasOwnProperty('l')
        ){
            return res.send({
                status: 1,
                path:`${req.baseUrl}${req.path}`,
                hsv: hsvObj,
                hsl: result
            })
        }

        return res.send({
            status:0,
            path:`${req.baseUrl}${req.path}`,
            message: "Error converting HSV to RBG"
        });

    } else {
        return res.send({
            status: 2,
            path:`${req.baseUrl}${req.path}`,
            message: "query missing hsv property"
        });   
    }
});

router.get('/HSLtoHex',(req, res, next) => {
    if(req.query.hasOwnProperty('hsl')){
        const hslList = req.query.hsl.split(',');
        if(hslList.length !== 3){
            return res.send({
                status: 2,
                path:`${req.baseUrl}${req.path}`,
                message: `hsl property must have 3 components`
            })
        }
        const hRegex =/^([0-9]|[1-9][0-9]|[12][0-9]{2}|3[0-5][0-9]|360)$/;
        if(!hRegex.test(hslList[0])) {
            return res.send({
                status: 2,
                path:`${req.baseUrl}${req.path}`,
                message: `h component must be between 0 and 360`
            });
        }
        const slRegex =/^([0-9]|[1-9][0-9]|100)$/;
        for(let i = 1; i < hslList.length; i++) {
            if(!slRegex.test(hslList[i])) {
                return res.send({
                    status: 2,
                    path:`${req.baseUrl}${req.path}`,
                    message: `s and l components must be between 0 and 100`
                }); 
            }
        }
        const hslObj = {'h' : hslList[0], 's': hslList[1], 'l': hslList[2]};
        const rgbObj = colorConverter.hslToRgb(Math.round(Number.parseInt(hslObj.h) / 360), Math.round(Number.parseInt(hslObj.s) / 100), Math.round(Number.parseInt(hslObj.l) / 100));
        if(!(typeof(rgbObj) === 'object' && rgbObj.hasOwnProperty('r')
        && rgbObj.hasOwnProperty('g') && rgbObj.hasOwnProperty('b'))){
            return res.send({
                status:0,
                path:`${req.baseUrl}${req.path}`,
                message: "Error converting HSL to hex"
            });
        }
        const result = colorConverter.convertRGBtoHex(rgbObj);
        if(result) {
            return res.send({
                status: 1,
                path:`${req.baseUrl}${req.path}`,
                hsl: hslObj,
                hex: result 
            });
        }
        return res.send({
            status:0,
            path:`${req.baseUrl}${req.path}`,
            message: "Error converting HSL to hex"
        });

    } else {
        return res.send({
            status: 2,
            path:`${req.baseUrl}${req.path}`,
            message: "query missing hsl property"
        });   
    }
});

router.get('/HSLtoRGB',(req, res, next) => {
    if(req.query.hasOwnProperty('hsl')){
        const hslList = req.query.hsl.split(',');
        if(hslList.length !== 3){
            return res.send({
                status: 2,
                path:`${req.baseUrl}${req.path}`,
                message: `hsl property must have 3 components`
            })
        }
        const hRegex =/^([0-9]|[1-9][0-9]|[12][0-9]{2}|3[0-5][0-9]|360)$/;
        if(!hRegex.test(hslList[0])) {
            return res.send({
                status: 2,
                path:`${req.baseUrl}${req.path}`,
                message: `h component must be between 0 and 360`
            });
        }
        const slRegex =/^([0-9]|[1-9][0-9]|100)$/;
        for(let i = 1; i < hslList.length; i++) {
            if(!slRegex.test(hslList[i])) {
                return res.send({
                    status: 2,
                    path:`${req.baseUrl}${req.path}`,
                    message: `s and l components must be between 0 and 100`
                }); 
            }
        }
        const hslObj = {'h' : hslList[0], 's': hslList[1], 'l': hslList[2]};
        const result = colorConverter.hslToRgb(Number.parseInt(hslObj.h) / 360, Number.parseInt(hslObj.s) / 100, Number.parseInt(hslObj.l) / 100);
        if(typeof(result) === 'object' && result.hasOwnProperty('r')
        && result.hasOwnProperty('g') && result.hasOwnProperty('b')){
            return res.send({
                status: 1,
                path:`${req.baseUrl}${req.path}`,
                hsl: hslObj,
                rgb: result 
            });
        }
        return res.send({
            status:0,
            path:`${req.baseUrl}${req.path}`,
            message: "Error converting HSV to RGB"
        });

    } else {
        return res.send({
            status: 2,
            path:`${req.baseUrl}${req.path}`,
            message: "query missing hsl property"
        });   
    }
});

router.get('/HSLtoHSV',(req, res, next) => {
    if(req.query.hasOwnProperty('hsl')){
        const hslList = req.query.hsl.split(',');
        if(hslList.length !== 3){
            return res.send({
                status: 2,
                path:`${req.baseUrl}${req.path}`,
                message: `hsl property must have 3 components`
            })
        }
        const hRegex =/^([0-9]|[1-9][0-9]|[12][0-9]{2}|3[0-5][0-9]|360)$/;
        if(!hRegex.test(hslList[0])) {
            return res.send({
                status: 2,
                path:`${req.baseUrl}${req.path}`,
                message: `h component must be between 0 and 360`
            });
        }
        const slRegex =/^([0-9]|[1-9][0-9]|100)$/;
        for(let i = 1; i < hslList.length; i++) {
            if(!slRegex.test(hslList[i])) {
                return res.send({
                    status: 2,
                    path:`${req.baseUrl}${req.path}`,
                    message: `s and l components must be between 0 and 100`
                }); 
            }
        }
        const hslObj = {'h' : hslList[0], 's': hslList[1], 'l': hslList[2]};
        const rgbObj = colorConverter.hslToRgb(Number.parseInt(hslObj.h) / 360, Number.parseInt(hslObj.s) / 100, Number.parseInt(hslObj.l) / 100);
        if(!(typeof(rgbObj) === 'object' && rgbObj.hasOwnProperty('r')
        && rgbObj.hasOwnProperty('g') && rgbObj.hasOwnProperty('b'))){
            return res.send({
                status:0,
                path:`${req.baseUrl}${req.path}`,
                message: "Error converting HSL to HSV"
            });
        }
        const result = colorConverter.rgbToHsv(rgbObj.r,rgbObj.g,rgbObj.b);
        if(typeof(result) === 'object' && result.hasOwnProperty('h')
            && result.hasOwnProperty('s') && result.hasOwnProperty('v')
        ){
            return res.send({
                status: 1,
                path:`${req.baseUrl}${req.path}`,
                hsl: hslObj,
                hsv: result
            })
        }
        return res.send({
            status:0,
            path:`${req.baseUrl}${req.path}`,
            message: "Error converting HSL to HSV"
        });

    } else {
        return res.send({
            status: 2,
            path:`${req.baseUrl}${req.path}`,
            message: "query missing hsl property"
        });   
    }
});


module.exports = router;