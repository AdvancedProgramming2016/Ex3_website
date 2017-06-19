$(function() {

    $.ajax({
        type: 'GET',
        url: '../../api/Users',

        success: function(response) {

            if (response != null) {

               var usersList = [];
                for (var i = 0; i < response.length; i++) {
                    usersList.push(response[i]);
                }

                //Sort the users.
                usersList.sort(function(a, b) {
                    return a.GamesWon - b.GamesLost;
                });

                //Display the users.
                for (var i = 0; i <= usersList.length; i++) {

                    var user = usersList[i];
                    var rank = (i + 1).toString();
                    var username = user.Username.toString();
                    var gamesWon = user.GamesWon.toString();
                    var gamesLost = user.GamesLost.toString();

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

        error: function(xhr, textStatus, errorThrown) {
            alert("Error: connection lost");
        }
    });
});