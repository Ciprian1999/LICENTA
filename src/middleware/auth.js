const jwt = require('jsonwebtoken');
const User = require('../models/User');
const admins = require('../utils/constants/admins');

const auth = async (req, res, next) => {
    try {
        const token = req.cookies['Authorization'];
        let decoded = '';

        if (token !== undefined) {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        }

        const user = await User.findOne(
            {password: decoded.password},
            'name email basket'
        ).lean();
        req.user = user;
        if (user) {
            req.user.isAdmin = admins.has(req.user.email);
        }

        next();
    } catch (e) {
        res.status(401);
    }
};

module.exports = auth;