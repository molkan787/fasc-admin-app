var setting;
function setting_init() {
    setting = {
        elt: get('page_setting'),
        elts: {
            storeName: get('set_store_name'),
            minTotal: get('set_min_total'),
            timingFrom: get('set_timing_from'),
            timingTo: get('set_timing_to'),
            timingSlot: get('set_timing_slot')
        },

        dimc: ui.dimmer.create('setting_dimmer'),

        loadAction: null,
        saveAction: null,


        // Methods
        update: function () {
            this.dimc.show();
            this.loadAction.do();
        },

        loadData: function (data) {
            val(this.elts.minTotal, data.min_total);
            val(this.elts.timingFrom, data.timing_from);
            val(this.elts.timingTo, data.timing_to);
            val(this.elts.timingSlot, data.timing_slot);
        },

        save: function () {
            var data = {
                min_total: val(this.elts.minTotal),
                timing_from: val(this.elts.timingFrom),
                timing_to: val(this.elts.timingTo),
                timing_slot: val(this.elts.timingSlot)
            };
            this.dimc.show('Saving');
            this.saveAction.do(data);
        },

        // Callbacks
        loadActionCallback: function (action) {
            if (action.status == 'OK') {
                this.loadData(action.data);
            } else {
                msg.show(txt('error_3'));
            }
            this.dimc.hide();
        },
        saveActionCallback: function (action) {
            if (action.status == 'OK') {
                msg.show(txt('msg_1'));
            } else {
                msg.show(txt('error_2'));
            }
            this.dimc.hide();
        },

        // Handlers
        saveBtnClick: function () {
            setting.save();
        }
    };

    for (var i = 0; i < 24; i++) {
        var opt1 = crt_elt('option', setting.elts.timingFrom);
        var opt2 = crt_elt('option', setting.elts.timingTo);
        var str = ('0' + i).substr(-2) + ':00';
        val(opt1, str);
        val(opt2, str);
        opt1.value = opt2.value = i;
    }
    for (var i = 1; i < 9; i++) {
        var opt1 = crt_elt('option', setting.elts.timingSlot);
        val(opt1, i + ' Hour' + (i > 1 ? 's' : ''));
        opt1.value = i;
    }

    setting.loadAction = fetchAction.create('setting/store_setting', function (action) { setting.loadActionCallback(action) });
    setting.saveAction = fetchAction.create('setting/store_setting_save', function (action) { setting.saveActionCallback(action) });

    registerPage('setting', setting.elt, 'Setting', function () { setting.update(); },
        { icon: 'save', handler: setting.saveBtnClick });

}