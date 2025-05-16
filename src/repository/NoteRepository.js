const z = require("zod");
const Publication = require("../models/publication.js");

const note = z.object({
    title: z.string('title invalid!').trim().min(1, { message: 'title empty!' }),
    description: z.string({ message: 'description  invalid!' }).trim({}).min(1, { message: 'description empty!' }),

});

const commentInNote = z.object({
    name: z.string('name invalid!').trim().min(1, { message: 'name empty!' }),
    email: z.string('email invalid!').trim().min(1, { message: 'email empty!' }).email({ message: 'email invalid!' }),
    comment: z.string({ message: 'comment  invalid!' }).trim({}).min(1, { message: 'comment empty!' }),

});

function validateUpdateNote(input) {
    return note.safeParse(input);
}

function validateNote(input) {
    return note.safeParse(input);
}

function validateComment(input) {
    return commentInNote.safeParse(input);
}

module.exports = {
    validateUpdateNote,
    validateNote,
    validateComment
};
