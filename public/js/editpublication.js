
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
                    if (!response.ok) {
                        Swal.fire({ icon: "error", title: "Oops...", text: `Ocurrio un error` });
                    }
                    else{
                        Swal.fire("Eliminado!", "", "success");
                        setTimeout(() => {
                            window.location.href = "/notes"
                        }, 3500);
                    }
                }
                catch (error) {
                    Swal.fire({ icon: "error", title: "Oops...", text: `Ocurrio un error` });
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
    
    formEdit.addEventListener('change', function(e){
        e.preventDefault();
        if(inputTitle.value.trim() === "" || inputDescription.value.trim() === ""){
          button.disabled = true;
        }
        else{
          button.disabled = false;
        }
  
      })
  

})