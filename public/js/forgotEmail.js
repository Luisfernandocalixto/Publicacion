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

    form.addEventListener('change', function (e) {
        e.preventDefault();
        checkFormText(inputEmail, button)
    })

    
      form?.addEventListener('submit', e => {
        e.preventDefault()
    
        button.disabled = true;
        fetch('/users/forgotCheckEmail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: inputEmail.value.trim() })
        })
          .then(res => {
            if (res.ok) {
                Swal.fire({ icon: "success", title: "Bien hecho!...", text: 'Se ha enviado un email para restablecer su contraseña!', confirmButtonColor: "#024751" });
            } else {
              return res.text();
            }
          })
          .then(data => {
            if (!data) {
    
            }
            else {
            }
    
          })
          .finally(() => {
            button.disabled = false
            form.reset();
          })
     })

});