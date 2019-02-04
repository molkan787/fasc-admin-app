// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in cordova-simulate or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );
        
    };

    window.onload = function () {
        sl_init();
        cm_init();
        ui_init();
        do_tests();

        document.addEventListener("backbutton", ui_device_backBtn_click, false);
    };

    //window.onerror = function (msg, url, lineNo, columnNo, error) {
    //    if (lineNo) alert(msg + " -- " + lineNo);
    //    else alert(msg);

    //    return false;
    //}

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
} )();