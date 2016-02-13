$('#addReview').submit(function (e) {
    console.log("form submit");
    $('.alert.alert-danger').hide();
    if (!$('input#name').val() || !$('select#rating').val() || !$('textarea#review').val()) {
        console.log("inside error");
        if ($('.alert.alert-danger').length) {
            $('.alert.alert-danger').show();
        } else {
            console.log("error");
            $(this).prepend('<div role="alert" class="alert alert-danger">All fields required, please try again</div>');
        }
        return false;
    }
});

