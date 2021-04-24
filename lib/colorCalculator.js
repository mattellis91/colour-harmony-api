const colorConverter = require('./colorConverter');
const response = require('./response');
let colorCalculator = {
    
    pSBC :(p,c0,c1,l) => {
        let r,g,b,P,f,t,h,i=parseInt,m=Math.round,a=typeof(c1)=="string";
        if(typeof(p)!="number"||p<-1||p>1||typeof(c0)!="string"||(c0[0]!='r'&&c0[0]!='#')||(c1&&!a))return null;
        if(!this.pSBCr)this.pSBCr=(d)=>{
            let n=d.length,x={};
            if(n>9){
                [r,g,b,a]=d=d.split(","),n=d.length;
                if(n<3||n>4)return null;
                x.r=i(r[3]=="a"?r.slice(5):r.slice(4)),x.g=i(g),x.b=i(b),x.a=a?parseFloat(a):-1
            }else{
                if(n==8||n==6||n<4)return null;
                if(n<6)d="#"+d[1]+d[1]+d[2]+d[2]+d[3]+d[3]+(n>4?d[4]+d[4]:"");
                d=i(d.slice(1),16);
                if(n==9||n==5)x.r=d>>24&255,x.g=d>>16&255,x.b=d>>8&255,x.a=m((d&255)/0.255)/1000;
                else x.r=d>>16,x.g=d>>8&255,x.b=d&255,x.a=-1
            }return x};
        h=c0.length>9,h=a?c1.length>9?true:c1=="c"?!h:false:h,f=this.pSBCr(c0),P=p<0,t=c1&&c1!="c"?this.pSBCr(c1):P?{r:0,g:0,b:0,a:-1}:{r:255,g:255,b:255,a:-1},p=P?p*-1:p,P=1-p;
        if(!f||!t)return null;
        if(l)r=m(P*f.r+p*t.r),g=m(P*f.g+p*t.g),b=m(P*f.b+p*t.b);
        else r=m((P*f.r**2+p*t.r**2)**0.5),g=m((P*f.g**2+p*t.g**2)**0.5),b=m((P*f.b**2+p*t.b**2)**0.5);
        a=f.a,t=t.a,f=a>=0||t>=0,a=f?a<0?t:t<0?a:a*P+t*p:0;
        if(h)return"rgb"+(f?"a(":"(")+r+","+g+","+b+(f?","+m(a*1000)/1000:"")+")";
        else return"#"+(4294967296+r*16777216+g*65536+b*256+(f?m(a*255):0)).toString(16).slice(1,f?undefined:-2)
    },

    shiftHue(rgb, degrees, source) {

        const r = rgb.r
        const g = rgb.g
        const b = rgb.b

        var hsl = colorConverter.rgbToHsl(r,g,b);
        hsl.h += degrees;
        if (hsl.h > 360) {
            hsl.h -= 360;
        }
        else if (hsl.h < 0) {
            hsl.h += 360;
        }
        const resultRGB = colorConverter.hslToRgb(hsl.h / 360, hsl.s / 100, hsl.l / 100);
        const resultHex = colorConverter.convertRGBtoHex(resultRGB);
        const resultHSV = colorConverter.rgbToHsv(resultRGB.r,resultRGB.g,resultRGB.b);
        const resultHSL = colorConverter.rgbToHsl(resultRGB.r,resultRGB.g,resultRGB.b);
        return {
            "function": "shift hue",
            "description": "returns the color with the hue shifted the specified amount of degrees",
            "source": source,
            "shiftedRGB": resultRGB,
            "shiftedHex": resultHex,
            "shiftedHSV": resultHSV,
            "shiftedHSL": resultHSL
        }
    },

    mod : (x, n) => { return ((x % n) + n) % n } ,

    calculateComplementary : (base,source) => {
        if(typeof(base) === "string") {
            base = colorConverter.convertHextoRGB(base);
        }
        complementaryHSV = colorConverter.rgbToHsv(base.r,base.g,base.b);
        complementaryHSV.h = (complementaryHSV.h + 180) % 360;

        let complementaryRGB = colorConverter.hsvToRgb(complementaryHSV.h / 360,complementaryHSV.s / 100,complementaryHSV.v / 100);
        let complementaryHex = colorConverter.convertRGBtoHex(complementaryRGB);
        let complementaryHSL = colorConverter.rgbToHsl(complementaryRGB.r,complementaryRGB.g,complementaryRGB.b)

        return {
            "harmony" : "complementary",
            "description" : "returns the color with the hue 180 degrees from the original color",
            "source" : source,
            "complementaryRGB" : complementaryRGB,
            "complementaryHex" : complementaryHex,
            "complementaryHSV" : complementaryHSV,
            "complementaryHSL" : complementaryHSL
        }
    },

    calculateSplitComplementary : (base, source) => {
        if(typeof(base) === "string") {
            base = colorConverter.convertHextoRGB(base);
        }
        let hsv = colorConverter.rgbToHsv(base.r,base.g,base.b);
        let sp1_hsv = Object.assign({}, hsv)
        sp1_hsv.h = (sp1_hsv.h + 150) % 360;
        
        let sp1_rgb = colorConverter.hsvToRgb(sp1_hsv.h / 360,sp1_hsv.s / 100,sp1_hsv.v / 100);
        let sp1_hex = colorConverter.convertRGBtoHex(sp1_rgb);
        let sp1_hsl = colorConverter.rgbToHsl(sp1_rgb.r, sp1_rgb.g, sp1_rgb.b)

        let sp2_hsv = Object.assign({}, hsv)
        sp2_hsv.h = (sp2_hsv.h + 210) % 360;

        let sp2_rgb = colorConverter.hsvToRgb(sp2_hsv.h / 360,sp2_hsv.s / 100,sp2_hsv.v / 100);
        let sp2_hex = colorConverter.convertRGBtoHex(sp2_rgb);
        let sp2_hsl = colorConverter.rgbToHsl(sp2_rgb.r,sp2_rgb.g,sp2_rgb.b);

        return {
            "harmony" : "spit complementary",
            "description" : "returns the colors with the hue 150 and 210 degrees from the oringinal color",
            "source" : source, 
            "harmonies" : [
                {
                    "splitComplementary1_rgb" : sp1_rgb,
                    "splitComplementary1_hex" : sp1_hex,
                    "splitComplementary1_hsv" : sp1_hsv,
                    "splitComplementary1_hsl" : sp1_hsl,
                },
                {
                    "splitComplementary2_rgb" : sp2_rgb,
                    "splitComplementary2_hex" : sp2_hex,
                    "splitComplementary2_hsv" : sp2_hsv,
                    "splitComplementary2_hsl" : sp2_hsl                
                }
            ]
        }
    },

    calculateTriadic : (base, source) => {
        if(typeof(base) === "string") {
            base = colorConverter.convertHextoRGB(base);
        }
        let hsv = colorConverter.rgbToHsv(base.r,base.g,base.b);
        let triadic1_hsv = Object.assign({}, hsv);
        triadic1_hsv.h = (triadic1_hsv.h + 120) % 360;

        let triadic1_rgb = colorConverter.hsvToRgb(triadic1_hsv.h / 360,triadic1_hsv.s / 100,triadic1_hsv.v / 100);
        let triadic1_hex = colorConverter.convertRGBtoHex(triadic1_rgb);
        let triadic1_hsl = colorConverter.rgbToHsl(triadic1_rgb.r,triadic1_rgb.g,triadic1_rgb.b);

        let triadic2_hsv = Object.assign({}, hsv);
        triadic2_hsv.h = (triadic2_hsv.h + 240) % 360;

        let triadic2_rgb = colorConverter.hsvToRgb(triadic2_hsv.h / 360,triadic2_hsv.s / 100,triadic2_hsv.v / 100);
        let triadic2_hex = colorConverter.convertRGBtoHex(triadic2_rgb);
        let triadic2_hsl = colorConverter.rgbToHsl(triadic2_rgb.r,triadic2_rgb.g,triadic2_rgb.b);

        return {
            "harmony" : "triadic",
            "description" : "returns two color harmonies with the hue 120 and 240 degrees from the original color",
            "base" : source, 
            "harmonies" : [
                {
                    "triadic1_rgb" : triadic1_rgb,
                    "triadic1_hex" : triadic1_hex,
                    "triadic1_hsv" : triadic1_hsv,
                    "triadic1_hsl" : triadic1_hsl
                },
                {
                    "triadic2_rgb" : triadic2_rgb,
                    "triadic2_hex" : triadic2_hex,
                    "triadic2_hsv" : triadic2_hsv,
                    "triadic2_hsl" : triadic2_hsl 
                }
            ]
        }
    },

    calculateTetradic : (base, source) => {
        if(typeof(base) === "string") {
            base = colorConverter.convertHextoRGB(base);
        }
        let hsv = colorConverter.rgbToHsv(base.r,base.g,base.b);
        let tetradic1_hsv = Object.assign({}, hsv)
        tetradic1_hsv.h = (tetradic1_hsv.h + 90) % 360;

        let tetradic1_rgb = colorConverter.hsvToRgb(tetradic1_hsv.h / 360,tetradic1_hsv.s / 100,tetradic1_hsv.v / 100);
        let tetradic1_hex = colorConverter.convertRGBtoHex(tetradic1_rgb);
        let tetradic1_hsl = colorConverter.rgbToHsl(tetradic1_rgb.r,tetradic1_rgb.g,tetradic1_rgb.b);

        let tetradic2_hsv = Object.assign({}, hsv)
        tetradic2_hsv.h = (tetradic2_hsv.h + 180) % 360;

        let tetradic2_rgb = colorConverter.hsvToRgb(tetradic2_hsv.h / 360,tetradic2_hsv.s / 100,tetradic2_hsv.v / 100);
        let tetradic2_hex = colorConverter.convertRGBtoHex(tetradic2_rgb);
        let tetradic2_hsl = colorConverter.rgbToHsl(tetradic2_rgb.r,tetradic2_rgb.g,tetradic2_rgb.b);

        let tetradic3_hsv = Object.assign({}, hsv)
        tetradic3_hsv.h = (tetradic3_hsv.h + 270) % 360;

        let tetradic3_rgb = colorConverter.hsvToRgb(tetradic3_hsv.h / 360,tetradic3_hsv.s / 100,tetradic3_hsv.v / 100);;
        let tetradic3_hex = colorConverter.convertRGBtoHex(tetradic3_rgb);
        let tetradic3_hsl = colorConverter.rgbToHsl(tetradic3_rgb.r,tetradic3_rgb.g,tetradic3_rgb.b);

        return {
            "harmony" : "tetradic",
            "description" : "returns the color harmonies with the hues 90, 180 and 270 degrees from the oringinal color",
            "source" : source, 
            "harmonies" : [
                {
                    "tetradic1_rgb" : tetradic1_rgb,
                    "tetradic1_hex" : tetradic1_hex,
                    "tetradic1_hsv" : tetradic1_hsv,
                    "tetradic1_hsl" : tetradic1_hsl,
                },
                {
                    "tetradic2_rgb" : tetradic2_rgb,
                    "tetradic2_hex" : tetradic2_hex,
                    "tetradic2_hsv" : tetradic2_hsv,
                    "tetradic2_hsl" : tetradic2_hsl,
                },
                {
                    "tetradic3_rgb" : tetradic3_rgb,
                    "tetradic3_hex" : tetradic3_hex,
                    "tetradic3_hsv" : tetradic3_hsv,
                    "tetradic3_hsl" : tetradic3_hsl,
                }
            ]
        }
    },

    calculateAnalagous : (base, source) => {
        if(typeof(base) === "string") {
            base = colorConverter.convertHextoRGB(base);
        }
        let hsv = colorConverter.rgbToHsv(base.r,base.g,base.b);;
        let analagous1_hsv = Object.assign({}, hsv);
        analagous1_hsv.h = (analagous1_hsv.h + 30) % 360;

        let analagous1_rgb = colorConverter.hsvToRgb(analagous1_hsv.h / 360,analagous1_hsv.s / 100,analagous1_hsv.v / 100);
        let analagous1_hex = colorConverter.convertRGBtoHex(analagous1_rgb);
        let analagous1_hsl = colorConverter.rgbToHsl(analagous1_rgb.r,analagous1_rgb.g,analagous1_rgb.b);

        let analagous2_hsv = Object.assign({}, hsv)
        analagous2_hsv.h = colorCalculator.mod((analagous2_hsv.h - 30),360);

        let analagous2_rgb = colorConverter.hsvToRgb(analagous2_hsv.h / 360,analagous2_hsv.s / 100,analagous2_hsv.v / 100);
        let analagous2_hex = colorConverter.convertRGBtoHex(analagous2_rgb);
        let analagous2_hsl = colorConverter.rgbToHsl(analagous2_rgb.r,analagous2_rgb.g,analagous2_rgb.b);

        return {
            "harmony" : "analagous",
            "description" : "adjacent colors, 30 degrees from the hue of base color",
            "source" : source, 
            "colors" : [
                {
                    "analagous1_rgb" : analagous1_rgb,
                    "analagous1_hex" : analagous1_hex,
                    "analagous1_hsv" : analagous1_hsv,
                    "analagous1_hsl" : analagous1_hsl 
                },
                {
                    "analagous2_rgb" : analagous2_rgb,
                    "analagous2_hex" : analagous2_hex,
                    "analagous2_hsv" : analagous2_hsv,
                    "analagous2_hsl" : analagous2_hsl 
                }
            ]
        }
    },

    // Returns a single rgb color interpolation between given rgb color
    // based on the factor given; via https://codepen.io/njmcode/pen/axoyD?editors=0010
    //gradient

    //input [r,g,b]
    interpolateColor : (startColor, endColor, factor) => {
        if (arguments.length < 3) { 
            factor = 0.5; 
        }
        var result = startColor.slice();
        for (var i = 0; i < 3; i++) {
            result[i] = Math.round(result[i] + factor * (endColor[i] - startColor[i]));
        }
        return result;
    },

    generateMonochrome: (hsl, source, steps, direction) => {
        let rgb, hex, hsv;
        const monochromeColors = [];
        rgb = colorConverter.hslToRgb(hsl.h / 360, hsl.s / 100, hsl.l / 100);
        hex = colorConverter.convertRGBtoHex(rgb);
        console.log(hex);
        hsv = colorConverter.rgbToHsv(rgb.r,rgb.g,rgb.b);
        monochromeColors.push({
            hex:hex,
            hsl:Object.assign({},hsl),
            hsv:hsv,
            rgb:rgb
        });
        if(direction !== "both") {
            const sign = direction === "dark" ? -1 : 1;
            const diff = direction === "dark" ? hsl.l : 100 - hsl.l;
            const stepDiff = Math.round(diff / steps);
            for(let i = 0; i < steps; i++) {
                const newL = hsl.l + (stepDiff * sign)  
                if(direction === "light") {
                    hsl.l = newL > 100 ? 100 : newL;
                } else {
                    hsl.l = newL < 0 ? 0 : newL; 
                }
                rgb = colorConverter.hslToRgb(hsl.h / 360, hsl.s / 100, hsl.l / 100);
                hex = colorConverter.convertRGBtoHex(rgb);
                hsv = colorConverter.rgbToHsv(rgb.r,rgb.g,rgb.b);
                monochromeColors.push({
                    hex:hex,
                    hsl:Object.assign({},hsl),
                    hsv:hsv,
                    rgb:rgb
                });
            }
        } else {
            let darkSteps, lightSteps, startHsl;
            if(steps % 2 === 0) {
                darkSteps = steps / 2;
                lightSteps = steps / 2;
            } else { 
                darkSteps = Math.floor(steps / 2);
                lightSteps = steps - darkSteps;
            }
            startHsl = Object.assign({},hsl);
            const darkStepDiff = Math.round(startHsl.l / darkSteps);
            for(let i = 0; i < darkSteps; i++) {
                const newL = startHsl.l - darkStepDiff;
                startHsl.l = newL < 0 ? 0 : newL;
                rgb = colorConverter.hslToRgb(startHsl.h / 360, startHsl.s / 100, startHsl.l / 100);
                hex = colorConverter.convertRGBtoHex(rgb);
                hsv = colorConverter.rgbToHsv(rgb.r,rgb.g,rgb.b);
                monochromeColors.unshift({
                    hex:hex,
                    hsl:Object.assign({},startHsl),
                    hsv:hsv,
                    rgb:rgb
                });
            }
            startHsl = Object.assign({},hsl);
            const lightStepDiff = Math.round((100 - startHsl.l) / lightSteps);
            for(let i = 0; i < lightSteps; i++) {
                const newL = startHsl.l + lightStepDiff;
                startHsl.l = newL > 100 ? 0 : newL;
                rgb = colorConverter.hslToRgb(startHsl.h / 360, startHsl.s / 100, startHsl.l / 100);
                hex = colorConverter.convertRGBtoHex(rgb);
                hsv = colorConverter.rgbToHsv(rgb.r,rgb.g,rgb.b);
                monochromeColors.push({
                    hex:hex,
                    hsl:Object.assign({},startHsl),
                    hsv:hsv,
                    rgb:rgb
                });
            }
        }
        return {
            "pallet": "monochromatic",
            "description": "monochrome definition",
            "source": source,
            "steps": steps,
            "direction": direction,
            "colors": monochromeColors
        }
    },

    interpolateColors : (startColor, endColor, startSource, endSource, steps) => {
        var stepFactor = 1 / (steps - 1),
            interpolatedColorArray = [];

        for(var i = 0; i < steps; i++) {
            const color = colorCalculator.interpolateColor(startColor, endColor, stepFactor * i);
            const rgb = {r:color[0],g:color[1],b:color[2]};
            const hex = colorConverter.convertRGBtoHex(rgb);
            const hsl = colorConverter.rgbToHsl(rgb.r,rgb.g,rgb.b);
            const hsv = colorConverter.rgbToHsv(rgb.r,rgb.g,rgb.b);
            interpolatedColorArray.push({
                hex:hex,
                hsl:hsl,
                hsv:hsv,
                rgb:rgb
            });
        }

        return {
            "pallet": "gradient",
            "description": "array of colors inbetween the start and end color",
            "start_source": startSource,
            "end_source": endSource,
            "steps": steps,
            "colors": interpolatedColorArray,      
        }
    },

    blend(startColor,endColor,startSource,endSource,percentage,mode) {
        let responseRGB;
        if(mode === 'linear') {
            responseRGB = colorCalculator.pSBC(percentage,startColor,endColor, false, true);
        } else {
            responseRGB = colorCalculator.pSBC(percentage,startColor,endColor);
        }
        if(responseRGB){
            var match = responseRGB.match(/rgba?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)?(?:, ?(\d(?:\.\d?))\))?/);
            const rgbComponents = match ? {
                r: Number.parseInt(match[1]),
                g: Number.parseInt(match[2]),
                b: Number.parseInt(match[3])
            } : null;
            if(rgbComponents) {
                return {
                    "function": "blend",
                    "mode": mode === "linear" ? mode : "log",
                    "description": "the color value that is a blend between the start and end colors",
                    "start_source": startSource,
                    "end_source": endSource,
                    "result": {
                        rgb: rgbComponents,
                        hex: colorConverter.convertRGBtoHex(rgbComponents),
                        hsv: colorConverter.rgbToHsv(rgbComponents.r,rgbComponents.g,rgbComponents.b),
                        hsl: colorConverter.rgbToHsl(rgbComponents.r,rgbComponents.g,rgbComponents.b)
                    }
                }
            }else {
                throw "error blending colors"
            }
        } else {
            throw "error blending colors"
        }
    },

    darkenOrLighten : (rgb, percentage, source, sign, mode) => {
        rgb = "rgb("+rgb.r+","+rgb.g+","+rgb.b+")";
        let responseRGB;
        const functionInfo = sign < 0 ? {
            method : "darken",
            description: "the color value that is the given amount of percentage darker than the source color"
        }: {
            method : "lighten",
            description: "the color value that is the given amount of percentage lighter than the source color"
        }
        if(mode === "linear") {
            responseRGB = colorCalculator.pSBC(percentage * sign,rgb, false, true);
            functionInfo.mode = "linear";
        } else {
           responseRGB = colorCalculator.pSBC(percentage * sign,rgb);
           functionInfo.mode = "log";
        }
        if(responseRGB){
            var match = responseRGB.match(/rgba?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)?(?:, ?(\d(?:\.\d?))\))?/);
            const rgbComponents = match ? {
                r: Number.parseInt(match[1]),
                g: Number.parseInt(match[2]),
                b: Number.parseInt(match[3])
            } : null;
            if(rgbComponents) {
                return {
                    "function": functionInfo.method,
                    "mode": functionInfo.mode,
                    "description": functionInfo.description,
                    "source": source,
                    "result": {
                        rgb: rgbComponents,
                        hex: colorConverter.convertRGBtoHex(rgbComponents),
                        hsv: colorConverter.rgbToHsv(rgbComponents.r,rgbComponents.g,rgbComponents.b),
                        hsl: colorConverter.rgbToHsl(rgbComponents.r,rgbComponents.g,rgbComponents.b)
                    }
                }
            }else {
                throw "error getting darken / lighten value"
            }
        } else {
            throw "error getting darken / lighten value"
        }
    },

    lighten : (color, percentage) => {
        return colorCalculator.pSBC(percentage, color)
    },

    invertColor : (hex, source) => {
        if (hex.indexOf('#') === 0) {
            hex = hex.slice(1);
        }
        // convert 3-digit hex to 6-digits.
        if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        if (hex.length !== 6) {
            throw new Error('Invalid HEX color.');
        }
        // invert color components
        var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
            g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
            b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
        // pad each with zeros and return
        padZero = (str, len) => {
            len = len || 2;
            var zeros = new Array(len).join('0');
            return (zeros + str).slice(-len);
        }
        
        const resultHex = padZero(r) + padZero(g) + padZero(b);
        const resultRGB = colorConverter.convertHextoRGB(resultHex);
        const resultHSV = colorConverter.rgbToHsv(resultRGB.r,resultRGB.g,resultRGB.b);
        const resultHSL = colorConverter.rgbToHsl(resultRGB.r,resultRGB.g,resultRGB.b);

        return {
            "function": "invert",
            "description": "returns the inversion of the source color",
            "source": source,
            "invertedRGB": resultRGB,
            "invertedHex": resultHex,
            "invertedHSV": resultHSV,
            "invertedHSL": resultHSL
        }
    },
    

    getRandomHex: () => {
        var chars = '0123456789ABCDEF';
        var color = '';
        for (var i = 0; i < 6; i++) {
          color += chars[Math.floor(Math.random() * 16)];
        }
        return color;
      },

    getRandomRGB: () => {
        return {
            'r' : colorCalculator.getRandomIntInclusive(0,255),
            'g' : colorCalculator.getRandomIntInclusive(0,255),
            'b' : colorCalculator.getRandomIntInclusive(0,255)
        }
    },

    getRandomHSV: () => {
        return {
            'h' : colorCalculator.getRandomIntInclusive(0,360),
            's' : colorCalculator.getRandomIntInclusive(0,100),
            'v' : colorCalculator.getRandomIntInclusive(0,100)
        }
    },

    getRandomHSV: () => {
        return {
            'h' : colorCalculator.getRandomIntInclusive(0,360),
            's' : colorCalculator.getRandomIntInclusive(0,100),
            'l' : colorCalculator.getRandomIntInclusive(0,100)
        }
    },

    getRandomIntInclusive: (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
    }
    
}

module.exports = colorCalculator;