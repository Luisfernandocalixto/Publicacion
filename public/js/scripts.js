
$('#btn-like').click(function (e) {
    e.preventDefault();
    let element = $(this).data('id');

    $.post('/notes/' + element + '/like')
        .done(data => {
            $('.likes-count').text(data.likes)
        })
})