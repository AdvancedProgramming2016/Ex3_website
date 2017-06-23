jQuery(function ($) {

    // Place the default values in html page.
    document.getElementById("defaultNumOfRows").value = localStorage.getItem("defaultNumOfRows");
    document.getElementById("defaultNumOfCols").value = localStorage.getItem("defaultNumOfCols");
    document.getElementById("defaultAlgo").value = localStorage.getItem("defaultAlgo");

    // Set new default values.
    $("#updateSettingsButton").on('click', function () {
        localStorage.setItem("defaultNumOfRows", $("#defaultNumOfRows").val());
        localStorage.setItem("defaultNumOfCols", $("#defaultNumOfCols").val());
        localStorage.setItem("defaultAlgo", $("#defaultAlgo").val());
        document.getElementById("settingsUpdated").innerHTML = "Settings was updated";
    });
});