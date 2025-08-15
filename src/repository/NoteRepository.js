const z = require("zod");

const note = z.object({
    id: z.string('id is invalid!').trim().min(1, { message: 'id is empty!' }),
    title: z.string('title invalid!').trim().min(1, { message: 'title empty!' }),
    description: z.string({ message: 'description  invalid!' }).trim({}).min(1, { message: 'description empty!' }),
    user_id: z.string('identifier of user is invalid!').trim().min(1, { message: 'identifier of user is empty!' }),
    
});

const commentInNote = z.object({
    name: z.string('name invalid!').trim().min(1, { message: 'name empty!' }),
    email: z.string('email invalid!').trim().min(1, { message: 'email empty!' }).email({ message: 'email invalid!' }),
    comment: z.string({ message: 'comment  invalid!' }).trim({}).min(1, { message: 'comment empty!' }),

});


function validateDataByNote(input) {
    return note.partial().safeParse(input);
}

function validateComment(input) {
    return commentInNote.safeParse(input);
}

module.exports = {
    validateComment,
    validateDataByNote
};
