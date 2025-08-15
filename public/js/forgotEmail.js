import { checkFormText } from '/js/app.js';
document.addEventListener('DOMContentLoaded', function () {
    //select elements of DOM =>  class="formUser"
    const form = document.querySelector('.formUser');
    const button = form.querySelector('button[type="submit"]');
    const inputEmail = form.querySelector('input[name="email"]');
    button.disabled = true;
    form.addEventListener('change', function (e) {
        e.preventDefault();
        checkFormText(inputEmail, button)
    })

});