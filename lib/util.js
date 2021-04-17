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
    }
}
module.exports = util;