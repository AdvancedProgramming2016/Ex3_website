jQuery(function($) {

    /**
     * Load the navbar.
     */
    $("#multiNav").load("Navbar.html",
        function() {
            var username = sessionStorage.getItem("username");

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

    //Hide elements.
    $("#multiError").hide();

    //Set default rows and columns.
    $("#rows").val(localStorage.getItem("defaultNumOfRows"));
    $("#columns").val(localStorage.getItem("defaultNumOfCols"));

    //Hide elements.
    $("#loader").hide();
    $("#myWinMessage").hide();
    $("#myLoseMessage").hide();
    $("#opponentWinMessage").hide();
    $("#opponentLoseMessage").hide();
    $("#myLabel").hide();
    $("#opponentLabel").hide();
    $("#myCanvas").hide();
    $("#opponentCanvas").hide();

    var mazeName = undefined;
    var maze = undefined;
    var rows = undefined;
    var cols = undefined;
    var initPosRow = undefined;
    var initPosCol = undefined;
    var goalPosRow = undefined;
    var goalPosCol = undefined;
    var playerIPosition = undefined;
    var playerJPosition = undefined;
    var opponentPlayerIPosition = undefined;
    var opponentPlayerJPosition = undefined;
    var left = 37;
    var up = 38;
    var right = 39;
    var down = 40;
    var cellWidth = undefined;
    var cellHeight = undefined;
    var wallColor = "#000000";
    var playerColor = document.getElementById("playerLogo");
    var emptyColor = "#FFFFFF";
    var endPic = document.getElementById("endLogo");
    var context = undefined;
    var win = undefined;
    var canMove = true;

    var commandsHub = $.connection.commandsHub;

    /**
     * Handles slow connection.
     */
    $.connection.hub.connectionSlow(function() {
        alert("Error: connection failed.");
        window.location.replace("Homepage.html");
    });

    /**
     * Handles disconnection.
     */
    $.connection.hub.disconnected(function() {
        alert("Error: connection failed.");
        window.location.replace("Homepage.html");
    });

    /**
     * Handles connection error.
     */
    $.connection.hub.error(function(error) {
        alert("Error: connection failed.");
        window.location.replace("Homepage.html");
    });

    /**
     * Handle received command from hub.
     * @param {string} command 
     * @returns {void} 
     */
    commandsHub.client.gotCommand = function(command) {

        var opponentIPos;
        var opponentJPos;

        opponentIPos = parseInt(command.split(",")[0]);
        opponentJPos = parseInt(command.split(",")[1]);

        var myCanvas = document.getElementById("opponentCanvas");
        context = myCanvas.getContext("2d");

        // Clear previous place.
        context.fillStyle = emptyColor;
        context.fillRect(cellWidth * opponentPlayerJPosition,
            cellHeight * opponentPlayerIPosition,
            cellWidth,
            cellHeight);

        // Color new opponent position.
        context.drawImage(playerColor,
            cellWidth * opponentJPos,
            cellHeight * opponentIPos,
            cellWidth,
            cellHeight);

        opponentPlayerIPosition = opponentIPos;
        opponentPlayerJPosition = opponentJPos;

        if (opponentIPos == goalPosRow && opponentJPos == goalPosCol) {
            canMove = false;
            win = false;
            $("#myLoseMessage").show().text("You lost")
                .append(' <a href="HomePage.html" class="btn btn-xs btn-danger pull-right">Back to home page</a>');
            $("#opponentWinMessage").show().text("Opponet won");
            updateScore(false);
            //commandsHub.server.close();
        }
    };

    /**
     * Receives error message from server.
     * @param {string} error 
     * @returns {void} 
     */
    commandsHub.client.gotError = function(error) {

        //Maze name already exists.
        if (error == "Maze exists") {

            $("#loader").hide();
            $("#startButton").prop('disabled', false);
            $("#joinButton").prop('disabled', false);
            $("#multiError").show().text("This game already exists");
        }
    }

    // The maze from the server
    commandsHub.client.gotMaze = function(jsonMaze) {

        $("#loader").hide();
        maze = jsonMaze.Maze;
        rows = parseInt(jsonMaze.Rows);
        cols = parseInt(jsonMaze.Cols);
        initPosRow = parseInt(jsonMaze.InitialPos.Row);
        initPosCol = parseInt(jsonMaze.InitialPos.Col);
        goalPosRow = parseInt(jsonMaze.GoalPos.Row);
        goalPosCol = parseInt(jsonMaze.GoalPos.Col);
        mazeName = jsonMaze.Username;

        /**
         * Draws the maze.
         * @param {int} canvasId 
         * @returns {void} 
         */
        function drawMaze(canvasId) {
            var myCanvas = document.getElementById(canvasId);
            context = myCanvas.getContext("2d");
            context.clearRect(0, 0, $(canvasId).width(), $(canvasId).height());

            cellWidth = myCanvas.width / cols;
            cellHeight = myCanvas.height / rows;

            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < cols; j++) {

                    // Color the wall.
                    if (maze.charAt(i * cols + j) == 1) {
                        context.fill = wallColor;
                        context.fillRect(cellWidth * j,
                            cellHeight * i,
                            cellWidth,
                            cellHeight);
                    } else if (initPosRow == i && initPosCol == j) { // Color the players initial position.
                        playerIPosition = parseInt(i);
                        playerJPosition = parseInt(j);
                        opponentPlayerIPosition = parseInt(i);
                        opponentPlayerJPosition = parseInt(j);
                        context.drawImage(playerColor,
                            cellWidth * j,
                            cellHeight * i,
                            cellWidth,
                            cellHeight);
                    } else if (goalPosRow == i && goalPosCol == j) // Color the goal position.
                    {
                        context.drawImage(endPic,
                            cellWidth * j,
                            cellHeight * i,
                            cellWidth,
                            cellHeight);
                    }
                }
            }
        }

        drawMaze("myCanvas");
        drawMaze("opponentCanvas");

        $("#myLabel").show();
        $("#opponentLabel").show();
        $("#myCanvas").show();
        $("#opponentCanvas").show();
        document.title = jsonMaze.Username;
    }

    /**
     * Receives list of games from server.
     * @param {list} gamesListInJsonFormat 
     * @returns {void} 
     */
    commandsHub.client.gotListOfGames = function(gamesListInJsonFormat) {
        var list = JSON.parse(gamesListInJsonFormat);

        // Empty the list before appending to it.
        $("#gamesList").empty();

        // Add the game to the drop down menu.
        list.forEach(function(gameName) {
            $("#gamesList").append(new Option(gameName, gameName));
        });
    }

    $.connection.hub.start().done(function() {

        $("#startButton").click(function() {

            $("#multiError").hide();

            var gameName = $("#gameName").val();
            var rows = $("#rows").val();
            var cols = $("#columns").val();

            if (gameName == "") {

                $("#multiError").show().text("Game name can't be empty");
            } else if (rows == "") {

                $("#multiError").show().text("Rows can't be empty");
            } else if (cols == "") {

                $("#multiError").show().text("Columns can't be empty");
            } else {

                commandsHub.server.startGame(gameName, rows, cols);

                $("#loader").show();
                $("#startButton").prop('disabled', true);
                $("#joinButton").prop('disabled', true);
            }
        });

        /**
         * Handle received command from hub.
         */
        $("#joinButton").click(function() {

            $("#multiError").hide();

            //Validate option was selected.
            if ($("#gamesList").val() === null) {

                $("#multiError").show().text("You have to choose a game");
            } else {

                $("#startButton").prop('disabled', true);
                $("#joinButton").prop('disabled', true);

                //Send join command to server.
                commandsHub.server.joinGame($("#gamesList").val());
            }

        });

        /**
         * Closes the game.
         * @param {string} mazeName 
         * @returns {void} 
         */
        function closeGame(mazeName) {

            commandsHub.server.close(mazeName);
        }

        /**
         * Handle received command from hub.
         */
        $("body").on("keydown",
            function(e) {
                if (canMove) {
                    if (maze && (e.which == right || e.which == left || e.which == up || e.which == down)) {
                        var pressedKey = e.which;
                        var myCanvas = document.getElementById("myCanvas");
                        context = myCanvas.getContext("2d");
                        switch (pressedKey) {
                        case right:
                            // If the right block is not a wall.
                            if ((maze.charAt(parseInt(playerIPosition) * cols + parseInt(playerJPosition) + 1) != 1) &&
                                (parseInt(playerJPosition) + 1 < cols)) {

                                // Color the previous position cell.
                                if (win) {
                                    context.fillStyle = emptyColor;
                                    context.fillRect(cellWidth * playerJPosition,
                                        cellHeight * playerIPosition,
                                        cellWidth,
                                        cellHeight);

                                    context.drawImage(endPic,
                                        cellWidth * playerJPosition,
                                        cellHeight * playerIPosition,
                                        cellWidth,
                                        cellHeight);
                                    win = false;
                                } else {
                                    context.fillStyle = emptyColor;
                                    context.fillRect(cellWidth * playerJPosition,
                                        cellHeight * playerIPosition,
                                        cellWidth,
                                        cellHeight);
                                }


                                // Update player coordinate.
                                playerJPosition += 1;

                                // Color the new location of player.
                                context.drawImage(playerColor,
                                    cellWidth * playerJPosition,
                                    cellHeight * playerIPosition,
                                    cellWidth,
                                    cellHeight);
                            }
                            break;

                        case left:

                            // If the left block is not a wall.
                            if ((maze.charAt(parseInt(playerIPosition) * cols + parseInt(playerJPosition) - 1) != 1) &&
                                (parseInt(playerJPosition) - 1 >= 0)) {

                                // Color the previous position cell.
                                if (win) {
                                    context.fillStyle = emptyColor;
                                    context.fillRect(cellWidth * playerJPosition,
                                        cellHeight * playerIPosition,
                                        cellWidth,
                                        cellHeight);
                                    context.drawImage(endPic,
                                        cellWidth * playerJPosition,
                                        cellHeight * playerIPosition,
                                        cellWidth,
                                        cellHeight);
                                    win = false;
                                } else {
                                    context.fillStyle = emptyColor;
                                    context.fillRect(cellWidth * playerJPosition,
                                        cellHeight * playerIPosition,
                                        cellWidth,
                                        cellHeight);
                                }

                                // Update player coordinate.
                                playerJPosition -= 1;

                                // Color the new location of player.
                                context.drawImage(playerColor,
                                    cellWidth * playerJPosition,
                                    cellHeight * playerIPosition,
                                    cellWidth,
                                    cellHeight);
                            }
                            break;

                        case up:

                            // If the upper block is not a wall.
                            if ((maze.charAt((parseInt(playerIPosition) - 1) * cols +
                                        parseInt(playerJPosition)) !=
                                    1) &&
                                (parseInt(playerIPosition) - 1 >= 0)) {

                                // Color the previous position cell.
                                if (win) {
                                    context.fillStyle = emptyColor;
                                    context.fillRect(cellWidth * playerJPosition,
                                        cellHeight * playerIPosition,
                                        cellWidth,
                                        cellHeight);

                                    context.drawImage(endPic,
                                        cellWidth * parseInt(playerJPosition),
                                        cellHeight * playerIPosition,
                                        cellWidth,
                                        cellHeight);
                                    win = false;
                                } else {
                                    context.fillStyle = emptyColor;
                                    context.fillRect(cellWidth * parseInt(playerJPosition),
                                        cellHeight * playerIPosition,
                                        cellWidth,
                                        cellHeight);
                                }

                                // Update player coordinate.
                                playerIPosition -= 1;

                                // Color the new location of player.
                                context.drawImage(playerColor,
                                    cellWidth * parseInt(playerJPosition),
                                    cellHeight * playerIPosition,
                                    cellWidth,
                                    cellHeight);
                            }
                            break;

                        case down:
                            // If the downer block is not a wall.
                            if ((maze.charAt((parseInt(playerIPosition) + 1) * cols +
                                        parseInt(playerJPosition)) !=
                                    1) &&
                                (parseInt(playerIPosition) + 1 < rows)) {

                                // Color the previous position cell.
                                if (win) {
                                    context.fillStyle = emptyColor;
                                    context.fillRect(cellWidth * playerJPosition,
                                        cellHeight * playerIPosition,
                                        cellWidth,
                                        cellHeight);

                                    context.drawImage(endPic,
                                        cellWidth * parseInt(playerJPosition),
                                        cellHeight * playerIPosition,
                                        cellWidth,
                                        cellHeight);
                                    win = false;
                                } else {
                                    context.fillStyle = emptyColor;
                                    context.fillRect(cellWidth * parseInt(playerJPosition),
                                        cellHeight * playerIPosition,
                                        cellWidth,
                                        cellHeight);
                                }

                                // Update player coordinate.
                                playerIPosition += 1;

                                // Color the new location of player.
                                context.drawImage(playerColor,
                                    cellWidth * parseInt(playerJPosition),
                                    cellHeight * playerIPosition,
                                    cellWidth,
                                    cellHeight);
                            }
                            break;
                        }

                        // Update opponent with position.
                        commandsHub.server.sendCommand(mazeName,
                            parseInt(playerIPosition) + "," + parseInt(playerJPosition));

                        // If player reached goal position.
                        if (playerIPosition == goalPosRow && playerJPosition == goalPosCol) {
                            win = true;
                            canMove = false;
                            $("#myWinMessage").show().text("You won!").append(
                                ' <a href="HomePage.html" class="btn btn-xs btn-success pull-right">Back to home page</a>');
                            $("#opponentLoseMessage").show().text("Opponent lost");
                            updateScore(true);
                            closeGame(mazeName);


                        }
                    }
                }

            });

        /**
         * Sends games list request to server.
         */
        $("#gamesList").click(function() {
            commandsHub.server.getListOfGames();
        });

    });

    /**
     * Updates users game score.
     * @param {bool} isWon 
     * @returns {void} 
     */
    function updateScore(isWon) {

        var user = sessionStorage.getItem("username");

        $.ajax({
            type: 'GET',
            url: '../../api/Users',
            data: {
                username: user,
                isWon: isWon
            },

            success: function(response) {

            },

            error: function(xhr, textStatus, errorThrown) {

                alert("Error: connection failed.");
            }
        });
    }
});