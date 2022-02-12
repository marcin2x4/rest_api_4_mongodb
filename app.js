const express = require('express');
const app = express();

const morgan = require('morgan'); //monitoring of POST/GET and displaying in terminal
const bodyParser = require('body-parser'); //formatuje json
const mongoose = require('mongoose'); //mongoDB sterownik

//routes by type of data
const productRoutes = require('./api/routes/products');
const productOrders = require('./api/routes/orders');


//connect to mongoDB
mongoose.connect('',
{
//deprecated, don't use!
//useMongoClient: true

useNewUrlParser: true,
useUnifiedTopology: true
}
)
.then(() => console.log("MongoDb connected"))
.catch(err => console.log(err));

//depricationWarning warning removed from terminal
//mongoose.Promise = global.Promise;

//middleware terminal listening
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false})); //url parsing
app.use(bodyParser.json());

//middleware to handle Cross
//Cross-Origin Resource Sharing (CROS): exchanging data between servers having different IP
app.use((req,res,next) => {
  res.header('Access-Control-Allow-Origin', '*'); //header
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); //headers allowed with requests

  if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, PUSH, PATCH, DELETE, GET'); //allowed requests
      return res.status(200).json({});
  }
  next();
});

//setup middleware
app.use('/products', productRoutes);
app.use('/orders', productOrders);

//managing unhandled requests
app.use((req,res, next) => {
  const error = new Error('not found!');
  error.status = 400;
  next(error);
})

//catching other errors
app.use((error, req,res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
      }
  });
});

module.exports = app;
