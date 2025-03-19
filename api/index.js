require('dotenv').config();
const express = require('express');
const { engine } = require('express-handlebars');
const session = require('express-session');
const path = require('path');
const flash = require('connect-flash');
const passport = require('passport');


// server
const app = express();
require('../src/database/database.js');
require('../src/config/passport.js');
app.disable('x-powered-by');



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
    resave: false,
    saveUninitialized: false,
}))
app.use(flash())
app.use((req, res, next) => {
    res.locals.message = req.flash('error');
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');

    next();
});

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
});



app.use(passport.initialize())
app.use(passport.session())
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
})




app.use(require('../src/routes/links.js'));
app.use(require('../src/routes/users.js'));
app.use(require('../src/routes/notes.js'));

app.use(express.static(path.join(__dirname, '../public')));

app.listen(app.get('port'), () => {
    console.log(`listening on http://localhost:${app.get('port')}`)
})

module.exports = app;