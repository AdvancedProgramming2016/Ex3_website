jQuery(function ($) {

    $("#submit").on('click', function () {

        if ($("#password").val() != $("#confirmPassword").val()) {
            alert("password and confirmation not identical");
        }
        else {
            $ajax({
                type: 'POST',
                url: '../../api/Users',
                data: {
                    Username: $("username").val(),
                    Password: $("password").val(),
                    Email: $("email").val(),
                    GamesWon: '0',
                    GamesLost: '0'
                },
                dataType: 'json',
                success: function (response) {
                    alert("User added successfully");
                },
                error: function(xhr, textStatus, errorThrown) {
                    alert("Error registering");
                }
            });
        }
    });

});