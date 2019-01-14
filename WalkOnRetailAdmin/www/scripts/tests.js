
function do_tests() {
    //test_1();
    //test_2();
    //test_3();
}

function test_1() {
    //registerPage('home', get('page_home'), 'Dashboard', null);
    ui.popup.show('stores_popup_add');
}

function test_2() {
    customers.showCustomer();
}

function test_3() {
    httpPostText('http://fasc.local/index.php?api_token=key&route=api/image/upBase64', 'Test text!', function (resp) {
        log(resp);
    }, function () {

    });
}

function test_4(file) {
    getBase64(file, function (base64) {
        httpPostText('http://fasc.local/index.php?api_token=key&route=api/image/upBase64&folder=products', base64, function (resp) {
            log(resp);
        }, function () {

        });
    });
}