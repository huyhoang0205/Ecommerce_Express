require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const morgan = require('morgan')
const helmet = require('helmet')
const compression = require('compression')
const app = express();

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Ecommerce Express API with Swagger",
      version: "0.1.0",
      description:
        "This is a API application made with Express and documented with Swagger",
    },
  },
  apis: ["./src/routers/**/*.js"],
};
const specs = swaggerJsDoc(options);
//morgan - support print log per request
//helmet - secure express app  - set header info
//compression - help reduce data transaction 



//inti middleware
app.use(cors());
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded(
    {extended: true}
))
const {checkOverload} = require('./helpers/check.connect');
checkOverload();
//handle error
//init router
app.use('', require('./routers'))

//swagger
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);
console.log("--- SWAGGER PATHS ---");
console.log(Object.keys(specs.paths)); 
console.log("---------------------");

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