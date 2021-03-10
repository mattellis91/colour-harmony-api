const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const hexRoutes = require('./api/routes/hex');
const rgbRoutes = require('./api/routes/rgb');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//add headers to handle CORS errors
app.use((req, res, next) => {

    //allow access to all origins
    res.header('Access-Control-Allow-Origin', '*'); 
    
    //specify which headers to allow
    res.header('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization');

    //specify which methods are supported if asked
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET');
        return res.status(200).json({});
    }

    next();
});

app.use('/hex', hexRoutes);
app.use('/rgb', rgbRoutes);

//error - couldn't find route
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

//handle thrown errors
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error : {
            message : error.message
        }
    });
});


module.exports = app;