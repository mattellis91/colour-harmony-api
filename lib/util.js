const util = {
    getColorValue : (params) => {
        for(const key of Object.keys(params)) {
            if(['hsl','rgb','hsv','hex'].includes(key)) {
                return {type: key, value: key === 'hex' ? params[key] : params[key].split("/")};
            }
        }
        return null;
    }
}
module.exports = util;