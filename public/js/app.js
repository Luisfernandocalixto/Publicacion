
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



export function checkForm(input, inputSecond, button) {
    if (input.value.trim() === "" || inputSecond.value.trim() === "") {
        button.disabled = true;
    }
    else {
        button.disabled = false;
    }

}
export function checkFormText(input, button) {
    if (input.value.trim() === "") {
        button.disabled = true;
    }
    else {
        button.disabled = false;
    }

}

export function checkInput(input, button) {
    const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (input.value.trim() === "") {
        button.disabled = true;
    }
    else if (!regex.test(input.value.trim())) {
        Swal.fire({ icon: "error", title: "Oops...", text: `La contraseña debe contener letras, números y al menos un símbolo.` });

    }
    else {
        button.disabled = false;
    }

}

export function checkForm_Account(input, input2, input3, input4, button) {
    const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (input.value.trim() === "" || input2.value.trim() === "" || input3.value.trim() === "" || input4.value.trim() === "") {
        button.disabled = true;
    }
    else if (!regex.test(input3.value.trim() || !regex.test(input4.value.trim()))) {
        Swal.fire({ icon: "error", title: "Oops...", text: `La contraseña debe contener letras, números y al menos un símbolo.` });

    }
    else if (input3.value.trim() !== input4.value.trim()) {
        Swal.fire({ icon: "error", title: "Oops...", text: `La contraseña no coincide.` });

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
            <button class="swal2-confirm swal2-styled"  type="submit"name="button">Modificar contraseña</button>
            </div>
            </form>
                `
}
