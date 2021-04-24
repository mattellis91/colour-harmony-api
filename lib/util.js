const util = {
    getColorValue : (params) => {
        for(const key of Object.keys(params)) {
            if(['hsl','rgb','hsv','hex'].includes(key)) {
                return {type: key, value: key === 'hex' ? params[key] : params[key].split(",").map((component)=>{
                    return Number.parseInt(component);
                })};
            }
        }
        return null;
    },

    getStartEndColorValues: (params) => {
        const vars = [];
        for(const prefix of ["start","end"]) {
            const prefixVars = [
                prefix+"_hex",
                prefix+"_rgb",
                prefix+"_hsv",
                prefix+"_hsl",
            ]
            keysLoop: for(const key of Object.keys(params)) {
                if(prefixVars.includes(key)) {
                    const colorInfo = key.split("_");
                    const position = colorInfo[0];
                    const type = colorInfo[1];
                    vars.push({position: position, type:type, value: type === "hex" ? params[key] : params[key].split(",").map((component) => {
                        return Number.parseInt(component);
                    })});
                    break keysLoop;
                } 
            }
        }
        return vars;
    },
 
    getPercentage: (params) => {
        return params['percentage'] || 0;
    },

    getDegreesAmount: (params) => {
        return params['degrees'] || 0;
    },

    getSteps: (params) => {
        return params['steps'];
    },

    getDirection: (params) => {
        let dir = params['direction'] || "both";
        dir = dir.toLowerCase();
        if(dir === "light" || dir === "dark") {
            return dir;
        } else {
            return "both"
        }
    },

    getMode: (params) => {
        let mode = params['mode'] || "";
        if(mode) {
            mode = mode.toLowerCase();
            if(mode === 'linear' || mode === 'log') {
                return mode;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
    
}
module.exports = util;