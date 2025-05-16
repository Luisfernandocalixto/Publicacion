require('dotenv').config();
const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const { JWT_SECRET } = require('../src/config/config.js');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');



// server
const app = express();
require('../src/database/database.js');
require('../src/config/passport.js');
app.disable('x-powered-by');
app.use(cookieParser());



app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, '../src/views/'));
app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
}));

app.set('view engine', '.hbs');

app.use((req, res, next) => {
    const token = req.cookies.access_token
    req.session = { user: null }
    try {
        const data = jwt.verify(token, JWT_SECRET)
        req.session.user = data
    } catch (error) {
    }
    next();
})

app.use(express.urlencoded({ extended: false }))
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
});






app.use(require('../src/routes/links.js'));
app.use(require('../src/routes/users.js'));
app.use(require('../src/routes/notes.js'));

app.use(express.static(path.join(__dirname, '../public')));

app.listen(app.get('port'), () => {
    console.log(`Server listening on http://localhost:${app.get('port')}`)
})

module.exports = app;