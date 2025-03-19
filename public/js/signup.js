import { showPasswords, checkForm_Account } from '/js/app.js';
document.addEventListener('DOMContentLoaded', function () {

    let visible = document.getElementById('visible');
    let input = document.getElementById('input');
    let inputConfirm = document.getElementById('inputConfirm');
    visible.onclick = function () {
        showPasswords(input, inputConfirm, visible)

    }

    const formSignup = document.querySelector('form');
    const inputName = formSignup.querySelector('input[name="name"]');
    const inputEmail = formSignup.querySelector('input[name="email"]');
    const inputPassword = formSignup.querySelector('input[name="password"]');
    const inputConfirmPassword = formSignup.querySelector('input[name="confirm_password"]');
    const button = formSignup.querySelector('button[type="submit"]');
    button.disabled = true;
    formSignup.addEventListener('change', function (e) {
        e.preventDefault();
        checkForm_Account(inputName, inputEmail, inputPassword, inputConfirmPassword, button)

    })

})

