$(function() {

    /**
     * Load the navbar.
     */
    $("#rankingsNav").load("Navbar.html",
        function() {

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
                    function() {
                        sessionStorage.removeItem("username");
                        window.location.replace("Homepage.html");
                    });
            }
        });

    //Requests the users list from the server.
    $.ajax({
        type: 'GET',
        url: '../../api/Users',

        //In case of success.
        success: function(response) {

            if (response != null) {

                var usersList = [];
                for (var i = 0; i < response.length; i++) {
                    usersList.push(response[i]);
                }

                //Sort the users.
                usersList.sort(function(a, b) {

                    return (a.GamesWon - a.GamesLost) < (b.GamesWon - b.GamesLost) ? 1 : -1;
                });

                //Display the users.
                for (var i = 0; i <= usersList.length; i++) {

                    var user = usersList[i];
                    var rank = (i + 1).toString();
                    var username = user.Username.toString();
                    var gamesWon = user.GamesWon.toString();
                    var gamesLost = user.GamesLost.toString();

                    //Add row with data to the table. 
                    $('#rankingsTable').append('<tr><td>' +
                        rank +
                        '</td><td>' +
                        username +
                        '</td><td>' +
                        gamesWon +
                        '</td><td>' +
                        gamesLost +
                        '</td></tr>');
                }
            }
        },

        //In case of an error.
        error: function(xhr, textStatus, errorThrown) {
            alert("Error: connection lost");
            window.location.replace("Homepage.html");
        }
    });
});