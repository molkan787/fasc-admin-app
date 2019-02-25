(function () {
    "use strict";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener('resume', onResume.bind(this), false);

        //cordova.plugins.notification.local.schedule({
        //    title: 'My first notification',
        //    text: 'Thats pretty easy...',
        //    foreground: true
        //});
        
    };

    function dosometing() {
        setTimeout(function () { alert('Test') });
    }

    window.onload = function () {
        sl_init();
        cm_init();
        ui_init();
        rtdc.check();
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