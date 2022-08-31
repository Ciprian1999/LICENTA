const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Create account
router.post('/users/create', async (req, res) => {
    const user = new User({
        name: req.body.firstName + ' ' + req.body.lastName,
        email: req.body.email,
        password: req.body.password,
    });

    try {
        await user.save();
        const token = await user.generateAuthToken('60');
        res.cookie('Authorization', token, {maxAge: 60 * 60 * 1000});
        res.redirect('/');
    } catch (e) {
        res.render('error', {
            error_code: 400,
            error_message: e.message
        });
    }
});

// Login to account
router.post('/users/login', async (req, res) => {
    let minutes = '1';
    if (req.body.rememberMe) {
        minutes = '60';
    }
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        if (!user) {
            res.status(401).send();
        } else {
            const token = await user.generateAuthToken(minutes);
            res.cookie('Authorization', token, {maxAge: +minutes * 60 * 1000}); // minute * 60 * 1000 = miliseconds
            res.redirect('/');
        }
    } catch (e) {
        res.render('error', {
            error_code: 500,
            error_message: e.message
        });
    }
});

router.post('/users/forgot', async (req, res) => {
    const user = await User.findOne({email: req.body.email});
    if (user) {
        try {
            user.password = req.body.password;
            await user.save();
            res.send({message: 'Parola schimbata cu success'});
        } catch (error) {
            res.render('error', {
                error_code: 500,
                error_message: error.message
            });
        }
    } else {
        res.render('error', {
            error_code: 400,
            error_message: 'User-ul nu exista'
        });
    }

});

router.post('/users/receipts', auth, async (req, res) => {
    if (req.user) {
        try {
            const user = await User.findOne({email: req.user.email});
            if (user) {
                user.receipts.push(req.body.receipt);
                await user?.save();
                res.send();
            } else {
                res.status(400).send();
            }
        } catch (e) {
            res.status(500).send();
        }
    } else {
        res.send();
    }
});

router.get('/users/receipts', auth, async (req, res) => {
    if (req.user) {
        try {
            const user = await User.findOne({email: req.user.email});
            if (user) {
                res.send(user.receipts);
            } else {
                res.status(400).send();
            }
        } catch (e) {
            res.status(500).send({error: e.message});
        }
    } else {
        res.status(401).send({error: 'Unauthorized'});
    }
});

router.post('/users/data', auth, async (req, res) => {
    if (req.user) {
        try {
            const user = await User.findOne({email: req.user.email});
            if (user) {
                user.address = {
                    fullName: req.body.fullName,
                    email: req.body.email,
                    address: req.body.address,
                    city: req.body.city,
                    county: req.body.county,
                    postalCode: req.body.postalCode
                };
                user.card = {
                    cardName: req.body.cardName,
                    cardNumber: req.body.cardNumber,
                    expiryMonth: req.body.expiryMonth,
                    expiryYear: req.body.expiryYear,
                    ccv: req.body.ccv
                };
                await user.save();
                res.redirect('/account');
            } else {
                res.status(400).send();
            }
        } catch (e) {
            res.status(500).send({error: e.message});
        }
    } else {
        res.status(401).send({error: 'Unauthorized'});
    }
});

router.get('/users/data', auth, async (req, res) => {
    if (req.user) {
        try {
            const user = await User.findOne({email: req.user.email});
            if (user) {
                res.send({
                    address: user.address,
                    card: user.card
                });
            } else {
                res.status(400).send();
            }
        } catch (e) {
            res.status(500).send({error: e.message});
        }
    } else {
        res.status(401).send({error: 'Unauthorized'});
    }
});


router.get('/users/logout', async (req, res) => {
    res.clearCookie('Authorization');
    res.redirect('/');
});

router.get('/account', auth, async (req, res) => {
    if (req.user) {
        res.render('profile', {
            isLogged: true,
            isAdmin: req.user.isAdmin
        });
    } else {
        res.render('account', {
            isLogged: false,
            isAdmin: false
        });
    }
});

router.get('/forgot', auth, async (req, res) => {
    if (req.user) {
        res.redirect('/');
    } else {
        res.render('forgot');
    }
});

module.exports = router;