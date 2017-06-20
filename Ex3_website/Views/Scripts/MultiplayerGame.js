jQuery(function ($) {

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
    var playerColor = "#FF0000";
    var emptyColor = "#FFFFFF";
    var context = undefined;

    var commandsHub = $.connection.commandsHub;

    //Handle received command from hub.
    commandsHub.client.gotCommand = function (command) {

        var opponentIPos;
        var opponentJPos;

        opponentIPos = parseInt(command.split(",")[0]);
        opponentJPos = parseInt(command.split(",")[1]);

        var myCanvas = document.getElementById("opponentCanvas");
        context = myCanvas.getContext("2d");

        // Clear previous place.
        context.fillStyle = emptyColor;
        context.fillRect(cellWidth * opponentPlayerJPosition, cellHeight * opponentPlayerIPosition,
                        cellWidth, cellHeight);

        // Color new opponent position.
        context.fillStyle = playerColor;
        context.fillRect(cellWidth * opponentJPos, cellHeight * opponentIPos,
                        cellWidth, cellHeight);

        opponentPlayerIPosition = opponentIPos;
        opponentPlayerJPosition = opponentJPos;

        if (opponentIPos == goalPosRow && opponentJPos == goalPosCol) {
            alert("Opponent won!");
        }
    };

    // The maze from the server
    commandsHub.client.gotMaze = function (jsonMaze) {

        maze = jsonMaze.Maze;
        rows = parseInt(jsonMaze.Rows);
        cols = parseInt(jsonMaze.Cols);
        initPosRow = parseInt(jsonMaze.InitialPos.Row);
        initPosCol = parseInt(jsonMaze.InitialPos.Col);
        goalPosRow = parseInt(jsonMaze.GoalPos.Row);
        goalPosCol = parseInt(jsonMaze.GoalPos.Col);
        mazeName = jsonMaze.Username;

        // Function draws maze on canvas.
        function drawMaze(canvasId) {
            var myCanvas = document.getElementById(canvasId);
            context = myCanvas.getContext("2d");
            cellWidth = myCanvas.width / cols;
            cellHeight = myCanvas.height / rows;

            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < cols; j++) {

                    // Color the wall.
                    if (maze.charAt(i * rows + j) == 1) {
                        context.fill = wallColor;
                        context.fillRect(cellWidth * j, cellHeight * i,
                        cellWidth, cellHeight);
                    }
                    else if (initPosRow == i && initPosCol == j) { // Color the players initial position.
                        playerIPosition = parseInt(i);
                        playerJPosition = parseInt(j);
                        opponentPlayerIPosition = parseInt(i);
                        opponentPlayerJPosition = parseInt(j);
                        context.fillStyle = playerColor;
                        context.fillRect(cellWidth * j, cellHeight * i,
                        cellWidth, cellHeight);
                        context.fillStyle = wallColor;
                    }
                    else if (goalPosRow == i && goalPosCol == j) // Color the goal position.
                    {
                        context.fillStyle = "blue";
                        context.fillRect(cellWidth * j, cellHeight * i,
                            cellWidth, cellHeight);
                        context.fillStyle = wallColor;
                    }
                }
            }
        }

        drawMaze("myCanvas");
        drawMaze("opponentCanvas");
    }

    commandsHub.client.gotListOfGames = function (gamesListInJsonFormat) {
        var list = JSON.parse(gamesListInJsonFormat);
        $("#lstMessages").append("<li><strong>" + list[0] + "</li>");
    }

    $.connection.hub.start().done(function() {

        $("#startButton").click( function () {
            var gameName = $("#gameName").val();
            var rows = $("#rows").val();
            var cols = $("#columns").val();
            commandsHub.server.startGame(gameName, rows, cols);
        });

        $("#joinButton").click(function () {
            commandsHub.server.joinGame("a");
        });

        //Add new connection.
        $("#btnConnect").click(function() {
            var gameName = $("#gameTxt").val();
            commandsHub.server.connect(gameName);
        });

        //Send command to opponent.
        $("body").on("keydown",
            function (e) {
                if (maze && (e.which == right || e.which == left || e.which == up || e.which == down)) {
                    var pressedKey = e.which;
                    var myCanvas = document.getElementById("myCanvas");
                    context = myCanvas.getContext("2d");
                    switch (pressedKey) {
                        case right:
                            // If the right block is not a wall.
                            if ((maze.charAt(parseInt(playerIPosition) * rows + parseInt(playerJPosition) + 1) != 1) &&
                                (parseInt(playerJPosition) + 1 < cols)) {

                                // Color the previous position cell.
                                context.fillStyle = emptyColor;
                                context.fillRect(cellWidth * playerJPosition,
                                    cellHeight * playerIPosition, cellWidth, cellHeight);

                                // Update player coordinate.
                                playerJPosition += 1;

                                // Color the new location of player.
                                context.fillStyle = playerColor;
                                context.fillRect(cellWidth * playerJPosition,
                                    cellHeight * playerIPosition, cellWidth, cellHeight);
                            }
                            break;

                        case left:

                            // If the left block is not a wall.
                            if ((maze.charAt(parseInt(playerIPosition) * rows + parseInt(playerJPosition) - 1) != 1) &&
                                (parseInt(playerJPosition) - 1 >= 0)) {

                                // Color the previous position cell.
                                context.fillStyle = emptyColor;
                                context.fillRect(cellWidth * playerJPosition,
                                    cellHeight * playerIPosition, cellWidth, cellHeight);

                                // Update player coordinate.
                                playerJPosition -= 1;

                                // Color the new location of player.
                                context.fillStyle = playerColor;
                                context.fillRect(cellWidth * playerJPosition,
                                    cellHeight * playerIPosition, cellWidth, cellHeight);
                            }
                            break;

                        case up:

                            // If the upper block is not a wall.
                            if ((maze.charAt((parseInt(playerIPosition) - 1) * rows + parseInt(playerJPosition)) != 1) &&
                                (parseInt(playerIPosition) - 1 >= 0)) {

                                // Color the previous position cell.
                                context.fillStyle = emptyColor;
                                context.fillRect(cellWidth * parseInt(playerJPosition),
                                    cellHeight * playerIPosition, cellWidth, cellHeight);

                                // Update player coordinate.
                                playerIPosition -= 1;

                                // Color the new location of player.
                                context.fillStyle = playerColor;
                                context.fillRect(cellWidth * parseInt(playerJPosition),
                                    cellHeight * playerIPosition, cellWidth, cellHeight);
                            }
                            break;

                        case down:
                            // If the downer block is not a wall.
                            if ((maze.charAt((parseInt(playerIPosition) + 1) * rows + parseInt(playerJPosition)) != 1)
                                && (parseInt(playerIPosition) + 1 < rows)) {

                                // Color the previous position cell.
                                context.fillStyle = emptyColor;
                                context.fillRect(cellWidth * parseInt(playerJPosition),
                                    cellHeight * playerIPosition, cellWidth, cellHeight);

                                // Update player coordinate.
                                playerIPosition += 1;

                                // Color the new location of player.
                                context.fillStyle = playerColor;
                                context.fillRect(cellWidth * parseInt(playerJPosition),
                                    cellHeight * playerIPosition, cellWidth, cellHeight);
                            }
                            break;
                    }

                    // If player reached goal position.
                    if (parseInt(playerIPosition) == goalPosRow && parseInt(playerJPosition) == goalPosCol) {
                        alert("You won!");
                    }

                    // Update opponent with position.
                    commandsHub.server.sendCommand(mazeName, parseInt(playerIPosition) + "," + parseInt(playerJPosition));
                }
        });

        $("#join").click(function() {
            var gameName = $("#gameTxt").val();
            commandsHub.server.joinGame(gameName);
        });

        $("#list").click(function() {
            commandsHub.server.getListOfGames();
        });

        $("#close").click(function() {
            commandsHub.server.close();
        });
    });
});
