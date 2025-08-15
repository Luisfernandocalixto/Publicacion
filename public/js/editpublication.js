
document.addEventListener('DOMContentLoaded', function () {
    // select elements of DOM =>  id="deletePub"
    let deletePub = document.querySelector('#deletePub');
    let formDeletePub = document.querySelector('#formDeletePub');
    let bodySend = formDeletePub.getAttribute('data-sett');

    deletePub.addEventListener('click', async function (event) {
        event.preventDefault();
        const url = `/notes/${bodySend}`
        const options = { method: 'DELETE', }
        Swal.fire({
            title: "Esta seguro de eliminar esta publicación?",
            showCancelButton: true,
            confirmButtonText:
                "Eliminar",
            confirmButtonColor: "#024751",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(url, options);
                    window.location.href = response.url;
                    
                }
                catch (error) {
                    Swal.fire({ icon: "error", title: "Oops...", text: `Ocurrio un error`, confirmButtonColor: "#024751" });
                    throw new Error("Error");
                }
            }
        });
    });
    
    
    const formEdit = document.querySelector('.formEdit');
    const inputTitle = formEdit.querySelector('input[name="title"]');
    const inputDescription = formEdit.querySelector('textarea[name="description"]');
    const button = formEdit.querySelector('button[type="submit"]');
    button.disabled = true;
    
    formEdit.addEventListener('change', function (e) {
        e.preventDefault();
        if (inputTitle.value.trim() === "" || inputDescription.value.trim() === "") {
            button.disabled = true;
        }
        else {
            button.disabled = false;
        }

    })

    
    formEdit.addEventListener('submit', async function (event) {
        event.preventDefault();
        const isPublication = formEdit.querySelector('input[name="isPublication"]').value;
        try {
                  const response =   await fetch(`/notes/${isPublication}`, {
                         method: 'PUT',
                         headers: {
                           'Content-Type': 'application/json',
                         },
                         body : JSON.stringify({title : inputTitle.value , description: inputDescription.value})
                    });
                    window.location.href = response.url;
                }
                catch (error) {
                    Swal.fire({ icon: "error", title: "Oops...", text: `Ocurrio un error`, confirmButtonColor: "#024751" });
                    throw new Error("Error");
                }
            })

})