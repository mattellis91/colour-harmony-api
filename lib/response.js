const response = {

    NO_COLOR_PROVIDED: "Either hex, hsl, hsv or rgb parameter must be specified",
    SERVER_ERROR: "Server error occured",
    
    buildErrorResponse: (req,status,message) => {
        return {
            status: status,
            path:req.baseUrl + req.path,
            message: message
        }
    },

    buildSuccessResponse : (req, data) => {
        return {
            status: 1,
            path: req.baseUrl + req.path,
            data: data
        }
    }
}

module.exports = response;