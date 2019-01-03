﻿var dm;

function dm_init() {
    dm_oca_init();
    cm.dm = dm;

    dm.callbacks = [];
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
        dm.callCallbacks();
    };

    dm.asdActionCallback = function (action) {
        if (action.status == 'OK') {
            dm.setAsd(action.data);
        } else {
            msg.show('We could not load data.');
        }
    };

    dm.asdAction = fetchAction.create('common/asd', dm.asdActionCallback);
    dm.asdAction.do();
}