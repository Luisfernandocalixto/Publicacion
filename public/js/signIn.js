import { showPassword, checkForm , renameMessage} from '/js/app.js';
document.addEventListener('DOMContentLoaded', function () {
  // variables select elements of DOM => id="setVisible"
  let setVisible = document.getElementById('setVisible');
  let inputAccount = document.getElementById('inputAccount');

  setVisible.onclick = function () {
    showPassword(inputAccount, setVisible);
  }


  let form = document.querySelector('form');
  let button = form.querySelector('button[type="submit"]');
  let inputEmail = form.querySelector('input[name="email"]');
  let inputPassword = form.querySelector('input[name="password"]');

  form.addEventListener('change', function () {
    checkForm(inputEmail, inputAccount, button)
  });

  form?.addEventListener('submit', e => {
    e.preventDefault()

    button.disabled = true;
    fetch('/users/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: inputEmail.value.trim(), password: inputPassword.value.trim() })
    })
      .then(res => {
        if (res.ok) {
          window.location.href = '/notes'
        } else {
          return res.text();
        }
      })
      .then(data => {
        if (!data) {

        }
        else {
          Swal.fire({ icon: "error", title: "Oops...", text: `${renameMessage(data)}`, confirmButtonColor: "#024751" });
        }

      })
      .finally(() => {
        button.disabled = false
        form.reset();
      })


  })



})
