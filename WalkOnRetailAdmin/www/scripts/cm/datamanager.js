var dm;

function dm_init() {
    dm_oca_init();
    cm.dm = dm;
    dm.storeId = 0;
    dm.apiToken = window.localStorage.getItem('api_token');
    dm.callbacks = [];

    dm.setToken = function (token) {
        this.apiToken = token;
        window.localStorage.setItem('api_token', token);
    };

    dm.registerCallback = function (callback) {
        this.callbacks.push(callback);
    };

    dm.callCallbacks = function () {
        for (var i = 0; i < this.callbacks.length; i++) {
            this.callbacks[i]();
        }
    };

    dm.setAsd = function (data) {
        this.cats = data.categories.cats;
        this.subcats = data.categories.subcats;
        account.data = data.user;
        dm.callCallbacks();
    };

    dm.asdActionCallback = function (action) {
        if (action.status == 'OK') {
            dm.setAsd(action.data); 
            if (dm.asdCallback) dm.asdCallback('OK');
            else {
                lm.setAvPages(action.data.user);
                ls.hide();
            }
        } else if (action.error_code == 'NO_USER') {
            ls.showLogin();
        } else {
            dm.storeId = 0;
            if (dm.asdCallback) dm.asdCallback('FAIL');
            else msg.show(txt('error_3'));
        }
    };

    dm.getCat = function (cat_id) {
        for (var i = 0; i < this.cats.length; i++) {
            var cat = this.cats[i];
            if (cat.id == cat_id) {
                cat.subs = this.subcats[cat_id];
                return cat;
            }
        }
    };

    dm.setStoreId = function (store_id, callback) {
        dm.storeId = store_id;
        this.reloadAsd(callback);
    };

    dm.reloadAsd = function (callback) {
        this.cats = {};
        this.subcats = {};
        dm.asdAction.do();
        dm.asdCallback = callback;
    };

    dm.asdAction = fetchAction.create('common/asd', dm.asdActionCallback);

    if (dm.apiToken) {
        dm.asdAction.do();
    } else {
        setTimeout(function () { ls.showLogin(); }, 200);
    }
}