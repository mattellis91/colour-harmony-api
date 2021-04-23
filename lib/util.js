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

    getPercentage: (params) => {
        return params['percentage'] || 0;
    },

    getDegreesAmount: (params) => {
        return params['degrees'] || 0;
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