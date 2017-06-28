﻿jQuery(function($) {

    //Load navbar.
    $("#homePageNav").load("Navbar.html",
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

            //Change welcome message.
            if (username != null) {

                $("#paragraph").text("You can now play multiplayer games.");
            }
        });

    var defaultNumOfRows = localStorage.getItem("defaultNumOfRows");

    if (!defaultNumOfRows) {

        // Set the default values.
        localStorage.setItem("defaultNumOfRows", "15");
        localStorage.setItem("defaultNumOfCols", "15");
        localStorage.setItem("defaultAlgo", "Dfs");
    }
});