var masterSetting;
function master_setting_init() {
    masterSetting = {
        elt: get('page_master_setting'),
        elts: {
            logo: get('mset_logo'),
            logoBtn: get('mset_logo_btn')
        },

        dimc: ui.dimmer.create('master_setting_dimmer'),

        imgSlt: null,

        loadAction: null,
        uploadAction: null,
        saveAction: null,

        // Methods
        update: function (param) {
            this.dimc.show();
            this.loadAction.do();
        },

        loadData: function (data) {
            val(this.elts.logo, data.logo);
        },
        save: function () {
            if (this.imgSlt.changed) {
                this.uploadAction.do(this.imgSlt.getData());
                this.dimc.show();
            }
        },

        // Callbacks
        loadActionCallback: function (action) {
            if (action.status == 'OK') {
                this.loadData(action.data);
            } else {
                msg.show(txt('error_3'));
            }
            this.dimc.hide();
            goBack();
        },
        uploadActionCallback: function (action) {
            if (action.status == 'OK') {
                this.saveAction.do({logo: action.data.filename });
            } else {
                msg.show(txt('error_2'));
                this.dimc.hide();
            }
        },
        saveActionCallback: function (action) {
            if (action.status == 'OK') {
                msg.show(txt('msg_1'));
                reloadPage();
            } else {
                msg.show(txt('error_2'));
            }
            this.dimc.hide();
        }
    };

    masterSetting.loadAction = fetchAction.create('setting/get_master_setting', function (action) { masterSetting.loadActionCallback(action); });
    masterSetting.uploadAction = fetchAction.create('image/upBase64&folder=logos', function (action) { masterSetting.uploadActionCallback(action); });
    masterSetting.saveAction = fetchAction.create('setting/update_master_setting', function (action) { masterSetting.saveActionCallback(action); });

    masterSetting.imgSlt = imageSelector.init(masterSetting.elts.logoBtn, masterSetting.elts.logo);

    registerPage('master_setting', masterSetting.elt, 'Master Setting', function (param) {
        masterSetting.update(param);
    }, { icon: 'save', handler: function () { masterSetting.save() } });
}