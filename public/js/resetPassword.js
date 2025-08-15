import { showPassword , checkInput} from '/js/app.js';
document.addEventListener('DOMContentLoaded', function() {
  // variables select elements of DOM = "<form>"
  let form = document.querySelector('form');
  let button = form.querySelector('button[type="submit"]');
  let inputPassword = form.querySelector('input[name="password"]');
  button.disabled = true;
  let setVisible = document.getElementById('visible');
  let inputAccount = document.getElementById('inputAccount');

  setVisible.onclick = function(){
  showPassword(inputPassword, setVisible);
  } 




  form.addEventListener('change', function(){
    checkInput(inputPassword, button)
  });
})