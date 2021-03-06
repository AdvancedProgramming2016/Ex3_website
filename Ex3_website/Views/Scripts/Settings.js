﻿jQuery(function ($) {

    /**
     * Loads the navbar.
     */
    $("#settingsNav").load("Navbar.html",
        function () {

            var username = sessionStorage.getItem("username");

            //Hide element.
            $("#logoutTab").hide();

            //Check if user is logged in.
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

    //Hide elements.
    $("#settingsError").hide();
    $("#settingsSuccess").hide();

    // Place the default values in html page.
    document.getElementById("defaultNumOfRows").value = localStorage.getItem("defaultNumOfRows");
    document.getElementById("defaultNumOfCols").value = localStorage.getItem("defaultNumOfCols");
    document.getElementById("defaultAlgo").value = localStorage.getItem("defaultAlgo");

    /**
     * Set new default values click.
     */ 
    $("#updateSettingsButton").on('click', function () {

        //Hide elements.
        $("#settingsError").hide();
        $("#settingsSuccess").hide();

        //Check that values are not empty.
        if ($("#defaultNumOfRows").val() == "") {

            $("#settingsError").show().text("rows can't be empty");
        }
        else if ($("#defaultNumOfCols").val() == "") {

            $("#settingsError").show().text("columns can't be empty");
        } else {
            localStorage.setItem("defaultNumOfRows", $("#defaultNumOfRows").val());
            localStorage.setItem("defaultNumOfCols", $("#defaultNumOfCols").val());
            localStorage.setItem("defaultAlgo", $("#defaultAlgo").val());
            $("#settingsSuccess").show().text("Settings were updated");
        }

     
    });
});