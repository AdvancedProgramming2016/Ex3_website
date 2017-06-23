$(function () {

    //Load navbar.
    $("#loginNav").load("Navbar.html");

    $("#loginButton").on('click',
        function () {

            var username = $("#username").val();
            var password = $("#password").val();

            $.ajax({
                type: 'GET',
                url: '../../api/Users',
                data: {
                    Username: username,
                    Password: password
                },

                success: function (response) {

                    sessionStorage.setItem("username", username);
                    // Update the navbar.
                    
                    //alert(sessionStorage.getItem("username"));
                },

                error: function (xhr, textStatus, errorThrown) {
                    //alert("Error: connection lost");
                    if (xhr.status == 404) {
                        alert("Error: wrong username or password.");
                    } else {
                        alert("Error: connection failed.");
                    }

                }
            });
        });
});