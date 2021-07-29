const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRouter = require('./api/routes/products');
const orderRouter = require('./api/routes/orders');
const userRouter = require('./api/routes/users');

mongoose.connect('mongodb+srv://node-shop:' + process.env.MONGO_ATLAS_PW + '@node-rest-shop.bhlqa.mongodb.net/27017?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }
);
mongoose.Promise = global.Promise;
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/products', productRouter);
app.use('/orders', orderRouter);
app.use('/users', userRouter);
app.use((req, res, next) => {
    res.header('Allow-Control-Allow-Origin', '*');
    res.header(
        'Allow-Control-Allow-Headers',
        'Origin,X-Requested-Width,Content-Type,Accept,Authorization'
    );
    if (req.method === 'OPTIONS') {
        res.header('Allow-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE');
        return res.status(200).json({});
    }
    next();
})
app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            meesage: error.message,
        }
    })
});
module.exports = app;