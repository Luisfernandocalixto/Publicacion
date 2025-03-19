let buttonSid = document.getElementById("buttonSid");
buttonSid.addEventListener("click", async function () {
  await Swal.fire({
    title: 'Menu 👋',
    html: `
<article style="top:0px; position:static;">
{{#if userAuthenticated}}
 <a href="/" style="text-decoration: none; color: #989898;">
  <div id="" style="margin: 2px; cursor: pointer;">Inicio</div>
</a>
<br>
 <a href="/notes" style="text-decoration: none; color: #989898;">
  <div id="" style="margin: 2px; cursor: pointer;">Publicaciones</div>
</a>
<br>
<a href="/users/logout" style="text-decoration: none; color: #989898;">
  <div id="buttonSessionClose" style="margin: 2px; cursor: pointer;">Cerrar sesión</div>
</a>

<br>
{{else}}
<a href="/users/signin" style="text-decoration: none; color: #989898;">
  <div id="buttonSession" style="margin: 2px; cursor: pointer;">Iniciar sesión</div>
</a>
<br>
<a href="/users/signup" style="text-decoration: none; color: #989898;">
  <div id="buttonAccount" style="margin-right: 8px; cursor: pointer;"> Cuenta</div>
</a>
{{/if}}
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

