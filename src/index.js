const express = require('express');
require('./db/mongoose');
const path = require('path');
const hbs = require('hbs');
const userRouter = require('./routers/user');
const productRouter = require('./routers/product');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const auth = require('./middleware/auth');

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(userRouter);
app.use(productRouter);

app.listen(port, () => {
    console.log(`Server is up on ${port}`);
});

const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, './utils/views');
const partialsPath = path.join(__dirname, './utils/partials');

app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

app.use(express.static(publicDirectoryPath));

app.get('/', auth, async (req, res) => {
    req.user
        ? (req.user.isAdmin
            ? res.render('home', {isLogged: true, isAdmin: true})
            : res.render('home', {isLogged: true, isAdmin: false}))
        : res.render('home', {isLogged: false, isAdmin: false});
});

app.get('/about', auth, async (req, res) => {
    req.user
        ? (req.user.isAdmin
            ? res.render('about', {isLogged: true, isAdmin: true})
            : res.render('about', {isLogged: true, isAdmin: false}))
        : res.render('about', {isLogged: false, isAdmin: false});
});

app.get('/contact', auth, async (req, res) => {
    req.user
        ? (req.user.isAdmin
            ? res.render('contact', {isLogged: true, isAdmin: true})
            : res.render('contact', {isLogged: true, isAdmin: false}))
        : res.render('contact', {isLogged: false, isAdmin: false});
});

app.get('/pay', auth, async (req, res) => {
    req.user
        ? (req.user.isAdmin
            ? res.render('pay', {isLogged: true, isAdmin: true})
            : res.render('pay', {isLogged: true, isAdmin: false}))
        : res.render('pay', {isLogged: false, isAdmin: false});
});
