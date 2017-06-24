jQuery(function ($) {

    var username = sessionStorage.getItem("username");

    if (username != null) {
        $("#register").innerHTML = username;
        $("#register").href = "";
        $("#login").innerHTML = "Log off";
        $("#login").href = "Login.html";
    }

    $("#login").click(function () {

        // The user is logged in and wants to log off.
        if (sessionStorage.getItem("username") != null) {

            // Clear all session storages.
            sessionStorage.clear();
        }
    });
});