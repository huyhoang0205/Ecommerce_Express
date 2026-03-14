require('dotenv').config();
const express = require('express');
const morgan = require('morgan')
const helmet = require('helmet')
const compression = require('compression')
const app = express();

//morgan - support print log per request
//helmet - secure express app  - set header info
//compression - help reduce data transaction 



//inti middleware
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded(
    {extended: true}
))
//init db
require('./dbs/init.mongodb');
const {checkOverload} = require('./helpers/check.connect');
checkOverload();
//handle error
//init router
app.use('', require('./routers'))


//handle error
app.use( (req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use( ( error , req , res , next) => {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        stack: error.stack,
        message: error.message || "Internal Server Error",
    })
})
module.exports = app;