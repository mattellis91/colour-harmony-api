
let colorConverter = {
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
      
        return { 'h': Number.parseFloat((h * 360).toFixed(2)), 's': Number.parseFloat((s * 100).toFixed(2)), 'v':Number.parseFloat((v * 100).toFixed(2)) };
      },

      convertRGBtoHex : (rgb) => {
        let hex = "";
        hex += rgb.r.toString(16);
        hex += rgb.g.toString(16);
        hex += rgb.b.toString(16);
        return hex;
    },

    rgbToHsl: (r, g, b) => {
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
        return({ h:Number.parseFloat((h *360).toFixed(2)), s:Number.parseFloat((s*100).toFixed(2)), l:Number.parseFloat((l*100).toFixed(2)) });
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

}

module.exports = colorConverter