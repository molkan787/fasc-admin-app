var category;
function category_init() {
    category = {
        elt: get('page_category'),
        elts: {
            subs: get('subcats_subs'),
            add: get('subcats_add'),
            img: get('cat_img'),
            imgBtn: get('cat_img_btn'),
            name1: get('cat_name_1'),
            name2: get('cat_name_2')
        },

        data: {},
        currentCat: null,

        dimc: ui.dimmer.create('subcats_dimmer'),

        loadAction: null,
        saveAction: null,
        uploadAction: null,

        imgSlt: null,

        // Methods
        update: function (param) {
            this.imgSlt.reset();
            if (param != 'new') {
                this.dimc.show();
                this.loadAction.do({ cat_id: param });
            } else {
                this.loadCat({category_id: 'new'});
            }
        },

        loadCat: function (data) {
            this.currentCat = data.category_id;
            val(this.elts.subs, '');
            if (data.category_id == 'new') {
                val(this.elts.img, 'images/document_blank.png');
                val(this.elts.name1, '');
                val(this.elts.name2, '');
            } else {
                val(this.elts.img, data.image);
                val(this.elts.name1, data.name[1]);
                val(this.elts.name2, data.name[2]);
                for (var sub in data.subs) {
                    if (data.subs.hasOwnProperty(sub)) {
                        this.createPanel(data.subs[sub]);
                    }
                }
            }
        },

        getData: function () {
            var subs = { toUpdate: {}, toDelete: [], toAdd: [] };
            foreach(get_bc('subcat_item'), function (elt) {
                var ise = (attr(elt, 'state') == 'enabled');
                var origin_id = attr(elt, 'origin_id');
                if (ise) {
                    var inps = get_bt('input', elt);
                    var names = { 1: val(inps[0]), 2: val(inps[1]) };
                    if (origin_id) subs.toUpdate[origin_id] = names;
                    else subs.toAdd.push(names);
                } else if (origin_id) {
                    subs.toDelete.push(origin_id);
                }
            });
            return {
                cat_id: this.currentCat,
                name1: val(this.elts.name1),
                name2: val(this.elts.name2),
                subs: JSON.stringify(subs)
            };

        },

        save: function () {
            this.dimc.show('Saving');
            if (this.imgSlt.changed) {
                this.uploadAction.do(this.imgSlt.getData());
            } else {
                var data = this.getData();
                this.saveAction.do(data);
            }
        },

        createPanel: function (data, insertFirst) {
            var div = crt_elt('div');
            var btn = crt_elt('button', div);
            var h4 = crt_elt('h4', div);
            var txt1 = crt_elt('label', div);
            var input1 = crt_elt('input', div);
            var txt2 = crt_elt('label', div);
            var input2 = crt_elt('input', div);

            val(btn, 'Remove');
            val(h4, data[1] || 'New Subcategory');
            val(input1, data[1] || '');
            val(input2, data[2] || '');
            val(txt1, 'English');
            val(txt2, 'Hindi');
            
            input1.className = input2.className = 'subcat_input';

            btn.className = 'ui tiny label';
            div.className = 'subcat_item';
            attr(div, 'origin_id', data.category_id);
            attr(div, 'state', 'enabled');
            btn.onclick = this.toggleBtnClick;

            if (insertFirst)
                insertNodeAsFirst(div, this.elts.subs);
            else
                this.elts.subs.appendChild(div);
        },

        toggleState: function (elt, btnElt) {
            var ise = (attr(elt, 'state') == 'enabled');
            if (ise && !attr(elt, 'origin_id')) {
                uiu.removeElt(elt, true);
                return;
            }
            if (ise) {
                attr(elt, 'state', 'disabled');
                class_add(elt, 'disabled');
                val(btnElt, 'Undo');
            } else {
                attr(elt, 'state', 'enabled');
                class_rm(elt, 'disabled');
                val(btnElt, 'Remove');
            }
            foreach(get_bt('input', elt), function (inp) {
                if (ise)
                    attr(inp, 'disabled', '1')
                else
                    attr_rm(inp, 'disabled')
            });
        },

        // Callbacks
        loadActionCallback: function (action) {
            if (action.status == 'OK') {
                this.loadCat(action.data);
            } else {
                msg.show(txt('error_3'));
                goBack();
            }
            this.dimc.hide();
        },

        uploadActionCallback: function (action) {
            if (action.status == 'OK') {
                var data = this.getData();
                data.image = action.data.filename;
                this.saveAction.do(data);
            } else {
                msg.show(txt('error_2'));
                this.dimc.hide();
            }
        },

        saveActionCallback: function (action) {
            this.dimc.hide();
            if (action.status == 'OK') {
                msg.show(txt('msg_1'));
                navigate('category', action.data.cat_id, false, true);
            } else {
                msg.show(txt('error_2'));
            }
        },

        // Handlers
        toggleBtnClick: function () {
            category.toggleState(this.parentNode, this);
        },

        addButtonClick: function () {
            category.createPanel({}, true);
        },

        saveButtonClick: function () {
            category.save();
        }
    };

    category.loadAction = fetchAction.create('category/info', function (action) { category.loadActionCallback(action); });
    category.saveAction = fetchAction.create('category/save', function (action) { category.saveActionCallback(action); });
    category.uploadAction = fetchAction.create('image/upBase64&folder=categories', function (action) { category.uploadActionCallback(action); });

    category.imgSlt = imageSelector.init(category.elts.imgBtn, category.elts.img);

    category.elts.add.onclick = category.addButtonClick;

    registerPage('category', category.elt, 'Category details', function (param) {
        category.update(param);
    }, { icon: 'save', handler: category.saveButtonClick });
}