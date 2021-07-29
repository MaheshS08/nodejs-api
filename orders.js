const express = require('express');
//const { route } = require('./products');
const mongoose = require('mongoose');
const Order = require('../models/order');
//const { request } = require('express');
const Product = require('../models/product');
const router = express.Router();


router.get('/', (req, res, next) => {
    Order
        .find()
        .select('product quantity _id')
        .populate('product', 'name')
        .exec()
        .then(orders => {
            res.status(200).json({
                count: orders.length,
                orders: orders.map(order => {
                    return {
                        _id: order._id,
                        product: order.product,
                        quantity: order.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + order._id,
                        }
                    }
                })
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});
router.post('/', (req, res, next) => {

    Product.findById(req.body.productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: 'Product not found'
                });
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });
            return order.save();

        })
        .then(result => {
            res.status(201).json({
                message: 'Order Stored',
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/orders/' + result._id
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});
router.get('/:orderID', (req, res, next) => {
    Order.findById(req.params.orderID)
        .populate('product')
        .exec()
        .then(order => {
            if (!order) {
                return res.status(404).json({
                    message: 'Order Not Found'
                })
            }
            res.status(200).json({
                order: order,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders'
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});
router.delete('/:orderID', (req, res, next) => {
    Order.deleteOne({ _id: req.params.orderID })
        .exec()
        .then(order => {
            if (!order) {
                return res.status(404).json({
                    message: 'Order Not Found',
                });
            }
            res.status(200).json({
                message: 'Order Deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/orders',
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        })
});

module.exports = router;
