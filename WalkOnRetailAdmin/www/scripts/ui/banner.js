﻿var banner;
function banner_init() {
    banner = {
        elt: get('page_banner'),
        elts: {
            img: get('banner_img'),
            link: get('banner_link')
        },

        dimmer: ui.dimmer.create('page_banner', true),

        imgSlt: null,

        loadAction: null,
        uploadAction: null,
        saveAction: null,

        // Methods
        update: function (param) {
            this.promo_id = param;
            if (param == 'new') {
                this.loadData({});
            } else {
                this.dimmer.show();
                this.loadAction.do({ banner_id: param });
            }
            this.imgSlt.reset();
        },

        loadData: function (data) {
            val(this.elts.img, data.image || 'images/grey_rect.png');
            val(this.elts.link, data.link || '');
        },

        prepareData: function () {
            var raw_link = val(this.elts.link).replace(' ', '').split(',');
            var link = '';
            for (var i = 0; i < raw_link.length; i++) {
                if (link.length > 0) link += ',';
                var l_item = parseInt(raw_link[i]);
                if (l_item > 0) link += l_item;
            }

            this.data = {
                link: link,
                banner_id: this.promo_id,
                image: ''
            };
        },

        save: function () {
            this.dimmer.show('Saving');
            this.prepareData();
            if (this.imgSlt.changed) {
                this.uploadAction.do(this.imgSlt.getData());
            } else {
                this.saveAction.do(this.data);
            }
        },

        // Callbacks
        loadActionCallback: function (action) {
            if (action.status == 'OK') {
                this.loadData(action.data);
            } else {
                msg.show(txt('error_txt1'));
            }
            this.dimmer.hide();
        },

        uploadActionCallback: function (action) {
            if (action.status == 'OK') {
                forceReload = true;
                this.data.image = action.data.filename;
                this.saveAction.do(this.data);
            } else {
                msg.show(txt('error_2'));
                this.dimmer.hide();
            }
        },
        saveActionCallback: function (action) {
            this.dimmer.hide();
            if (action.status == 'OK') {
                reloadPage(action.data.banner_id);
            } else {
                msg.show(txt('error_2'));
            }
        },

        // Handlers
        saveBtnClick: function () {
            banner.save();
        },

    };
    
    banner.uploadAction = fetchAction.create('image/upBase64&folder=banners', function (action) { banner.uploadActionCallback(action); });
    banner.saveAction = fetchAction.create('banner/save_ob', function (action) { banner.saveActionCallback(action); });
    banner.loadAction = fetchAction.create('banner/info', function (action) { banner.loadActionCallback(action); });

    banner.imgSlt = imageSelector.init(get('banner_img_btn'), get("banner_img"));

    registerPage('banner', banner.elt, function (param) {
        return param == 'new' ? 'Add Banner' : 'Banner details'
    }, function (param) { banner.update(param); },
    { icon: 'save', handler: banner.saveBtnClick });
}