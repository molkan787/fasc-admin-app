﻿var masterSetting;
function master_setting_init() {
    masterSetting = {
        elt: get('page_master_setting'),
        elts: {
            logo: get('mset_logo'),
            logoBtn: get('mset_logo_btn'),
            cities: get('mset_cities'),
            citiesPopup: get('mset_cities_popup'),
            cppTitle: get('mset_cities_pp_title'),
            cppName1: get('mset_cities_pp_name_1'),
            cppName2: get('mset_cities_pp_name_2'),
            cppBtn: get('mset_cities_pp_btn'),
            addCityBtn: get('mset_add_city')
        },

        dimc: ui.dimmer.create('master_setting_dimmer'),
        dimcCities: ui.dimmer.create('mset_cities_dimmer'),

        menuItems1: [
            { text: 'Delete', action: 'delete' },
            { text: 'Rename', action: 'rename', noAutoHide: true }
        ],
        menuItems2: [
            { text: 'Delete', action: 'delete' },
            { text: 'Rename', action: 'rename', noAutoHide: true },
            { text: 'Add Region', action: 'addregion', noAutoHide: true }
        ],

        imgSlt: null,

        data: {
            cities: {}
        },

        loadAction: null,
        uploadAction: null,
        saveAction: null,
        deleteAction: null,
        editAction: null,

        // Methods
        update: function (param) {
            this.dimc.show();
            this.loadAction.do();
        },

        loadData: function (data) {
            val(this.elts.logo, data.logo);
            val(this.elts.cities, '');
            for (var i = 0; i < data.cities.length; i++) {
                var city = data.cities[i];
                this.data.cities[city.city_id] = city;
                city._childs = {};
                this.createCityPanel(city);
            }
        },
        save: function () {
            if (this.imgSlt.changed) {
                this.uploadAction.do(this.imgSlt.getData());
                this.dimc.show();
            }
        },

        saveCity: function () {
            var name1 = val(this.elts.cppName1);
            var name2 = val(this.elts.cppName2);
            if (name1.length < 2 || name2.length < 2) {
                msg.show(txt('invalid_city_names'));
                return;
            }
            this.dimcCities.show('Saving');
            this.editAction.do({
                parent: this.currentEditParent,
                city_id: this.currentEdit,
                name_1: name1,
                name_2: name2
            });
        },

        showOptions: function (city_id, child) {
            var city = this.data.cities[city_id];
            if (child) city = city._childs[child];
            this.currentCity = city;
            if (!city) return;
            var isRegion = parseInt(city.parent) > 0;
            var title = (isRegion ? 'Region' : 'City') + ' "' + city.name_1 + '"';
            contextMenu.show(title, isRegion ? this.menuItems1 : this.menuItems2, this.menuItemClick);
        },

        showEditForm: function (city_id, parent) {
            var isRegion = (typeof parent != 'undefined');
            this.currentEdit = city_id;
            this.currentEditParent = isRegion ? parent : 0;
            var city = (isRegion ? this.data.cities[parent]._childs[city_id] : this.data.cities[city_id]) || {};
            var title = (city_id == 'new' ? 'Add new ' : 'Rename ') + (isRegion ? 'Region' : 'City');
            val(this.elts.cppTitle, title);
            val(this.elts.cppName1, city.name_1 || '');
            val(this.elts.cppName2, city.name_2 || '');
            ui.popup.show(this.elts.citiesPopup);
        },

        handleAction: function (action) {
            var isRegion = parseInt(this.currentCity.parent) > 0;
            if (action == 'delete') {
                var crname = isRegion ? 'Region' : 'City';
                var msgText = txt('confirm_city_delete', crname, this.currentCity.name_1);
                var _this = this;
                msg.confirm(msgText, function (answer) {
                    if (answer == 'yes') {
                        _this.dimc.show();
                        _this.deleteAction.do({ city_id: _this.currentCity.city_id});
                    }
                });
            } else if (action == 'rename') {
                if (isRegion) {
                    this.showEditForm(this.currentCity.city_id, this.currentCity.parent);
                } else {
                    this.showEditForm(this.currentCity.city_id);
                }
            } else if (action == 'addregion') {
                this.showEditForm('new', this.currentCity.city_id);
            }
        },

        createCityPanel: function (data) {
            var div = crt_elt('div');
            var h4 = crt_elt('h4', div);
            var btn = crt_elt('button', h4);
            var icon = crt_elt('i', h4);
            var btn_icon = crt_elt('i', btn);
            btn.className = 'ui label';
            btn_icon.className = 'ellipsis horizontal icon';
            icon.className = 'map marker alternate icon';
            h4.append(data.name_1);
            if (data.childs.length) {
                var ul = crt_elt('ul', div);
                for (var i = 0; i < data.childs.length; i++) {
                    var city = data.childs[i];
                    data._childs[city.city_id] = city;
                    var li = crt_elt('li', ul);
                    val(li, city.name_1);
                    var _btn = crt_elt('label', li);
                    _btn.className = 'ui tiny label';
                    val(_btn, '<i class="ellipsis horizontal icon"></i>');
                    attr(_btn, 'city_id', data.city_id);
                    attr(_btn, 'child_id', city.city_id);
                    _btn.onclick = this.cityOptionsClick;
                }
            }

            attr(btn, 'city_id', data.city_id);
            btn.onclick = this.cityOptionsClick;

            this.elts.cities.appendChild(div);
        },

        // Callbacks
        loadActionCallback: function (action) {
            if (action.status == 'OK') {
                this.loadData(action.data);
            } else {
                msg.show(txt('error_3'));
                goBack();
            }
            this.dimc.hide();
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
        },
        deleteActionCallback: function (action) {
            if (action.status == 'OK') {
                reloadPage();
            } else {
                msg.show(txt('error_txt1'));
            }
            this.dimc.hide();
        },
        editActionCallback: function (action) {
            if (action.status == 'OK') {
                reloadPage();
                ui.popup.hide();
            } else {
                msg.show(txt('error_2'));
            }
            this.dimcCities.hide();
        },

        // Handlers
        cityOptionsClick: function () {
            masterSetting.showOptions(attr(this, 'city_id'), attr(this, 'child_id'));
        },

        menuItemClick: function (action) {
            masterSetting.handleAction(action);
        },

        saveCityBtnClick: function () {
            masterSetting.saveCity();
        },

        addCityBtnClick: function () {
            masterSetting.showEditForm('new');
        }
    };

    masterSetting.loadAction = fetchAction.create('setting/get_master_setting', function (action) { masterSetting.loadActionCallback(action); });
    masterSetting.uploadAction = fetchAction.create('image/upBase64&folder=logos', function (action) { masterSetting.uploadActionCallback(action); });
    masterSetting.saveAction = fetchAction.create('setting/update_master_setting', function (action) { masterSetting.saveActionCallback(action); });
    masterSetting.deleteAction = fetchAction.create('cities/delete', function (action) { masterSetting.deleteActionCallback(action); });
    masterSetting.editAction = fetchAction.create('cities/edit', function (action) { masterSetting.editActionCallback(action); });

    masterSetting.imgSlt = imageSelector.init(masterSetting.elts.logoBtn, masterSetting.elts.logo);

    masterSetting.elts.cppBtn.onclick = masterSetting.saveCityBtnClick;
    masterSetting.elts.addCityBtn.onclick = masterSetting.addCityBtnClick;

    registerPage('master_setting', masterSetting.elt, 'Master Setting', function (param) {
        masterSetting.update(param);
    }, { icon: 'save', handler: function () { masterSetting.save() } });
}