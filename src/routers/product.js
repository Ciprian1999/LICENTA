const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Product = require('../models/product');
const manufacturers = require('../utils/constants/manufacturers');
const types = require('../utils/constants/types');
require('mongoose');

router.post('/product/add', async (req, res) => { // add auth
    try {
        const product = new Product({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            manufacturer: req.body.manufacturer,
            category: req.body.category,
            quantity: req.body.quantity
        });

        await product.save();
        res.status(201).redirect('/produse.html');
    } catch (e) {
        res.render('error', {
            error_code: 500,
            error_message: e.message
        });
    }
});
router.get('/products', auth, async (req, res) => {
    req.user
        ? (req.user.isAdmin
            ? res.render('products', {isLogged: true, isAdmin: true})
            : res.render('products', {isLogged: true, isAdmin: false}))
        : res.
            render('products', {isLogged: false, isAdmin: false});
});

router.get('/add', auth, async (req, res) => {
    if (!req.user?.isAdmin) {
        res.render('error', {
            error_code: 401,
            error_message: 'Unauthorized'
        });
    } else {
        res.render('add', {
            isLogged: true,
            isAdmin: true
        });
    }
});

router.get('/cart', auth, async (req, res) => {
    req.user
        ? (req.user.isAdmin
            ? res.render('cart', {isLogged: true, isAdmin: true})
            : res.render('cart', {isLogged: true, isAdmin: false}))
        : res.
            render('cart', {isLogged: false, isAdmin: false});
});
router.get('/products/data', async (req, res) => {
    const Search = req.query.search ? req.query.search.replace('+', ' ') : '';
    try {
        const problems = await Product.find(
            {
                name: {$regex: Search, $options: 'i'}, // Search by title
                category: req.query.category ? req.query.category : {$in: types},
                manufacturer: req.query.manufacturer ? req.query.manufacturer : {$in: manufacturers}
            },
            'name price category',
            {
                skip:
                    req.query.skip && req.query.skip >= 0 ? parseInt(req.query.skip) : 0,
                limit: 9,
            }
        ).lean();

        if (problems.length !== 0) {
            res.send(problems);
        } else {
            res.status(404).send();
        }
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get('/produse/:product', auth, async (req, res) => {
    try {
        const product = await Product.findOne({name: req.params.product});
        if (!product) {
            res.render('error', {
                error_code: 404,
                error_message: 'Produsul nu a fost gasit!'
            });
        } else {
            res.render('product', {
                name: product?.name,
                description: product?.description,
                price: product?.price,
                quantity: product?.quantity,
                manufacturer: product?.manufacturer,
                category: product?.category,
                isLogged: req.user ? true : false,
                isAdmin: req.user?.isAdmin ? true : false
            });
        }
    } catch (e) {
        res.render('error', {
            error_code: 500,
            error_message: e.message
        });
    }
});

module.exports = router;