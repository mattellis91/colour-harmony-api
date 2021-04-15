const error = {

    NO_COLOR_PROVIDED: "Either hex, hsl, hsv or rgb parameter must be specified",
    SERVER_ERROR: "Server error occured",
    INVALID_HEX: "Hex code must be valid hex code with 6 characters",
    
    buildErrorResponse: (req,status,message) => {
        return {
            status: status,
            path:req.baseUrl + req.path,
            message: message
        }
    }
}

module.exports = error;