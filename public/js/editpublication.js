
document.addEventListener('DOMContentLoaded', function () {

    let deletePub = document.querySelector('#deletePub');
    let formDeletePub = document.querySelector('#formDeletePub');
    let bodySend = formDeletePub.getAttribute('data-sett');
    
    deletePub.addEventListener('click', async function (event) {
        event.preventDefault();
        const url = `/notes/delete/${bodySend}`
        const options = { method: 'POST', }
        Swal.fire({
            title: "Esta seguro de eliminar esta publicación?",
            showCancelButton: true,
            confirmButtonText:
                "Eliminar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(url, options);
                    const result = await response.text();
                    Swal.fire("Eliminado!", "", "success");
                    setTimeout(() => {
                        window.location.href = "/notes"
                    }, 3500);
                }
                catch (error) {
                    Swal.fire({ icon: "error", title: "Oops...", text: `Ocurrio un error` });
                    throw new Error("Error");
                }
            }
        });
    });


})