colorConverter = require('./colorConverter');
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

    
    shiftHue(rgb, degree) {

        const r = rbg.r
        const g = rbg.g
        const b = rbg.b

        var hsl = rgbToHSL(r,g,b);
        hsl.h += degree;
        if (hsl.h > 360) {
            hsl.h -= 360;
        }
        else if (hsl.h < 0) {
            hsl.h += 360;
        }
        return hslToRGB(hsl);
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
                    "splitComplementary2_hsl" : sp2_hsl                }
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
        let hsv = colorConverter.convertRGBtoHSV(base);
        let analagous1_hsv = Object.assign({}, hsv);
        analagous1_hsv.h = (analagous1_hsv.h + 30) % 360;

        let analagous1_rgb = colorConverter.convertHSVtoRBG(analagous1_hsv);
        let analagous1_hex = colorConverter.convertRGBtoHex(analagous1_rgb);

        let analagous2_hsv = Object.assign({}, hsv)
        analagous2_hsv.h = colorCalculator.mod((analagous2_hsv.h - 30),360);

        let analagous2_rgb = colorConverter.convertHSVtoRBG(analagous2_hsv);
        let analagous2_hex = colorConverter.convertRGBtoHex(analagous2_rgb);

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
    },

    // Returns a single rgb color interpolation between given rgb color
    // based on the factor given; via https://codepen.io/njmcode/pen/axoyD?editors=0010
    //gradient
    interpolateColor : (color1, color2, factor) => {
        if (arguments.length < 3) { 
            factor = 0.5; 
        }
        var result = color1.slice();
        for (var i = 0; i < 3; i++) {
            result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
        }
        return result;
    },
    // My function to interpolate between two colors completely, returning an array
    interpolateColors : (color1, color2, steps) => {
        var stepFactor = 1 / (steps - 1),
            interpolatedColorArray = [];

        color1 = color1.match(/\d+/g).map(Number);
        color2 = color2.match(/\d+/g).map(Number);

        for(var i = 0; i < steps; i++) {
            interpolatedColorArray.push(interpolateColor(color1, color2, stepFactor * i));
        }

        return interpolatedColorArray;
    },

    darken : (color, percentage) => {
        return pSBC(percentage,color); 
    },

    lighten : (color, percentage) => {
        return psCB(percentage * -1, color)
    },

    invertColor : (hex) => {
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
        return '#' + padZero(r) + padZero(g) + padZero(b);
    },
    
    padZero : (str, len) => {
        len = len || 2;
        var zeros = new Array(len).join('0');
        return (zeros + str).slice(-len);
    },

    
}

module.exports = colorCalculator;