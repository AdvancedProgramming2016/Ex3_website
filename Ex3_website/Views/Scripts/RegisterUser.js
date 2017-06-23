jQuery(function ($) {

    //Load navbar.
    $("#navBar").load("Navbar.html");

    $("#submitButton").on('click', function () {

        if ($("#password").val() != $("#confirmPassword").val()) {
            alert("password and confirmation not identical");
        }
        else {

            $.ajax({
                type: 'POST',
                url: '../../api/Users',
                data: {
                    Username: $("#username").val(),
                    Password: $("#password").val(),
                    Email: $("#email").val(),
                    GamesWon: 0,
                    GamesLost: 0
                },
                success: function (response) {
                    alert("user added");
                },

                error: function (xhr, textStatus, errorThrown) {
                    alert("Error: connection lost");
                }
            });
        }
    });
});