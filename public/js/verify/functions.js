import z from "/js/zod/zod.js"

const user = z.object({
    name: z.string({ message: 'name  invalid!' }).trim().min(1, { message: 'name empty!' }),
    email: z.string('email invalid!').trim().min(1, { message: 'email empty!' }).email({ message: 'email invalid!' }),
    password: z.string({ message: 'password  invalid!' }).trim().min(1, { message: 'password empty!' }),

});

const comment = z.object({
    id: z.string({ message: 'id is invalid!' }).trim().min(1, { message: 'id is empty!' }),
    title: z.string({ message: 'title is invalid!' }).trim().min(1, { message: 'title is empty!' }),
    description: z.string({ message: 'description  invalid!' }).trim().min(1, { message: 'description empty!' }),

}
);


function validateDataOfUser(input) {
    return user.partial().safeParse(input);
}

function validateDataOfComment(input) {
    return comment.partial().safeParse(input);
}

export {
    validateDataOfUser,
    validateDataOfComment
}