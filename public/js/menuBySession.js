let buttonSid = document.getElementById("buttonSid");

document.addEventListener('DOMContentLoaded', function () {

  buttonSid.addEventListener("click", function () {
    Swal.fire({
      title: 'Menu 👋',
      html: `
    <article class="static-top">
    <a href="/" class="decoration-none margin-pointer">
    <div id="" >Inicio</div>
    </a>
    <br>
    <a href="/notes" class="decoration-none margin-pointer">
    <div id="" >Publicaciones</div>
</a>
<br>
<a href="/users/logout" class="decoration-none margin-pointer">
<div id="buttonSessionClose" >Cerrar sesión</div>
</a>
</article>
`
      ,
      position: 'top-right',
      showClass: {
        popup: `
      animate__animated
      animate__fadeInRight
  animate__faster
`,
      },
      hideClass: {
        popup: `
  animate__animated
  animate__fadeOutRight
  animate__faster
  `,
      },
      grow: 'column',
      width: 300,
      showConfirmButton: false,
      showCloseButton: true,
      background: '#0c5b6d',
      color: '#fff',
    })

  })


})