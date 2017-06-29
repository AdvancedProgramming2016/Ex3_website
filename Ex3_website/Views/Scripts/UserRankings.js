$(function() {

    //TODO document all the js and html files.

    //Load navbar.
    $("#rankingsNav").load("Navbar.html",
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
                    function() {
                        sessionStorage.removeItem("username");
                        window.location.replace("Homepage.html");
                    });
            }
        });

    //TODO add spinner if needed

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

                    var calcA = a.GamesWon - b.GamesLost;
                    var calcB = b.GamesWon - b.GamesLost;

                    if (calcA < calcB) {
                        return 1;
                    }

                    if (calcA > calcB) {
                        return -1;
                    }

                    return 0;
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