import { showPassword, checkInput, contentForm , checkForm} from '/js/app.js';
document.addEventListener('DOMContentLoaded', function () {

    let visible = document.getElementById('visible');
    let input = document.getElementById('input');
    visible.onclick = function () {
        showPassword(input, visible)

    }

    const form = document.querySelector('.formInitial');
    const button = form.querySelector('button[type="submit"]');
    const inputPassword = form.querySelector('input[name="password"]');
    button.disabled = true;
    form.addEventListener('change', function (e) {
        e.preventDefault();
        checkInput(inputPassword, button)
    })

    const formGeneral = document.querySelector('.formUser');
    console.log(formGeneral);
    
    const buttonSubmit = formGeneral.querySelector('button[type="submit"]');
    const inputName = formGeneral.querySelector('input[name="name"]');
    const inputEmail = formGeneral.querySelector('input[name="email"]');
    buttonSubmit.disabled = true;
    formGeneral.addEventListener('change', function (e) {
        e.preventDefault();
        checkForm(inputName, inputEmail, buttonSubmit)
    })

    const showTemplate = document.querySelector('.showTemplate');

    button.addEventListener('click', async function (e) {
        e.preventDefault();
        Swal.fire({
            title: "<strong>Esta seguro de modificar la contraseña?</strong>",
            icon: "warning",
            html: `${contentForm(inputPassword.value.trim())}`,
            showConfirmButton:false,
            showCancelButton: true,

        });

    });

  
})

