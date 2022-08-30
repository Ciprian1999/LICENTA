const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Introduceti un email valid!');
            }
        },
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('parola')) {
                throw new Error('Parola nu poate include "parola"');
            }
        },
        min: [6, 'Parola trebuie sa contina minim 6 caractere!'],
    },

    address: {
        fullName: {
            type: String,
            trim: true,
            lowercase: true
        },
        email: {
            type: String,
            trim: true,
            unique: true,
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Introduceti un email valid!');
                }
            },
        },
        address: {
            type: String,
            trim: true,
            lowercase: true
        },
        city: {
            type: String,
            trim: true,
            lowercase: true
        },
        county: {
            type: String,
            trim: true,
            lowercase: true
        },
        postalCode: {
            type: Number,
            trim: true,
            lowercase: true,
        },
    },
    card: {
        cardName: {
            type: String,
            trim: true,
            lowercase: true
        },
        cardNumber: {
            type: Number,
            trim: true,
            lowercase: true,
        },
        expiryMonth: {
            type: String,
            trim: true,
            lowercase: true
        },
        expiryYear: {
            type: Number,
            trim: true,
            lowercase: true
        },
        ccv: {
            type: Number,
            trim: true,
            lowercase: true
        }
    },
    receipts: [{
        type: String
    }]
});

userSchema.methods.generateAuthToken = async function (minutes) {
    const user = this;
    const token = jwt.sign({
        password: user.password,
    },
        process.env.JWT_SECRET,
        {expiresIn: `${minutes}m`}
    );
    return token;
};

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
};

userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email});

    if (!user) {
        return null;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return null;
    }

    return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;