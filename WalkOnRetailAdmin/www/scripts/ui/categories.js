﻿var cats;
function categories_init() {
    cats = {
        elt: get('page_categories'),
        elts: {
            list: get('cats_list')
        },

        dimc: ui.dimmer.create('cats_dimmer'),
        items: null,

        deleteAction: null,

        createPanel: function (data) {
            var div = crt_elt('div');
            var img = crt_elt('img', div);
            var h3 = crt_elt('h3', div);
            var btn = crt_elt('label', div);
            var icon = crt_elt('i', btn);

            val(img, data.image);
            val(h3, data.text);
            div.className = 'cats_item';
            btn.className = 'ui label';
            icon.className = 'delete icon';

            btn.onclick = this.deleteBtnClick;

            attr(btn, 'cancelclick', '1');
            attr(icon, 'cancelclick', '1');
            attr(btn, 'cat_id', data.id);
            attr(div, 'cat_id', data.id);
            div.onclick = this.panelClick;
            div.id = 'cat_panel_' + data.id;

            this.elts.list.appendChild(div);
        },
        
        update: function (param) {
            this.gtype = param;
            this.dimc.show();
            val(this.elts.list, '');
            var _this = this;
            dm.reloadAsd(function () {
                _this.loadCats(dm.cats);
                _this.dimc.hide();
            });
        },

        loadCats: function (data) {
            this.items = {};
            for (var i = 0; i < data.length; i++) {
                var cat = data[i];
                if (cat.gtype == this.gtype) {
                    this.items[cat.id] = cat;
                    this.createPanel(cat);
                }
            }
        },

        deleteCategory: function (cat_id) {
            var cat = this.items[cat_id];
            if (!cat) return;
            var _this = this;
            var txtName = this.gtype == '1' ? 'confirm_brand_delete' : 'confirm_cat_delete';
            var msgText = txt(txtName, cat.text);
            msg.confirm(msgText, function (answer) {
                if (answer == 'yes') {
                    _this.dimc.show('Deleting');
                    _this.deleteAction.do({ cat_id: cat_id });
                }
            });
        },

        // Callbacks
        deleteActionCallback: function (action) {
            if (action.status == 'OK') {
                uiu.removeElt('cat_panel_' + action.params.cat_id, true);
            } else {
                msg.show(txt('error_txt1'));
            }
            this.dimc.hide();
        },

        // Handlers
        panelClick: function (e) {
            if (attr(e.srcElement, 'cancelclick')) return;
            navigate('category', { id: attr(this, 'cat_id'), deepLevel: 1, gtype: cats.gtype, parent: 0 });
        },
        deleteBtnClick: function () {
            cats.deleteCategory(attr(this, 'cat_id'));
        },
        addBtnClick: function () {
            navigate('category', {id: 'new', gtype: cats.gtype, deepLevel: 1});
        }
    };

    cats.deleteAction = fetchAction.create('category/delete', function (action) { cats.deleteActionCallback(action); });
    
    registerPage('categories', cats.elt, function (param) {
        return param == '1' ? 'Brands' : 'Categories';
    }, function (param) {
        cats.update(param);
    }, { icon: 'plus', handler: cats.addBtnClick});

}