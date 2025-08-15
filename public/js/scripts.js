
$('#btn-like').click(function (e) {
    e.preventDefault();
    let element = $(this).data('id');

    $.post('/notes/like/' + element)
        .done(data => {
            $('.likes-count').text(data.likes)
        })
})