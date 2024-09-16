require('dotenv').config();
const express = require('express');
const { engine } = require('express-handlebars');
const  session  = require('express-session');
const path = require('path');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const passport = require('passport');

const app = express();
require('../src/database/database.js');
require('../src/config/passport.js');

require('./');
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, '../src/views/'));
app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
}));

app.set('view engine', '.hbs');

app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use(session({
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true,
}))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())


app.use((req, res, next) => {
    res.locals.message = req.flash('error');
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;

    next();
});


app.use(require('../src/routes/links.js'));
app.use(require('../src/routes/users.js'));
app.use(require('../src/routes/notes.js'));

const www = process.env.WWW || './';
app.use(express.static(www));
console.log(`serving ${www}`);

app.listen(app.get('port'), () => {
    console.log(`listening on http://localhost:${app.get('port')}`)
})

module.exports = app;