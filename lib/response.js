const response = {

    NO_COLOR_PROVIDED: "Either hex, hsl, hsv or rgb parameter must be provided",
    NO_START_END_COLOR_PROVIDED: "Both a start and end color must be provided",
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