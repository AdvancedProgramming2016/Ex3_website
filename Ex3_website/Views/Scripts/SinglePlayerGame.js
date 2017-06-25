$(function() {

    //Load navbar.
    $("#singleNav").load("Navbar.html",
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

    $("#singleError").hide();
    $("#mazeCanvas").hide();
    $("#solveMaze").prop('disabled', true);

    $("#mazeRows").val(localStorage.getItem("defaultNumOfRows"));
    $("#mazeCols").val(localStorage.getItem("defaultNumOfCols"));
    $("#selectedAlgo").val(localStorage.getItem("defaultAlgo"));


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
    var playerColor = "#FF0000";
    var emptyColor = "#FFFFFF";
    var context = undefined;

    $(function() {
        $("body").on('keydown',
            function(e) {
                if (maze) {
                    var pressedKey = e.which;
                    var myCanvas = document.getElementById("mazeCanvas");
                    context = mazeCanvas.getContext("2d");
                    switch (pressedKey) {
                    case right:
                        // If the right block is not a wall.
                        if ((maze.charAt(playerIPosition * rows + playerJPosition + 1) != 1) &&
                            (playerJPosition + 1 < cols)) {

                            if (playerIPosition == goalPosRow && playerJPosition == goalPosCol) {
                                context.fillStyle = "blue";
                                context.fillRect(cellWidth * playerJPosition,
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
                            context.fillStyle = playerColor;
                            context.fillRect(cellWidth * playerJPosition,
                                cellHeight * playerIPosition,
                                cellWidth,
                                cellHeight);
                        }

                        // If player reached goal position.
                        if (playerIPosition == goalPosRow && playerJPosition == goalPosCol) {
                            alert("You won!");
                        }
                        break;

                    case left:

                        // If the left block is not a wall.
                        if ((maze.charAt(playerIPosition * rows + playerJPosition - 1) != 1) &&
                            (playerJPosition - 1 >= 0)) {

                            if (playerIPosition == goalPosRow && playerJPosition == goalPosCol) {
                                context.fillStyle = "blue";
                                context.fillRect(cellWidth * playerJPosition,
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
                            context.fillStyle = playerColor;
                            context.fillRect(cellWidth * playerJPosition,
                                cellHeight * playerIPosition,
                                cellWidth,
                                cellHeight);
                        }

                        // If player reached goal position.
                        if (playerIPosition == goalPosRow && playerJPosition == goalPosCol) {
                            alert("You won!");
                        }
                        break;

                    case up:

                        // If the upper block is not a wall.
                        if ((maze.charAt((playerIPosition - 1) * rows + playerJPosition) != 1) &&
                            (playerIPosition - 1 >= 0)) {

                            if (playerIPosition == goalPosRow && playerJPosition == goalPosCol) {
                                context.fillStyle = "blue";
                                context.fillRect(cellWidth * playerJPosition,
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
                            context.fillStyle = playerColor;
                            context.fillRect(cellWidth * playerJPosition,
                                cellHeight * playerIPosition,
                                cellWidth,
                                cellHeight);
                        }

                        // If player reached goal position.
                        if (playerIPosition == goalPosRow && playerJPosition == goalPosCol) {
                            alert("You won!");
                        }
                        break;

                    case down:
                        // If the downer block is not a wall.
                        if ((maze.charAt((playerIPosition + 1) * rows + playerJPosition) != 1) &&
                            (playerIPosition + 1 < rows)) {

                            if (playerIPosition == goalPosRow && playerJPosition == goalPosCol) {
                                context.fillStyle = "blue";
                                context.fillRect(cellWidth * playerJPosition,
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
                            context.fillStyle = playerColor;
                            context.fillRect(cellWidth * playerJPosition,
                                cellHeight * playerIPosition,
                                cellWidth,
                                cellHeight);
                        }

                        // If player reached goal position.
                        if (playerIPosition == goalPosRow && playerJPosition == goalPosCol) {
                            alert("You won!");
                        }
                        break;
                    }
                }
            })
    });

    $("#btnStartNewGame").on('click',
        function() {

            $("#singleError").hide();

            if ($("#mazeName").val() == "") {

                $("#singleError").show().text("Maze name can't be empty");

            } else if ($("#mazeRows").val() == "") {

                $("#singleError").show().text("Rows can't be empty");

            } else if ($("#mazeCols").val() == "") {

                //TODO check if this check is necessary
                $("#singleError").show().text("Columns can't be empty");

            } else {

                $.ajax({
                    type: 'GET',
                    url: '../../api/SinglePlayer',
                    data: {
                        mazeName: $("#mazeName").val(),
                        rows: $("#mazeRows").val(),
                        columns: $("#mazeCols").val()
                    },
                    dataType: 'json',
                    success: function (response) {

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
                                    if (response.Maze.charAt(i * response.Rows + j) == 1) {
                                        context.fill = wallColor;
                                        context.fillRect(cellWidth * j,
                                            cellHeight * i,
                                            cellWidth,
                                            cellHeight);
                                    } else if (response.InitialPos.Row == i &&
                                        response.InitialPos.Col == j) { // Color the players initial position.
                                        playerIPosition = i;
                                        playerJPosition = j;
                                        context.fillStyle = playerColor;
                                        context.fillRect(cellWidth * j,
                                            cellHeight * i,
                                            cellWidth,
                                            cellHeight);
                                        context.fillStyle = wallColor;
                                    } else if (response.GoalPos.Row == i &&
                                        response.GoalPos.Col == j) // Color the goal position.
                                    {
                                        context.fillStyle = "blue";
                                        context.fillRect(cellWidth * j, cellHeight * i, cellWidth, cellHeight);
                                        context.fillStyle = wallColor;
                                    }
                                }
                            }
                        }
                        
                        $("#solveMaze").prop('disabled', false);

                    },

                    error: function(xhr, textStatus, errorThrown) {
                        alert("Error: connection lost");
                    }
                });
            }
        });

    $("#solveMaze").on('click',
        function() {
            $.ajax({
                type: 'GET',
                url: '../../api/SinglePlayer',
                data: {
                    mazeName: $("#mazeName").val(),
                    algorithmType: $("#selectedAlgo").val(),
                },
                dataType: 'json',
                success: function(response) {

                    var intervalId;
                    var i = 0;
                    var reverseSolution = reverseString(response.Solution);

                    // Remove player current rectangle.
                    context.fillStyle = emptyColor;
                    context.fillRect(cellWidth * playerJPosition,
                        cellHeight * playerIPosition,
                        cellWidth,
                        cellHeight);

                    // Place player in initial rectangle.
                    playerJPosition = initPosCol;
                    playerIPosition = initPosRow;

                    context.fillStyle = playerColor;
                    context.fillRect(cellWidth * playerJPosition,
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
                                context.fillStyle = playerColor;
                                context.fillRect(cellWidth * playerJPosition,
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
                                context.fillStyle = playerColor;
                                context.fillRect(cellWidth * playerJPosition,
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
                                context.fillStyle = playerColor;
                                context.fillRect(cellWidth * playerJPosition,
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
                                context.fillStyle = playerColor;
                                context.fillRect(cellWidth * playerJPosition,
                                    cellHeight * playerIPosition,
                                    cellWidth,
                                    cellHeight);
                                break;

                            default:
                                break;
                            }
                            if (i == response.Solution.length) {
                                clearInterval(intervalId);
                                alert("Congratulations!!!");
                            } else {
                                i++;
                            }
                        },
                        250);

                    function reverseString(str) {
                        var splitString = str.split("");
                        var reverseArray = splitString.reverse();
                        var joinArray = reverseArray.join("");
                        return joinArray;
                    }
                },
                error: function(xhr, textStatus, errorThrown) {
                    alert("Error: connection lost");
                }
            });
        });
});