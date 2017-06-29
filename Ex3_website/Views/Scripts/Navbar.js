$(function() {

   
    var username = sessionStorage.getItem("username");
   
    //Check if user logged in.
    if (username != null) {
       
        $("#register").text(username);
        $("#register").attr("href", "#");
        $("#login").text("Log out");
        $("#login").attr("href", "HomePage.html");
    }

    /**
     * Login button click.
     */
    $("#login").click(function() {

        // The user is logged in and wants to log off.
        if (sessionStorage.getItem("username") != null) {

            // Clear all session storages.
            sessionStorage.clear();
        }
    });
});