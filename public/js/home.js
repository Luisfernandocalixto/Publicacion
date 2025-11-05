import { Pagination } from "/js/functions/pagination.js";
import { isPublications } from "/js/templates/notes.js";

document.addEventListener('DOMContentLoaded', async function () {
    const contentGeneralPublications = document.querySelector('.contentGeneralPublications');
    const pagination = document.querySelector(".pagination");

    try {
        const response = await fetch("/notes/publication/all", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const { publications, totalPages } = await response.json();
        contentGeneralPublications.innerHTML = isPublications({ data: publications });
        pagination.innerHTML = Pagination({ totalPages: totalPages });
    } catch (error) {
        
        Swal.fire({ icon: "error", title: "Oops...", text: "Error al cargar publicaciones", confirmButtonColor: "#024751" });
    }

    document.addEventListener('mouseout', function (event) {
        const buttonPage = event.target.closest('.is-button-page');
        // no focus is button
        if (!buttonPage) window.history.replaceState(null, null, window.location.pathname);
    });

    document.addEventListener('click', async function (event) {
        const buttonPage = event.target.closest('.is-button-page');
        if (buttonPage) {
            if (buttonPage.dataset.href) {
                try {
                    window.history.replaceState(null, null, `${buttonPage.dataset.href}`);
                    const response = await fetch(`/notes/publication/all${buttonPage.dataset.href}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    const { publications, totalPages } = await response.json();
                    contentGeneralPublications.innerHTML = isPublications({ data: publications });
                    pagination.innerHTML = Pagination({ totalPages: totalPages });
                } catch (error) {
                    Swal.fire({ icon: "error", title: "Oops...", text: "Error al cargar publicaciones", confirmButtonColor: "#024751" });
                } finally {
                    buttonPage.dataset.href = undefined
                }
            }
        }
    });


}); 