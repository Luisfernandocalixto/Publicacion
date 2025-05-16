const { JWT_SECRET, EMAIL, NAME, BREVO_API_KEY, URL } = require("../config/config.js");
const { typeErrors } = require("../errors/errors");
const User = require("../models/User");
const { UserRepository, validateUserUpdate, validateUserUpdatePassword, validateUserSignup, validateCheckEmail, validatePassword } = require("../repository/UserRespository");
const Brevo = require('@getbrevo/brevo');
const bcrypt = require('bcryptjs');
const apiInstance = new Brevo.TransactionalEmailsApi();

apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, BREVO_API_KEY);



const jwt = require('jsonwebtoken');
let success_msg = '';
let error_msg = '';
const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

class UserController {
    static async getSignIn(req, res) {
        try {
            const { success_msg, error_msg } = req.query;
            res.render('./components/signin.hbs', { success_msg, error_msg });

        } catch (error) {
            res.status(500).json({ error: 'error' });
        }
    }

    static async postSignIn(req, res) {
        try {
            const { email, password } = req.body

            const user = await UserRepository.login({ email, password })
            const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '1h' })


            res.cookie('access_token', token, {
                httpOnly: true, // la cookie solo se puede acceder en el  servidor
                secure: process.env.NODE_ENV === 'production', // la cookie solo se puede acceder en https
                sameSite: 'strict', // la cookie solo se puede acceder en el mismo dominio
                maxAge: 1000 * 60 * 60 // la cookie tiene un tiempo de validez de 1 hora
            }).send({ user, token })
        } catch (error) {
            if (error.message === typeErrors.USER) return res.status(401).json(typeErrors.USER);
            if (error.message === typeErrors.PASSWORD) return res.status(401).json(typeErrors.PASSWORD);
            if (error.message.includes('password') || error.message.includes('email')) return res.status(401).json(error.message);
            return res.status(401).send("Error start session");

        }
    }

    static async getSettings(req, res) {
        try {
            const currentSession = req.session;
            const { id, name, email } = currentSession.user;

            const userAuthenticated = id;
            const userName = name;
            const userEmail = email;

            const { success_msg, error_msg } = req.query;

            res.render('components/reset.hbs', { userAuthenticated, userName, userEmail, success_msg, error_msg });
        } catch (error) {
            res.status(500).json({ error: 'error' });

        }
    }

    static async postSettings(req, res) {
        try {

            const { password } = req.body;
            const currentSession = req.session;
            const { id } = currentSession.user;

            const verify = validateUserUpdatePassword({ password });
            if (!verify.success) {
                const message = JSON.parse(verify.error);
                const errors = message.map(err => err.message);
                return res.redirect(`/users/settings/?success_msg=${success_msg}&error_msg=${errors}`);
            }

            if (!regex.test(password)) {
                error_msg = 'Password should have length of 8 character minimum, should have letters, numbers and symbol!.';
                return res.redirect(`/users/settings/?success_msg=${success_msg}&error_msg=${error_msg}`);
            }
            else {
                const verifyUser = await User.findOne({ _id: id });
                if (verifyUser) {
                    verifyUser.password = await verifyUser.encryptPassword(password.trim());
                    await verifyUser.save();
                    success_msg = 'your password has been updated!';
                    return res.redirect(`/notes/?success_msg=${success_msg}&error_msg=${error_msg}`);
                }
                else {
                    error_msg = 'password not updated!';
                    return res.redirect(`/notes/?success_msg=${success_msg}&error_msg=${error_msg}`);
                }

            }
        } catch (error) {
            console.error(error);

            res.status(500).json({ error: 'error' });

        }
    }


    static async settingsGeneral(req, res) {
        try {

            const { name, email } = req.body;
            const currentSession = req.session;
            const { id } = currentSession.user;


            const verify = validateUserUpdate({ name, email });
            if (!verify.success) {
                const message = JSON.parse(verify.error);
                const errors = message.map(err => err.message);
                return res.redirect(`/users/settings/?success_msg=${success_msg}&error_msg=${errors}`);
            }
            else {
                const verifyUser = await User.findOne({ _id: id });

                if (verifyUser) {
                    verifyUser.name = name;
                    verifyUser.email = email;
                    await verifyUser.save();
                    success_msg = 'profile updated!'
                    return res.redirect(`/notes/?success_msg=${success_msg}&error_msg=${error_msg}`);
                }
                else {
                    error_msg = 'profile not updated!';
                    return res.redirect(`/notes/?success_msg=${success_msg}&error_msg=${error_msg}`);
                }
            }

        } catch (error) {
            console.error(error);

            res.status(500).json({ error: 'error' });

        }
    }


    static async forgotEmail(req, res) {
        try {
            const { success_msg, error_msg } = req.query;

            res.render('components/forgotEmail.hbs', { success_msg, error_msg });
        } catch (error) {
            res.status(500).json({ error: 'error' });

        }
    }
    static async forgotCheckEmail(req, res) {
        try {
            const { email } = req.body;

            const verify = validateCheckEmail({ email });
            if (!verify.success) {
                const message = JSON.parse(verify.error);
                const errors = message.map(err => err.message);
                return res.redirect(`/users/forgotEmail/?success_msg=${success_msg}&error_msg=${errors}`);
            }

            const verifyUser = await User.findOne({ email: email });

            if (!verifyUser || verifyUser.length <= 0) {
                error_msg = 'Not account found!';
                return res.redirect(`/users/forgotEmail/?success_msg=${success_msg}&error_msg=${error_msg}`);
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

                success_msg = 'Se ha enviado un correo electrónico con un enlace para restablecer la contraseña!';
                return res.redirect(`/users/forgotEmail/?success_msg=${success_msg}&error_msg=${error_msg}`);
            }

        } catch (error) {
            res.status(500).json({ message: 'Ocurrió un error' });
        }
    }

    static async getResetPassword(req, res) {
        try {
            const { token } = req.params;
            if (!token || token.trim() === '') {
                error_msg = 'Token inválid!';
                return res.redirect(`/users/forgotEmail/?success_msg=${success_msg}&error_msg=${error_msg}`);
            }
            res.render('components/resetPassword.hbs', { token });
        } catch (error) {
            res.status(500).json({ message: 'Error al restablecer contraseña' })
        }
    }


    static async postResetPassword(req, res) {
        try {
            const { password } = req.body;
            const { token } = req.params;

            if (!token || token.trim() === '') return res.status(500).json({ message: 'Token invalid!' });
            const verify = validatePassword({ password });
            if (!verify.success) {
                const message = JSON.parse(verify.error);
                const errors = message.map(err => err.message);
                return res.status(500).json({ message: errors });
            }
            if (!regex.test(password.trim())) return res.status(500).json({ message: 'Password should have length of 8 character minimum, should have letters, numbers and symbol!..' });


            const decoded = jwt.verify(token, JWT_SECRET);
            const userId = decoded.userId;
            const verifyUser = await User.findOne({ email: userId });
            if (!verifyUser) {
                error_msg =  'user not found!';
                return res.redirect(`/users/signin/?success_msg=${success_msg}&error_msg=${error_msg}`);
            }
            else {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password.trim(), salt);
                verifyUser.password = hashedPassword;
                await verifyUser.save();
                success_msg = 'password updated!';
                return res.redirect(`/users/signin/?success_msg=${success_msg}&error_msg=${error_msg}`);
            }
        } catch (error) {
            res.status(500).json({ message: 'Error while resetting password o token expired' })
        }
    }

    static async getSignup(req, res) {
        try {
            res.render('components/signup');

        } catch (error) {
            res.status(500).json({ error: 'Ocurrió un error' });

        }
    }

    static async postSignup(req, res) {
        try {
            const { name, email, password, confirm_password } = req.body;

            const verify = validateUserSignup({ name, email, password });
            if (!verify.success) {
                const message = JSON.parse(verify.error);
                const errors = message.map(err => err.message);
                return res.redirect(`/users/signup/?success_msg=${success_msg}&error_msg=${errors}`);
            }

            if (password !== confirm_password) {
                error_msg = 'passwords do not match!';
                return res.redirect(`/users/signup/?success_msg=${success_msg}&error_msg=${error_msg}`);
            }

            if (!regex.test(password)) {
                error_msg = 'Password should have length of 8 character minimum, should have letters, numbers and symbol!.';
                return res.redirect(`/users/signup/?success_msg=${success_msg}&error_msg=${error_msg}`);
            }

            const emailUser = await User.findOne({ email: email });
            if (emailUser) {
                error_msg = 'Email already exists!';
                return res.redirect(`/users/signup/?success_msg=${success_msg}&error_msg=${error_msg}`);
            }

            const newUser = new User({ name, email, password });
            newUser.password = await newUser.encryptPassword(password.trim());
            await newUser.save();
            success_msg = 'account created successfully!';
            return res.redirect(`/users/signin/?success_msg=${success_msg}&error_msg=${error_msg}`);

        } catch (error) {
            res.status(500).json({ error: 'Ocurrió un error' });
        }
    }

    static async logout(req, res) {
        try {
            res.clearCookie('access_token').redirect('/users/signin');
        } catch (error) {
            res.status(500).json({ message: 'Error logout!' })
        }
    }


    // end class
}

module.exports = {
    UserController
};
