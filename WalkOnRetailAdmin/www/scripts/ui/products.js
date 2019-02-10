var products;
function ui_products_init() {
    products = ui.products = {
        // Properties
        elt: get('page_products'),
        elts: {
            prtsList: get('prts_list'),
            saveBtn: get('prts_save_btn'),
            filterCat: get('prts_filter_cat'),
            filterSubcat: get('prts_filter_subcat'),
            filterSubmit: get('prts_filters_submit'),
            filterStock: get('prts_filter_stock'),
            filterName: get('prts_filter_name'),
            filterDiscount: get('prts_filter_discount'),
            filterPopup: get('prts_popup')
        },
        loadAction: null,
        deleteAction: null,
        saveAction: null,

        currentPage: 0,


        filters: [],

        dimc: ui.dimmer.create('prts_dimmer'),
        fc: null,

        // Methods
        createPanel: function (data) {
            var div = crt_elt('div');
            var img = crt_elt('img', div);
            var a = crt_elt('a', div);
            var a_span = crt_elt('span', a);
            crt_elt('br', div);
            var span = crt_elt('span', div);
            crt_elt('br', div);
            var btn1 = crt_elt('button', div);
            var btn2 = crt_elt('button', div);
            var btn3 = crt_elt('button', div);
            var i1 = crt_elt('i', btn1);
            var i2 = crt_elt('i', btn2);
            var i3 = crt_elt('i', btn3);
            var t1 = crt_elt('span', btn1);
            var t2 = crt_elt('span', btn2);

            div.className = 'prt item';
            val(img, data.image);
            val(a_span, data.title);
            val(span, 'Stock: ' + data.quantity);
            var span_class = 'stock ' + (data.quantity == 0 ? 'none' : (data.quantity < 5 ? 'low' : ''));
            span.className = span_class;
            btn1.className = btn2.className = 'ui button';
            btn3.className = 'ui button handle';
            i1.className = 'edit icon';
            i2.className = 'delete icon';
            i3.className = 'sort icon nomargin_o';
            val(t1, 'Edit');
            val(t2, 'Delete');

            attr(btn1, 'pid', data.product_id);
            attr(btn2, 'pid', data.product_id);

            attr(btn2, 'pname', data.title);

            btn1.onclick = products.editButtonClick;
            btn2.onclick = products.deleteButtonClick;

            div.id = 'prt_panel_' + data.product_id;
            attr(div, 'pid', data.product_id);

            return div;
        },

        loadProducts: function (list) {
            val(this.elts.prtsList, '');
            for (var i = 0; i < list.length; i++) {
                this.elts.prtsList.appendChild( this.createPanel(list[i]) );
            }
        },

        update: function () {
            this.dimc.show();
            this.loadAction.do(this.filters);
        },

        updateFilters: function () {
            this.fc.lock();
            this.fc.setFilter({ name: 'cat', value: val(this.elts.filterCat), text: getSelectedText(this.elts.filterCat) });
            this.fc.setFilter({ name: 'subcat', value: val(this.elts.filterSubcat), text: getSelectedText(this.elts.filterSubcat) });
            this.fc.setFilter({ name: 'stock', value: val(this.elts.filterStock), text: getSelectedText(this.elts.filterStock) });
            this.fc.setFilter({ name: 'name', value: val(this.elts.filterName), text: 'Name: ' + val(this.elts.filterName) });
            this.fc.setFilter({ name: 'discount', value: val(this.elts.filterDiscount), text: getSelectedText(this.elts.filterDiscount) });
            this.fc.unlock(true);
        },

        showFilterPopup: function () {
            val(this.elts.filterCat, this.fc.getValue('cat'));
            val(this.elts.filterSubcat, this.fc.getValue('subcat'));
            val(this.elts.filterStock, this.fc.getValue('stock'));
            val(this.elts.filterName, this.fc.getValue('name'));
            val(this.elts.filterDiscount, this.fc.getValue('discount'));
            ui.popup.show(this.elts.filterPopup);
        },

        saveOrder: function () {
            var ids = [];
            var elts = this.elts.prtsList.children;
            if (elts.length < 1) return;
            for (var i = 0; i < elts.length; i++) {
                ids.push(attr(elts[i], 'pid'));
            }
            ids = ids.join(',');
            this.dimc.show();
            this.saveAction.do({ ids: ids });
        },

        // Handlers
        loadActionCallback: function (action) {
            if (action.status == 'OK') {
                products.loadProducts(action.data.items);
            }
            products.dimc.hide();
        },
        deleteActionCallback: function (action) {
            if (action.status == 'OK') {
                uiu.removeElt('prt_panel_' + action.params.product_id, true);
            } else {
                msg.show(txt('error_txt1'));
            }
            products.dimc.hide();
        },
        saveActionCallback: function (action) {
            if (action.status != 'OK') {
                msg.show(txt('error_2'));
            }
            products.dimc.hide();
        },

        editButtonClick: function () {
            navigate('product', attr(this, 'pid'));
        },
        deleteButtonClick: function () {
            if (confirm('Product "' + attr(this, 'pname') + '" will be deleted permanently, Do you want to proceed anyway?')) {
                products.dimc.show();
                products.deleteAction.do({product_id: attr(this, 'pid')});
            }
        },
        filterCatChanged: function () {
            setOptions(products.elts.filterSubcat, dm.subcats[products.elts.filterCat.value], true);
        },
        filterSubmitClick: function () {
            ui.popup.hide();
            products.updateFilters();
        },
        saveBtnClick: function () {
            products.saveOrder();
        }
    };

    products.elts.filterCat.onchange = products.filterCatChanged;
    products.elts.filterSubmit.onclick = products.filterSubmitClick;
    products.elts.saveBtn.onclick = products.saveBtnClick;

    products.fc = filtersController.create('prts_filters', function () { products.update() }, products.filters);

    products.loadAction = fetchAction.create('product/list', products.loadActionCallback);
    products.deleteAction = fetchAction.create('product/delete', products.deleteActionCallback);
    products.saveAction = fetchAction.create('product/sort_order', products.saveActionCallback);

    registerPage('products', products.elt, 'Products', function () {
        products.update();
    }, { icon: 'plus', handler: function () { navigate('product', 'new'); } },
        { icon: 'filter', handler: function () { products.showFilterPopup() } });

    dm.registerCallback(function () {
        var cats = [];
        for (var i = 0; i < dm.cats.length; i++) {
            var cat = dm.cats[i];
            if (cat.gtype == '0') {
                cats.push(cat);
            }
        }
        setOptions(products.elts.filterCat, cats, true);
    });

    Sortable.create(products.elts.prtsList, { handle: '.handle' });
}
