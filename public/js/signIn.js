import { showPassword , checkForm} from '/js/app.js';
document.addEventListener('DOMContentLoaded', function() {

  let setVisible = document.getElementById('setVisible');
  let inputAccount = document.getElementById('inputAccount');

  setVisible.onclick = function(){
  showPassword(inputAccount, setVisible);
  } 


  let form = document.querySelector('form');
  let button = form.querySelector('button[type="submit"]');
  let inputEmail = form.querySelector('input[name="email"]');


  form.addEventListener('change', function(){
    checkForm(inputEmail, inputAccount, button)
  });
})
