jQuery(function($) {

    //Load navbar.
    $("#registerNav").load("Navbar.html",
        function() {

            var username = sessionStorage.getItem("username");

            $("#logoutTab").hide();

            //Check if user is logged in.
            if (username != null) {

                $("#register").text(username);
                $("#register").attr("href", "#");
                $("#multiLink").attr("href", "MultiplayerMenu.html");
                $("#login").text("Log out");
                $("#loginTab").hide();
                $("#logoutTab").show();
                $("#logout").on('click',
                    function() {
                        sessionStorage.removeItem("username");
                        window.location.replace("Homepage.html");
                    });
            }
        });

    $("#registerError").hide();

    //Submit function.
    $("#submitButton").on('click',
        function() {

            $("#registerError").hide();
           
            //Validate input before submit.
            if ($("#username").val() == "") {

                $("#registerError").show().text("Username can't be empty");
            } else if ($("#password").val() == "") {

                $("#registerError").show().text("Password can't be empty");
            } else if ($("#password").val() != $("#confirmPassword").val()) {

                $("#registerError").show().text("Passwords must match");
            } else if ($("#email").val() == "") {

                $("#registerError").show().text("Email can't be empty");
            } else if (!isEmail($("#email").val())) {

                $("#registerError").show().text("Invalid email");
            } else {

                $("#submitButton").prop('disabled', true);

                var newUsername = $("#username").val();

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
                    success: function(response) {

                        sessionStorage.setItem("username", newUsername);
                        window.location.replace("Homepage.html");
                    },

                    error: function (xhr, textStatus, errorThrown) {

                        $("#submitButton").prop('disabled', false);

                        if (xhr.status == 400) {

                            $("#registerError").show().text("Username already exists");
                        } else {

                            alert("Error: connection lost.");
                        }
                    }
                });
            }
        });

    //Validates email.
    function isEmail(email) {

        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test(email);
    }
});