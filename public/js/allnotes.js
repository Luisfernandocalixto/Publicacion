import { checkFormByComment } from "/js/app.js";
import { IsData } from "/js/notes/class/data.js";
import { isMyPublications, isPublications } from "/js/templates/notes.js";
import { Pagination } from "/js/functions/pagination.js";
import { Pagination as PaginationGeneral } from "/js/functions/paginationGeneral.js";

document.addEventListener('DOMContentLoaded', async function () {
    //select elements of DOM => <form>
    const form = document.querySelector('form');
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    const inputTitle = form.querySelector('input[name="title"]');
    const inputDescription = form.querySelector('textarea[name="description"]');
    const contentMyPublications = document.querySelector('.contentMyPublications');
    const contentGeneralPublications = document.querySelector('.contentGeneralPublications');
    const pagination = document.querySelector(".pagination");
    const paginationGeneral = document.querySelector(".paginationGeneral");

    form.addEventListener('change', function (e) {
        e.preventDefault();
        checkFormByComment(inputTitle, inputDescription, button);
    });

    try {
        const response = await fetch("/notes/publication", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const { myPublications, totalPages } = await response.json();
        IsData.getData = myPublications;
        IsData.getPages = totalPages;
        contentMyPublications.innerHTML = isMyPublications({ data: IsData.getData });
        pagination.innerHTML = Pagination({ totalPages: IsData.getPages });

    } catch (error) {
    }

    try {
        const response = await fetch("/notes/publication/all", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const { publications, totalPages } = await response.json();
        contentGeneralPublications.innerHTML = isPublications({ data: publications });
        paginationGeneral.innerHTML = PaginationGeneral({ totalPages: totalPages });
    } catch (error) {
        Swal.fire({ icon: "error", title: "Oops...", text: "Error al cargar publicaciones", confirmButtonColor: "#024751" });
    }

    document.addEventListener('mouseout', function (event) {
        const buttonPage = event.target.closest('.is-button-page');
        const buttonPageGeneral = event.target.closest('.is-button-page-general');
        // no focus is button
        if (!buttonPage) window.history.replaceState(null, null, window.location.pathname);
        if (!buttonPageGeneral) window.history.replaceState(null, null, window.location.pathname);
    });


    document.addEventListener('click', async function (event) {
        const buttonPage = event.target.closest('.is-button-page');
        const buttonPageGeneral = event.target.closest('.is-button-page-general');
        if (buttonPageGeneral) {
            if (buttonPageGeneral.dataset.href) {
                try {
                    window.history.replaceState(null, null, `${buttonPageGeneral.dataset.href}`);
                    const response = await fetch(`/notes/publication/all${buttonPageGeneral.dataset.href}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    const { publications, totalPages } = await response.json();
                    contentGeneralPublications.innerHTML = isPublications({ data: publications });
                    paginationGeneral.innerHTML = PaginationGeneral({ totalPages: totalPages });
                } catch (error) {
                    Swal.fire({ icon: "error", title: "Oops...", text: "Error al cargar publicaciones", confirmButtonColor: "#024751" });
                } finally {
                    buttonPageGeneral.dataset.href = undefined
                }



            }
        }


        if (buttonPage) {
            if (buttonPage.dataset.href) {
                try {
                    const response = await fetch(`/notes/publication${buttonPage.dataset.href}`, {
                        method: "GET",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                    const { myPublications, totalPages } = await response.json();

                    IsData.getData = myPublications;
                    IsData.getPages = totalPages;
                    window.history.replaceState(null, null, `${buttonPage.dataset.href}`);

                } catch (error) {
                    Swal.fire({ icon: "error", title: "Oops...", text: "Error al cargar publicaciones", confirmButtonColor: "#024751" });
                } finally {
                    buttonPage.dataset.href = undefined;

                }

                // query of data  for paging
                contentMyPublications.innerHTML = isMyPublications({ data: IsData.getData });
                pagination.innerHTML = Pagination({ totalPages: IsData.getPages });

            }

        }
    });
});
