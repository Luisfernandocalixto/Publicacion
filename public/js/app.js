import { validateDataOfComment, validateDataOfUser } from "./verify/functions.js";
export function showPassword(input, span) {

    if (input.type === 'password') {
        input.type = 'text';
        span.innerHTML = `<img src="/img/invisible.svg" alt="Ocultar" title="Ocultar" />`;
    }
    else {
        input.type = 'password';
        span.innerHTML = `<img src="/img/visible.svg" alt="Ver" title="Ver" />`;

    }

}
export function showPasswords(input, inputSecond, span) {

    if (input.type === 'password') {
        input.type = 'text';
        inputSecond.type = 'text';
        span.innerHTML = `<img src="/img/invisible.svg" alt="Ocultar" title="Ocultar" />`;
    }
    else {
        input.type = 'password';
        inputSecond.type = 'password';
        span.innerHTML = `<img src="/img/visible.svg" alt="Ver" title="Ver" />`;

    }
}



export function checkForm(email, password, button) {
    
    const verify = validateDataOfUser({ email: email.value, password : password.value })
    
    if (!verify.success) {
        button.disabled = true;
    }
    else {
        button.disabled = false;
    }
    
}

export function checkFormByComment(title, description, button) {
    
    const verify = validateDataOfComment({ title: title.value, description : description.value })
    
    if (!verify.success) {
        button.disabled = true;
    }
    else {
        button.disabled = false;
    }
    
}

export function checkFormText(email, button) {
    const verify = validateDataOfUser({ email: email.value})
    
    if (!verify.success) {
        button.disabled = true;
    }
    else {
        button.disabled = false;
    }
    
}

export function checkInput(password, button) {
    const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    const verify = validateDataOfUser({ password: password.value})
    if (!verify.success) {
        button.disabled = true;
    }
    else if (!regex.test(password.value.trim())) {
        Swal.fire({ icon: "error", title: "Oops...", text: `La contraseña debe contener letras, números y al menos un símbolo.` });

    }
    else {
        button.disabled = false;
    }

}

export function checkForm_Account(name, email, password, confirmPassword, button) {
    const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    const verify = validateDataOfUser({name: name.value, email: email.value, password: password.value})
    const verifyConfirm = validateDataOfUser({password: confirmPassword.value})
    
    if (!verify.success) {
        button.disabled = true;
    }
    else if (!verifyConfirm.success) {
        button.disabled = true;
    }
    else if (!regex.test(password.value.trim() || !regex.test(confirmPassword.value.trim()))) {
        Swal.fire({ icon: "error", title: "Oops...", text: `La contraseña debe contener letras, números y al menos un símbolo.`, confirmButtonColor: "#024751" });

    }
    else if (password.value.trim() !== confirmPassword.value.trim()) {
        Swal.fire({ icon: "error", title: "Oops...", text: `La contraseña no coincide.`, confirmButtonColor: "#024751" });

    }
    else {
        button.disabled = false;
    }
}



export const contentForm = (password) => {

    return `<form
            action="/users/settings"
            method="post"
        >

        <div> 
                    <input
                        type="password"
                        name="password"
                        class="formInput"
                        placeholder="*****"
                        id="input"
                        value="${password}"
                        readonly
                        hidden
                    />
                    </div>
            
            <div> 
            <button class="swal2-confirm swal2-styled"  type="submit"name="button">Enviar</button>
            <button class="swal2-cancel swal2-styled" id="closeButton" type="reset">Cancelar</button>
            </div>
            </form>
                `
}

export function renameMessage(data) {
    if (data.includes('Not user found')) return 'No existe un usuario con el email ingresado!';
    if (data.includes('Incorrect Password')) return 'Contraseña incorrecta!';
    if (data.includes('name empty!')) return 'Ingrese un nombre!';
    if (data.includes('password empty!')) return 'Ingrese una contraseña!';
    if (data.includes('email invalid!')) return 'Formato de email inválido!';

    if (data.includes('account created successfully!')) return 'Cuenta creada satisfactoriamente!';
    
    if (data.includes('name invalid!')) return 'Nombre inválido!';
    if (data.includes('email empty!')) return 'Ingrese un nombre!';
    if (data.includes('password invalid!')) return 'Contraseña inválida!';
    if(data.includes('passwords do not match!')) return 'La contraseña no coincide!';
    if(data.includes('Password should have length of 8 character minimum, should have letters, numbers and symbol!.')) return 'La contraseña debe contener letras, números y al menos un símbolo.!';
    if(data.includes('Email already exists!')) return 'Ya existe un usuario con este email!';
    
    if (data.includes('password updated!')) return 'Contraseña actualizada!';
   
    if (data.includes('publication created')) return 'Publicación realizada!';
    if (data.includes('publication updated')) return 'Publicación actualizada!';

    if (data.includes('comment saved')) return 'Comentario realizado!';
    
    if (data.includes('publication deleted')) return 'Se ha eliminado la publicación!';
    
    if (data.includes('An email with a link to reset your password has been sent!')) return 'Se ha enviado un correo para restablecer su contraseña!';
    
    if (data.includes('profile updated!')) return 'Perfil actualizado!';
    if (data.includes('your password has been updated!')) return 'Contraseña actualizada!';
    
    return data
}
