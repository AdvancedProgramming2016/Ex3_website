﻿$(function() {

    /**
     * Loads the navbar.
     */
    $("#singleNav").load("Navbar.html",
        function() {
            var username = sessionStorage.getItem("username");
            var list = undefined;
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

    //Hide elements.
    $("#loader").hide();
    $("#singleError").hide();
    $("#mazeCanvas").hide();
    $("#winMessage").hide();
    $("#solveMaze").prop('disabled', true);

    //Get sizes from local storage.
    $("#mazeRows").val(localStorage.getItem("defaultNumOfRows"));
    $("#mazeCols").val(localStorage.getItem("defaultNumOfCols"));
    if (localStorage.getItem("defaultAlgo") == "Bfs") {
        $("#selectedAlgo").append("<option " + "value = " + "2" + ">" + "Bfs" + "</option>");
        $("#selectedAlgo").append("<option " + "value = " + "1" + ">" + "Dfs" + "</option>");
    } else {
        $("#selectedAlgo").append("<option " + "value = " + "1" + ">" + "Dfs" + "</option>");
        $("#selectedAlgo").append("<option " + "value = " + "2" + ">" + "Bfs" + "</option>");
    }

    var name = undefined;
    var maze = undefined;
    var rows = undefined;
    var cols = undefined;
    var initPosRow = undefined;
    var initPosCol = undefined;
    var goalPosRow = undefined;
    var goalPosCol = undefined;
    var playerIPosition;
    var playerJPosition;
    var left = 37;
    var up = 38;
    var right = 39;
    var down = 40;
    var cellWidth;
    var cellHeight;
    var wallColor = "#000000";
    var playerColor = document.getElementById("playerLogo");
    var emptyColor = "#FFFFFF";
    var endPic = document.getElementById("endLogo");
    var context = undefined;
    var isKeyDisabled = false;

    /**
     * On key movement.
     */
    $(function() {
        $("body").on('keydown',
            function(e) {
                if (!isKeyDisabled) {
                    if (maze) {
                        var pressedKey = e.which;
                        var myCanvas = document.getElementById("mazeCanvas");
                        context = mazeCanvas.getContext("2d");
                        switch (pressedKey) {
                        case right:
                            // If the right block is not a wall.
                            if ((maze.charAt(playerIPosition * cols + playerJPosition + 1) != 1) &&
                                (playerJPosition + 1 < cols)) {

                                if (playerIPosition == goalPosRow && playerJPosition == goalPosCol) {
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
                                } else {
                                    // Color the previous position cell.
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

                            // If player reached goal position.
                            if (playerIPosition == goalPosRow && playerJPosition == goalPosCol) {
                                //alert("You won!");
                                $("#winMessage").show().text("You solved the maze");
                            }
                            break;

                        case left:

                            // If the left block is not a wall.
                            if ((maze.charAt(playerIPosition * cols + playerJPosition - 1) != 1) &&
                                (playerJPosition - 1 >= 0)) {

                                if (playerIPosition == goalPosRow && playerJPosition == goalPosCol) {
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
                                } else {
                                    // Color the previous position cell.
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

                            // If player reached goal position.
                            if (playerIPosition == goalPosRow && playerJPosition == goalPosCol) {
                                //alert("You won!");
                                $("#winMessage").show().text("You solved the maze");
                            }
                            break;

                        case up:

                            // If the upper block is not a wall.
                            if ((maze.charAt((playerIPosition - 1) * cols + playerJPosition) != 1) &&
                                (playerIPosition - 1 >= 0)) {

                                if (playerIPosition == goalPosRow && playerJPosition == goalPosCol) {
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
                                } else {
                                    // Color the previous position cell.
                                    context.fillStyle = emptyColor;
                                    context.fillRect(cellWidth * playerJPosition,
                                        cellHeight * playerIPosition,
                                        cellWidth,
                                        cellHeight);
                                }

                                // Update player coordinate.
                                playerIPosition -= 1;

                                // Color the new location of player.
                                context.drawImage(playerColor,
                                    cellWidth * playerJPosition,
                                    cellHeight * playerIPosition,
                                    cellWidth,
                                    cellHeight);
                            }

                            // If player reached goal position.
                            if (playerIPosition == goalPosRow && playerJPosition == goalPosCol) {
                                // alert("You won!");
                                $("#winMessage").show().text("You solved the maze");
                            }
                            break;

                        case down:
                            // If the downer block is not a wall.
                            if ((maze.charAt((playerIPosition + 1) * cols + playerJPosition) != 1) &&
                                (playerIPosition + 1 < rows)) {

                                if (playerIPosition == goalPosRow && playerJPosition == goalPosCol) {
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
                                } else {
                                    // Color the previous position cell.
                                    context.fillStyle = emptyColor;
                                    context.fillRect(cellWidth * playerJPosition,
                                        cellHeight * playerIPosition,
                                        cellWidth,
                                        cellHeight);
                                }

                                // Update player coordinate.
                                playerIPosition += 1;

                                // Color the new location of player.
                                context.drawImage(playerColor,
                                    cellWidth * playerJPosition,
                                    cellHeight * playerIPosition,
                                    cellWidth,
                                    cellHeight);
                            }

                            // If player reached goal position.
                            if (playerIPosition == goalPosRow && playerJPosition == goalPosCol) {
                                //alert("You won!");
                                $("#winMessage").show().text("You solved the maze");
                            }
                            break;
                        }
                    }
                }
            });
    });

    /**
     * Start game click.
     */
    $("#btnStartNewGame").on('click',
        function() {

            $("#singleError").hide();
            $("#winMessage").hide();

            if ($("#mazeName").val() == "") {

                $("#singleError").show().text("Maze name can't be empty");

            } else if ($("#mazeRows").val() == "") {

                $("#singleError").show().text("Rows can't be empty");

            } else if ($("#mazeCols").val() == "") {

                $("#singleError").show().text("Columns can't be empty");

            } else {
                
                //Show loader.
                $("#loader").show();

                //Disable button.
                $("#btnStartNewGame").prop('disabled', true);

                $.ajax({
                    type: 'GET',
                    url: '../../api/SinglePlayer',
                    data: {
                        mazeName: $("#mazeName").val(),
                        rows: $("#mazeRows").val(),
                        columns: $("#mazeCols").val()
                    },
                    dataType: 'json',

                    //In case of success.
                    success: function(response) {

                        $("#loader").hide();
                        var myCanvas = document.getElementById("mazeCanvas");
                        var contexts = mazeCanvas.getContext("2d");
                        contexts.clearRect(0, 0, $("#mazeCanvas").width(), $("#mazeCanvas").height());

                        if (response == null) {

                            $("#singleError").show().text("Maze already exists");
                        } else {

                            $("#mazeCanvas").show();

                            name = response.Username;
                            maze = response.Maze;
                            rows = response.Rows;
                            cols = response.Cols;
                            initPosRow = response.InitialPos.Row;
                            initPosCol = response.InitialPos.Col;
                            goalPosRow = response.GoalPos.Row;
                            goalPosCol = response.GoalPos.Col;

                            document.title = name;

                            var myCanvas = document.getElementById("mazeCanvas");
                            context = mazeCanvas.getContext("2d");
                            cellWidth = mazeCanvas.width / response.Cols;
                            cellHeight = mazeCanvas.height / response.Rows;

                            for (var i = 0; i < response.Rows; i++) {
                                for (var j = 0; j < response.Cols; j++) {

                                    // Color the wall.
                                    if (response.Maze.charAt(i * response.Cols + j) == 1) {
                                        context.fillStyle = wallColor;
                                        context.fillRect(cellWidth * j,
                                            cellHeight * i,
                                            cellWidth,
                                            cellHeight);
                                    } else if (response.InitialPos.Row == i &&
                                        response.InitialPos.Col == j) { // Color the players initial position.
                                        playerIPosition = i;
                                        playerJPosition = j;

                                        context.drawImage(playerColor,
                                            cellWidth * playerJPosition,
                                            cellHeight * playerIPosition,
                                            cellWidth,
                                            cellHeight);
                                    } else if (response.GoalPos.Row == i &&
                                        response.GoalPos.Col == j) // Color the goal position.
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

                        $("#solveMaze").prop('disabled', false);
                        $("#btnStartNewGame").prop('disabled', false);

                    },

                    //In case of an error.
                    error: function(xhr, textStatus, errorThrown) {
                        $("#loader").hide();
                        alert("Error: connection lost");
                    }
                });
            }
        });

    /**
     * Solve button click.
     */
    $("#solveMaze").on('click',
        function() {

            $("#winMessage").hide();

            var algorithmType = $("#selectedAlgo").val() - 1;

            $.ajax({
                type: 'GET',
                url: '../../api/SinglePlayer',
                data: {
                    mazeName: $("#mazeName").val(),
                    algorithmType: algorithmType
                },
                dataType: 'json',

                //In case of success.
                success: function(response) {

                    disableKey(true);
                    context.fillStyle = emptyColor;
                    context.fillRect(cellWidth * goalPosCol,
                        cellHeight * goalPosRow,
                        cellWidth,
                        cellHeight);
                    context.drawImage(endPic,
                        cellWidth * goalPosCol,
                        cellHeight * goalPosRow,
                        cellWidth,
                        cellHeight);
                    $("#btnStartNewGame").prop('disabled', true);
                    $("#solveMaze").prop('disabled', true);
                    var intervalId;
                    var i = 0;
                    var reverseSolution = reverseString(response.Solution);

                    if (playerJPosition == goalPosCol && playerIPosition == goalPosRow) {
                        context.drawImage(endPic,
                            cellWidth * playerJPosition,
                            cellHeight * playerIPosition,
                            cellWidth,
                            cellHeight);
                    } else {
                        // Remove player current rectangle.
                        context.fillStyle = emptyColor;
                        context.fillRect(cellWidth * playerJPosition,
                            cellHeight * playerIPosition,
                            cellWidth,
                            cellHeight);
                    }

                    // Place player in initial rectangle.
                    playerJPosition = initPosCol;
                    playerIPosition = initPosRow;

                    context.drawImage(playerColor,
                        cellWidth * playerJPosition,
                        cellHeight * playerIPosition,
                        cellWidth,
                        cellHeight);

                    intervalId = setInterval(function() {
                            switch (reverseSolution.charAt(i)) {
                            case '1': // Move left.

                                // Color the previous position cell.
                                context.fillStyle = emptyColor;
                                context.fillRect(cellWidth * playerJPosition,
                                    cellHeight * playerIPosition,
                                    cellWidth,
                                    cellHeight);

                                // Update player coordinate.
                                playerJPosition -= 1;

                                // Color the new location of player.
                                context.drawImage(playerColor,
                                    cellWidth * playerJPosition,
                                    cellHeight * playerIPosition,
                                    cellWidth,
                                    cellHeight);
                                break;

                            case '0': // Move right.

                                // Color the previous position cell.
                                context.fillStyle = emptyColor;
                                context.fillRect(cellWidth * playerJPosition,
                                    cellHeight * playerIPosition,
                                    cellWidth,
                                    cellHeight);

                                // Update player coordinate.
                                playerJPosition += 1;

                                // Color the new location of player.
                                context.drawImage(playerColor,
                                    cellWidth * playerJPosition,
                                    cellHeight * playerIPosition,
                                    cellWidth,
                                    cellHeight);
                                break;

                            case '2': // Move up.

                                // Color the previous position cell.
                                context.fillStyle = emptyColor;
                                context.fillRect(cellWidth * playerJPosition,
                                    cellHeight * playerIPosition,
                                    cellWidth,
                                    cellHeight);

                                // Update player coordinate.
                                playerIPosition -= 1;

                                // Color the new location of player.
                                context.drawImage(playerColor,
                                    cellWidth * playerJPosition,
                                    cellHeight * playerIPosition,
                                    cellWidth,
                                    cellHeight);
                                break;

                            case '3': // Move down.

                                // Color the previous position cell.
                                context.fillStyle = emptyColor;
                                context.fillRect(cellWidth * playerJPosition,
                                    cellHeight * playerIPosition,
                                    cellWidth,
                                    cellHeight);

                                // Update player coordinate.
                                playerIPosition += 1;

                                // Color the new location of player.
                                context.drawImage(playerColor,
                                    cellWidth * playerJPosition,
                                    cellHeight * playerIPosition,
                                    cellWidth,
                                    cellHeight);
                                break;

                            default:
                                break;
                            }
                            if (i == response.Solution.length) {
                                clearInterval(intervalId);
                                disableKey(false);
                                $("#solveMaze").prop('disabled', false);
                                $("#btnStartNewGame").prop('disabled', false);
                                // alert("Congratulations!!!");
                                $("#winMessage").show().text("Maze solved");
                            } else {
                                i++;
                            }
                        },
                        250);

                    /**
                     * Reverses a string.
                     * @param {string} str .
                     * @returns {string} reversed str. 
                     */
                    function reverseString(str) {
                        var splitString = str.split("");
                        var reverseArray = splitString.reverse();
                        var joinArray = reverseArray.join("");
                        return joinArray;
                    }

                    function disableKey(isDisable) {
                        isKeyDisabled = isDisable;
                    }
                },

                //In case of an error.
                error: function(xhr, textStatus, errorThrown) {
                    alert("Error: connection lost");
                }
            });
        });
});