let cc = {
    convertHextoRGB : (hex) => {
        let rgb = [];
        for( var i = 0; i < hex.length; i+=2) {
            colorSegment = hex[i] + hex[i + 1];
            rgb.push(parseInt(colorSegment,16));
        }
        return rgb;
    },

    convertHSVtoRGB : (h, s, v) => {
        let r, g, b, i, f, p, q, t;
        if (arguments.length === 1) {
            s = h.s, v = h.v, h = h.h;
        }
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    },

    convertRGBtoHex : (rgb) => {
        let hex = "";
        hex += rgb[0].toString(16);
        hex += rgb[1].toString(16);
        hex += rgb[2].toString(16);
        return hex;
    },

    convertRGBtoHSV : (color) => {
        var computedH = 0;
        var computedS = 0;
        var computedV = 0;

        var r = color[0];
        var g = color[1];
        var b = color[2];

        if ( r==null || g==null || b==null ||
            isNaN(r) || isNaN(g)|| isNaN(b) ) {
            console.log('Please enter numeric RGB values!');
            return;
        }
        if (r<0 || g<0 || b<0 || r>255 || g>255 || b>255) {
            console.log('RGB values must be in the range 0 to 255.');
            return;
        }

        r=r/255; g=g/255; b=b/255;
        var minRGB = Math.min(r,Math.min(g,b));
        var maxRGB = Math.max(r,Math.max(g,b));

        // Black-gray-white
        if (minRGB==maxRGB) {
            computedV = minRGB;
            return [0,0,computedV];
        }

        // Colors other than black-gray-white:
        var d = (r==minRGB) ? g-b : ((b==minRGB) ? r-g : b-r);
        var h = (r==minRGB) ? 3 : ((b==minRGB) ? 1 : 5);
        computedH = 60*(h - d/(maxRGB - minRGB));
        computedS = (maxRGB - minRGB)/maxRGB;
        computedV = maxRGB;
        return [Math.round(computedH),Math.round(computedS*100),Math.round(computedV*100)];
    },

    convertHSVtoRBG : (hsvColor) => {
        var r, g, b;
        var i;
        var f, p, q, t;
        
        // Make sure our arguments stay in-range
        h = Math.max(0, Math.min(360, hsvColor[0]));
        s = Math.max(0, Math.min(100, hsvColor[1]));
        v = Math.max(0, Math.min(100, hsvColor[2]));
        
        // We accept saturation and value arguments from 0 to 100 because that's
        // how Photoshop represents those values. Internally, however, the
        // saturation and value are calculated from a range of 0 to 1. We make
        // That conversion here.
        s /= 100;
        v /= 100;
        
        if(s == 0) {
            // Achromatic (grey)
            r = g = b = v;
            return [
                Math.round(r * 255), 
                Math.round(g * 255), 
                Math.round(b * 255)
            ];
        }
        
        h /= 60; // sector 0 to 5
        i = Math.floor(h);
        f = h - i; // factorial part of h
        p = v * (1 - s);
        q = v * (1 - s * f);
        t = v * (1 - s * (1 - f));
        
        switch(i) {
            case 0:
                r = v;
                g = t;
                b = p;
                break;
        
            case 1:
                r = q;
                g = v;
                b = p;
                break;
        
            case 2:
                r = p;
                g = v;
                b = t;
                break;
        
            case 3:
                r = p;
                g = q;
                b = v;
                break;
        
            case 4:
                r = t;
                g = p;
                b = v;
                break;
        
            default: // case 5:
                r = v;
                g = p;
                b = q;
        }
        
        return [
            Math.round(r * 255), 
            Math.round(g * 255), 
            Math.round(b * 255)
        ];

    },

    mod : (x, n) => { return ((x % n) + n) % n } ,

    calculateComplementary : (base) => {
        if(typeof(base) === "string") {
            base = cc.convertHextoRGB(base);
        }
        complementaryHSV = cc.convertRGBtoHSV(base);
        complementaryHSV[0] = (complementaryHSV[0] + 180) % 360;

        let complementaryRGB = cc.convertHSVtoRBG(complementaryHSV);
        let complementaryHex = cc.convertRGBtoHex(complementaryRGB);

        return {
            "harmony" : "complementary",
            "description" : "returns the color with the hue 180 degrees from the original color",
            "base" : base,
            "complementaryRGB" : complementaryRGB,
            "complementaryHex" : complementaryHex,
            "complementaryHSV" : complementaryHSV
        }
    },

    calculateSplitComplementary : (base) => {
        if(typeof(base) === "string") {
            base = cc.convertHextoRGB(base);
        }
        let hsv = cc.convertRGBtoHSV(base);
        let sp1_hsv = hsv.slice();
        sp1_hsv[0] = (sp1_hsv[0] + 150) % 360;
        
        let sp1_rgb = cc.convertHSVtoRBG(sp1_hsv);
        let sp1_hex = cc.convertRGBtoHex(sp1_rgb);

        let sp2_hsv = hsv.slice();
        sp2_hsv[0] = (sp2_hsv[0] + 210) % 360;

        let sp2_rgb = cc.convertHSVtoRBG(sp2_hsv);
        let sp2_hex = cc.convertRGBtoHex(sp2_rgb);

        return {
            "harmony" : "spit complementary",
            "description" : "returns the colors with the hue 150 and 210 degrees from the oringinal color",
            "base" : base, 
            "colors" : [
                {
                    "splitComplementary1_rgb" : sp1_rgb,
                    "splitComplementary1_hex" : sp1_hex,
                    "splitComplementary1_hsv" : sp1_hsv 
                },
                {
                    "splitComplementary2_rgb" : sp2_rgb,
                    "splitComplementary2_hex" : sp2_hex,
                    "splitComplementary2_hsv" : sp2_hsv 
                }
            ]
        }
    },

    calculateTriadic : (base) => {
        if(typeof(base) === "string") {
            base = cc.convertHextoRGB(base);
        }
        let hsv = cc.convertRGBtoHSV(base);
        let triadic1_hsv = hsv.slice();
        triadic1_hsv[0] = (triadic1_hsv[0] + 120) % 360;

        let triadic1_rgb = cc.convertHSVtoRBG(triadic1_hsv);
        let triadic1_hex = cc.convertRGBtoHex(triadic1_rgb);

        let triadic2_hsv = hsv.slice();
        triadic2_hsv[0] = (triadic2_hsv[0] + 240) % 360;

        let triadic2_rgb = cc.convertHSVtoRBG(triadic2_hsv);
        let triadic2_hex = cc.convertRGBtoHex(triadic2_rgb);

        return {
            "harmony" : "triadic",
            "description" : "returns two colors with the hue 120 and 240 degrees from the oringinal color",
            "base" : base, 
            "colors" : [
                {
                    "triadic1_rgb" : triadic1_rgb,
                    "triadic1_hex" : triadic1_hex,
                    "triadic1_hsv" : triadic1_hsv 
                },
                {
                    "triadic2_rgb" : triadic2_rgb,
                    "triadic2_hex" : triadic2_hex,
                    "triadic2_hsv" : triadic2_hsv 
                }
            ]
        }
    },

    calculateTetradic : (base) => {
        if(typeof(base) === "string") {
            base = cc.convertHextoRGB(base);
        }
        let hsv = cc.convertRGBtoHSV(base);
        let tetradic1_hsv = hsv.slice();
        tetradic1_hsv[0] = (tetradic1_hsv[0] + 90) % 360;

        let tetradic1_rgb = cc.convertHSVtoRBG(tetradic1_hsv);
        let tetradic1_hex = cc.convertRGBtoHex(tetradic1_rgb);

        let tetradic2_hsv = hsv.slice();
        tetradic2_hsv[0] = (tetradic2_hsv[0] + 180) % 360;

        let tetradic2_rgb = cc.convertHSVtoRBG(tetradic2_hsv);
        let tetradic2_hex = cc.convertRGBtoHex(tetradic2_rgb);

        let tetradic3_hsv = hsv.slice();
        tetradic3_hsv[0] = (tetradic3_hsv[0] + 270) % 360;

        let tetradic3_rgb = cc.convertHSVtoRBG(tetradic3_hsv);
        let tetradic3_hex = cc.convertRGBtoHex(tetradic3_rgb);

        return {
            "harmony" : "tetradic",
            "description" : "returns the colors with the hues 90, 180 and 270 degrees from the oringinal color",
            "base" : base, 
            "colors" : [
                {
                    "tetradic1_rgb" : tetradic1_rgb,
                    "triadic1_hex" : tetradic1_hex,
                    "triadic1_hsv" : tetradic1_hsv 
                },
                {
                    "tetradic2_rgb" : tetradic2_rgb,
                    "triadic2_hex" : tetradic2_hex,
                    "triadic2_hsv" : tetradic2_hsv 
                },
                {
                    "tetradic3_rgb" : tetradic3_rgb,
                    "triadic3_hex" : tetradic3_hex,
                    "triadic3_hsv" : tetradic3_hsv 
                }
            ]
        }
    },

    calculateAnalagous : (base) => {
        if(typeof(base) === "string") {
            base = cc.convertHextoRGB(base);
        }
        let hsv = cc.convertRGBtoHSV(base);
        let analagous1_hsv = hsv.slice();
        analagous1_hsv[0] = (analagous1_hsv[0] + 30) % 360;

        let analagous1_rgb = cc.convertHSVtoRBG(analagous1_hsv);
        let analagous1_hex = cc.convertRGBtoHex(analagous1_rgb);

        let analagous2_hsv = hsv.slice();
        analagous2_hsv[0] = cc.mod((analagous2_hsv[0] - 30),360);

        let analagous2_rgb = cc.convertHSVtoRBG(analagous2_hsv);
        let analagous2_hex = cc.convertRGBtoHex(analagous2_rgb);

        return {
            "harmony" : "analagous",
            "description" : "adjacent colors, 30 degrees from the hue of base color",
            "base" : base, 
            "colors" : [
                {
                    "analagous1_rgb" : analagous1_rgb,
                    "analagous1_hex" : analagous1_hex,
                    "analagous1_hsv" : analagous1_hsv 
                },
                {
                    "analagous2_rgb" : analagous2_rgb,
                    "analagous2_hex" : analagous2_hex,
                    "analagous2_hsv" : analagous2_hsv 
                }
            ]
        }
    }
}

module.exports = cc;