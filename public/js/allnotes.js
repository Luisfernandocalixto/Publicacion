import { checkForm } from "/js/app.js";

document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    const inputTitle = form.querySelector('input[name="title"]');
    const inputDescription = form.querySelector('textarea[name="description"]');

    form.addEventListener('change', function (e) {
        e.preventDefault();
        checkForm(inputTitle, inputDescription, button);
    })


});
