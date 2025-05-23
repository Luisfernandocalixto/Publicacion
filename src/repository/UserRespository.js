const z = require("zod");
const User = require("../models/User");

const user = z.object({
    name: z.string({ message: 'name  invalid!' }).trim({}).min(1, { message: 'name empty!' }),
    email: z.string('email invalid!').trim().min(1, { message: 'email empty!' }).email({ message: 'email invalid!' }),
    password: z.string({ message: 'password  invalid!' }).trim({}).min(1, { message: 'password empty!' }),

});

function validateUserSignIn(input) {
    return user.partial().safeParse(input);
}

function validateUserSignup(input) {
    return user.partial().safeParse(input);
}

function validateUserUpdate(input) {
    return user.partial().safeParse(input);
}

function validateUserUpdatePassword(input) {
    return user.partial().safeParse(input);
}

function validateCheckEmail(input) {
    return user.partial().safeParse(input);
}

function validatePassword(input) {
    return user.partial().safeParse(input);
}




class UserRepository {

    static async login({ email, password }) {
        const verify = validateUserSignIn({ email, password });
        if (!verify.success) {
            const message = JSON.parse(verify.error);
            const errors = message.map(err => err.message);
            throw new Error(errors);
        }

        const user = await User.findOne({ email: email });

        if (!user) {
            throw new Error('Not user found');
        }
        else {
            const math = await user.matchPassword(password);
            if (math) {
                const publicUser = {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
                return publicUser;
            }
            else {
                throw new Error("Incorrect Password");
            }
        }
    }
}


module.exports = {
    validateUserSignIn,
    validateUserSignup,
    validateUserUpdate,
    validateUserUpdatePassword,
    validateCheckEmail,
    validatePassword,
    UserRepository
};
