document.addEventListener('DOMContentLoaded', function () {

    window.addEventListener("scroll", function () {
        let header = document.querySelector('#header');
        var scroll = window.scrollY;
        if (scrollY > 0) {
            header.style.backgroundColor = '#002b36';
            header.style.transition = '0.5s';

        }
        else {
            header.style.backgroundColor = 'transparent';
            header.style.transition = '0.5s';
        }

    })
})