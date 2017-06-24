$(function() {

    //Load navbar.
    $("#loginNav").load("Navbar.html",
        function() {

            var username = sessionStorage.getItem("username");

            $("#logoutTab").hide();

            if (username != null) {

                $("#register").text(username);
                $("#register").attr("href", "#");
                $("#login").text("Log out");
                $("#loginTab").hide();
                $("#logoutTab").show();
                $("#logout").on('click',
                    function () {
                        sessionStorage.removeItem("username");
                        window.location.replace("Homepage.html");
                    });
            }
        });
    
    $("#loginError").hide();

    $("#loginButton").on('click',
        function() {

            $("#loginError").hide();

            var username = $("#username").val();
            var password = $("#password").val();

            //Validate input before sending request.
            if (username == "") {

                $("#loginError").show().text("Username can't be empty");
            } else if (password == "") {

                $("#loginError").show().text("Password can't be empty");
            } else {

                $.ajax({
                    type: 'GET',
                    url: '../../api/Users',
                    data: {
                        Username: username,
                        Password: password
                    },

                    success: function(response) {

                        sessionStorage.setItem("username", username);
                        // Update the navbar.

                        //alert(sessionStorage.getItem("username"));

                        window.location.replace("Homepage.html");
                    },

                    error: function(xhr, textStatus, errorThrown) {
                        //alert("Error: connection lost");
                        if (xhr.status == 404) {
                            $("#loginError").show().text("Wrong username or password.");

                        } else {
                            alert("Error: connection failed.");
                        }

                    }
                });
            }


        });
});