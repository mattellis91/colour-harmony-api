let cc = {
    convertHextoRGB : (hex) => {
        let rbgMap = {0 : 'r', 2 : 'g', 4: 'b'}
        let rgb = {};
        for( var i = 0; i < hex.length; i+=2) {
            colorSegment = hex[i] + hex[i + 1];
            rgb[rbgMap[i]] = parseInt(colorSegment,16);
        }
        return rgb;
    },

    hsvToRgb : (h, s, v) =>{
        var r, g, b;
      
        var i = Math.floor(h * 6);
        var f = h * 6 - i;
        var p = v * (1 - s);
        var q = v * (1 - f * s);
        var t = v * (1 - (1 - f) * s);
      
        switch (i % 6) {
          case 0: r = v, g = t, b = p; break;
          case 1: r = q, g = v, b = p; break;
          case 2: r = p, g = v, b = t; break;
          case 3: r = p, g = q, b = v; break;
          case 4: r = t, g = p, b = v; break;
          case 5: r = v, g = p, b = q; break;
        }
      
        return { 'r': Math.round(r * 255), 'g' : Math.round(g * 255), 'b': Math.round(b * 255) };
      },

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

    convertRGBtoHex : (rgb) => {
        let hex = "";
        hex += rgb.r.toString(16);
        hex += rgb.g.toString(16);
        hex += rgb.b.toString(16);
        return hex;
    },

    rgbTos: (r, g, b) => {
        r /= 255, g /= 255, b /= 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;
        if(max == min){
          h = s = 0; // achromatic
        }else{
          var d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
          }
          h /= 6;
        }
        return({ h:Math.round(h *360), s:Math.round(s*100), l:Math.round(l*100) });
      },

      hslToRgb: (h, s, l) => {
        var r, g, b;
        if(s == 0){
            r = g = b = l; // achromatic
        }else{
            function hue2rgb(p, q, t){
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return p + (q - p) * 6 * t;
                if(t < 1/2) return q;
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        return{
            r:Math.round(r * 255),
            g:Math.round(g * 255),
            b:Math.round(b * 255),
        };
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

    rgbToHsv: (r, g, b) => {
        r /= 255, g /= 255, b /= 255;
      
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, v = max;
      
        var d = max - min;
        s = max == 0 ? 0 : d / max;
      
        if (max == min) {
          h = 0; // achromatic
        } else {
          switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
          }
      
          h /= 6;
        }
      
        return { 'h': Math.round(h * 360), 's': Math.round(s * 100), 'v':Math.round(v * 100) };
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

    // Returns a single rgb color interpolation between given rgb color
    // based on the factor given; via https://codepen.io/njmcode/pen/axoyD?editors=0010
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

    calculateSplitComplementary : (base) => {
        if(typeof(base) === "string") {
            base = cc.convertHextoRGB(base);
        }
        let hsv = cc.convertRGBtoHSV(base);
        let sp1_hsv = Object.assign({}, hsv)
        sp1_hsv.h = (sp1_hsv.h + 150) % 360;
        
        let sp1_rgb = cc.convertHSVtoRBG(sp1_hsv);
        let sp1_hex = cc.convertRGBtoHex(sp1_rgb);

        let sp2_hsv = hsv.slice();
        sp2_hsv.h = (sp2_hsv.h + 210) % 360;

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
        let triadic1_hsv = Object.assign({}, hsv);
        triadic1_hsv.h = (triadic1_hsv.h + 120) % 360;

        let triadic1_rgb = cc.convertHSVtoRBG(triadic1_hsv);
        let triadic1_hex = cc.convertRGBtoHex(triadic1_rgb);

        let triadic2_hsv = hsv.slice();
        triadic2_hsv.h = (triadic2_hsv.h + 240) % 360;

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
        let tetradic1_hsv = Object.assign({}, hsv)
        tetradic1_hsv.h = (tetradic1_hsv.h + 90) % 360;

        let tetradic1_rgb = cc.convertHSVtoRBG(tetradic1_hsv);
        let tetradic1_hex = cc.convertRGBtoHex(tetradic1_rgb);

        let tetradic2_hsv = Object.assign({}, hsv)
        tetradic2_hsv.h = (tetradic2_hsv.h + 180) % 360;

        let tetradic2_rgb = cc.convertHSVtoRBG(tetradic2_hsv);
        let tetradic2_hex = cc.convertRGBtoHex(tetradic2_rgb);

        let tetradic3_hsv = Object.assign({}, hsv)
        tetradic3_hsv.h = (tetradic3_hsv.h + 270) % 360;

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
        let analagous1_hsv = Object.assign({}, hsv);
        analagous1_hsv.h = (analagous1_hsv.h + 30) % 360;

        let analagous1_rgb = cc.convertHSVtoRBG(analagous1_hsv);
        let analagous1_hex = cc.convertRGBtoHex(analagous1_rgb);

        let analagous2_hsv = Object.assign({}, hsv)
        analagous2_hsv.h = cc.mod((analagous2_hsv.h - 30),360);

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