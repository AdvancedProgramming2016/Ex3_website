jQuery(function ($) {

    var defaultNumOfRows = localStorage.getItem("defaultNumOfRows");

    if (!defaultNumOfRows) {

        // Set the default values.
        localStorage.setItem("defaultNumOfRows", "15");
        localStorage.setItem("defaultNumOfCols", "15");
        localStorage.setItem("defaultAlgo", "Dfs");
    }
});