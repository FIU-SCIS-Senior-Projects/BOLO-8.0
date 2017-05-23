$(function () {
    // Initialize form validation on the registration form.
    // It has the name attribute "registration"
    $("form[name='createBoloForm'], form[name='editBoloForm']").validate({
        // Specify validation rules
        rules: {
            // The key name on the left side is the name attribute
            // of an input field. Validation rules are defined
            // on the right side
            dateReported: {
                required: true,
                dateITA : true
            },
            timeReported: {
                required: true,
                time: true
            },
            videoURL: {
                url: true
            }
        },
        // Specify validation error messages
        messages: {
            dateReported: {
                required: 'Please enter a date',
                dateITA: 'Please enter a valid date (MM/DD/YYYY)'
            },
            timeReported: {
                required: 'Please enter a time'
            },
            videoURL: {
                url: 'Please enter a valid URL (http://www.abc.com)'
            }
        },
        // Make sure the form is submitted to the destination defined
        // in the "action" attribute of the form when valid
        submitHandler: function (form) {
            form.submit();
        }
    });

});