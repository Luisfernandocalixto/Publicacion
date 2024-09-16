const express = require('express');
const router = express.Router();
const User = require('../models/User.js');
const passport = require('passport');
const flash = require('connect-flash');



router.get('/users/signin', async (req, res) => {
    try {
        res.render('./components/signin.hbs');

    } catch (error) {
        console.error('Error', error);
    }
});

router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/users/signin',
    failureFlash: true

}))



router.get('/users/signup', async (req, res) => {
    try {
        res.render('components/signup');

    } catch (error) {
        console.error('Error', error);

    }
});

router.post('/users/signup', async (req, res) => {
    try {
        const { name, email, password, confirm_password } = req.body;

        const errors = [];

        if (name.length <= 0) {
            errors.push({ text: 'Por favor, ingrese su nombre' });
        }
        if (password != confirm_password) {
            errors.push({ text: 'La contraseña no coincide' });
        }
        if (password.length < 4) {
            errors.push({ text: 'La contraseña debe tener una longitud de al menos 4 caracteres' });
        }
        if (!name || !email || !password || !confirm_password) {
            errors.push({ text: 'Por favor, complete los campos solicitados!' });
            
        }

        if (errors.length > 0) {
            req.flash(errors)
            res.render('components/signup', { errors, name, email, password, confirm_password });
        }


        else {
            const emailUser = await User.findOne({ email: email });
            if (emailUser) {
                req.flash('error_msg', 'El correo ya existe!');
                errors.push({ text: 'El correo  ya existe!' });
                res.redirect("/users/signup?");
            }

            const newUser = new User({ name, email, password });
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            req.flash('success_msg', 'Cuenta registrada')
            res.redirect("/users/signin");
        }

    } catch (error) {
        console.error('Error', error);

    }
});

router.get('/users/logout', async (req, res, next) => {
    req.logOut(function (err) {
        if (err) { return next(err); }
        res.redirect('/')
    })
});



module.exports = router;