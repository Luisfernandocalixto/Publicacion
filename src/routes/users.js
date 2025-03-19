const express = require('express');
const router = express.Router();
const User = require('../models/User.js');
const passport = require('passport');
const flash = require('connect-flash');
const { isAuthenticated } = require('../helpers/auth.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SibApiV3Sdk = require('@sendinblue/client');
const { EMAIL, NAME, BREVO_API_KEY, URL, JWT_SECRET } = require('../config/config.js');


const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, BREVO_API_KEY);

const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

router.get('/users/signin', async (req, res) => {
    try {
        res.render('./components/signin.hbs');

    } catch (error) {
        res.status(500).json({ error: 'Ocurrió un error' });
    }
});

router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/users/signin',
    failureFlash: true

}))


router.get('/users/settings', isAuthenticated, async (req, res) => {
    try {
        const userAuthenticated = req.user.id;
        const userName = req.user.name;
        const userEmail = req.user.email;

        res.render('components/reset.hbs', { userAuthenticated, userName, userEmail });
    } catch (error) {
        res.status(500).json({ error: 'Ocurrió un error' });

    }
});

router.post('/users/settings', isAuthenticated, async (req, res) => {
    try {

        const { password } = req.body;


        if (!password || password.trim() === "") {
            req.flash('error_msg', 'Por favor, complete los campos solicitados!');
            res.redirect('/users/settings');
            return;
        }

        if (!regex.test(password)) {
            req.flash('error_msg', 'La contraseña debe tener una longitud de 8 caracteres mínimo, contener letras, números y al menos un símbolo.');
            res.redirect('/users/settings');
            return;
        }
        else {
            const verifyUser = await User.findOne({ _id: req.user.id });
            if (verifyUser) {
                verifyUser.password = await verifyUser.encryptPassword(password.trim());
                await verifyUser.save();
                req.flash('success_msg', 'Contraseña actualizada!')
                res.redirect("/notes");
                return;
            }
            else {
                req.flash('error_msg', 'No se encontró la cuenta');
                res.redirect("/notes");
                return;
            }

        }
    } catch (error) {
        res.status(500).json({ error: 'Ocurrió un error' });

    }
});

router.post('/users/settingsGeneral', isAuthenticated, async (req, res) => {
    try {

        const { name, email } = req.body;


        if (!name || name.trim() === "" || !email || email.trim() === "") {
            req.flash('error_msg', 'Por favor, complete los campos solicitados!');
            res.redirect('/users/settings');
            return;
        } else {
            const verifyUser = await User.findOne({ _id: req.user.id });
            if (verifyUser) {
                verifyUser.name = name;
                verifyUser.email = email;
                await verifyUser.save();
                req.flash('success_msg', 'Datos actualizados!')
                res.redirect("/notes");
                return;
            }
            else {
                req.flash('error_msg', 'No se encontró la cuenta');
                res.redirect("/notes");
                return;
            }
        }

    } catch (error) {
        res.status(500).json({ error: 'Ocurrió un error' });

    }
});

router.get('/users/forgotEmail', async (req, res) => {
    try {

        res.render('components/forgotEmail.hbs');
    } catch (error) {
        res.status(500).json({ error: 'Ocurrió un error' });

    }
});

router.post('/users/forgotCheckEmail', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email || email.trim() === '') {
            req.flash('error_msg', 'Por favor, complete los campos solicitados!');
            res.redirect('/users/forgotEmail');
            return
        }

        const verifyUser = await User.findOne({ email: email });

        if (!verifyUser || verifyUser.length <= 0) {
            req.flash('error_msg', 'No se encontró la cuenta, con este correo electrónico');
            res.redirect('/users/forgotEmail');
            return
        }
        else {

            const token = jwt.sign({ userId: email }, JWT_SECRET, { expiresIn: '1h' });

            const sendSmtpEmail = {
                to: [{ email: email, name: email }],
                sender: { email: EMAIL, name: NAME },
                subject: 'Recuperación de cuenta',
                htmlContent: `<strong>Hola, aquí tienes la información solicitada:</strong>
                <a href="${URL}/resetPassword/${token}">Restablecer contraseña</a>
                `
            };
            apiInstance.sendTransacEmail(sendSmtpEmail).then(
                function (data) {
                    console.log('Correo enviado exitosamente. Respuesta:');
                },
                function (error) {
                    console.error('Error al enviar el correo:');
                }
            );

            req.flash('success_msg', 'Se ha enviado un correo electrónico con un enlace para restablecer la contraseña!');
            res.redirect('/users/forgotEmail');
            return;
        }

    } catch (error) {
        res.status(500).json({ message: 'Ocurrió un error' });
    }
});


router.get('/resetPassword/:token', async (req, res) => {
    try {
        const { token } = req.params;
        if (!token || token.trim() === '') {
            req.flash('error_msg', 'Token inválido, Verifique!');
            // res.status(500).json({ message: 'Token inválido, Verifique!' });
            res.redirect('/users/forgotEmail');
            return;
        }
        res.render('components/resetPassword.hbs', { token });
    } catch (error) {
        res.status(500).json({ message: 'Error al restablecer contraseña' })
    }
});

router.post('/resetPassword/:token', async (req, res) => {
    try {
        const { password } = req.body;
        const { token } = req.params;

        if (!token || token.trim() === '') return res.status(500).json({ message: 'Token inválido, Verifique!' });
        if (!password || password.trim() === '') return res.status(500).json({ message: 'Contraseña inválida, Verifique!' });
        if (!regex.test(password.trim())) return res.status(500).json({ message: 'La contraseña debe tener una longitud de 8 caracteres mínimo, contener letras, números y al menos un símbolo.' });


        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.userId;
        const verifyUser = await User.findOne({ email: userId });
        if (!verifyUser) {
            req.flash('error_message', 'Usuario no encontrado');
            return res.redirect('/users/signin');
        }
        else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password.trim(), salt);
            verifyUser.password = hashedPassword;
            await verifyUser.save();
            req.flash('success_msg', 'Contraseña actualizada correctamente!');
            res.redirect('/users/signin');
            return
        }
    } catch (error) {
        res.status(500).json({ message: 'Error while resetting password o token expired' })
    }
});

router.get('/users/signup', async (req, res) => {
    try {
        res.render('components/signup');

    } catch (error) {
        res.status(500).json({ error: 'Ocurrió un error' });

    }
});

router.post('/users/signup', async (req, res) => {
    try {
        const { name, email, password, confirm_password } = req.body;

        if (!name || !email || !password || !confirm_password || name.trim() === "" || email.trim() === "" || password.trim() === "" || confirm_password.trim() === "") {
            req.flash('error_msg', 'Por favor, complete los campos solicitados!');
            res.redirect('/users/signup');
            return;
        }

        if (password != confirm_password) {
            req.flash('error_msg', 'La contraseña no coincide');
            res.redirect('/users/signup');
            return;
        }

        if (!regex.test(password)) {
            req.flash('error_msg', 'La contraseña debe tener una longitud de 8 caracteres mínimo, contener letras, números y al menos un símbolo.');
            res.redirect('/users/signup');
            return;
        }

        else {
            const emailUser = await User.findOne({ email: email });
            if (emailUser) {
                req.flash('error_msg', 'El correo ya existe!');
                res.redirect("/users/signup?");
                return;
            }

            const newUser = new User({ name, email, password });
            newUser.password = await newUser.encryptPassword(password.trim());
            await newUser.save();
            req.flash('success_msg', 'Cuenta registrada!')
            res.redirect("/users/signin");
            return;
        }

    } catch (error) {
        res.status(500).json({ error: 'Ocurrió un error' });
    }
});


router.get('/users/logout', async (req, res, next) => {
    req.logOut(function (err) {
        if (err) { return next(err); }
        res.redirect('/')
    })
});



module.exports = router;