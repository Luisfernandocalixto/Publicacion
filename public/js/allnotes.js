import { checkFormByComment } from "/js/app.js";

document.addEventListener('DOMContentLoaded', function () {
    //select elements of DOM => <form>
    const form = document.querySelector('form');
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    const inputTitle = form.querySelector('input[name="title"]');
    const inputDescription = form.querySelector('textarea[name="description"]');

    form.addEventListener('change', function (e) {
        e.preventDefault();
        checkFormByComment(inputTitle, inputDescription, button);
    })


});
