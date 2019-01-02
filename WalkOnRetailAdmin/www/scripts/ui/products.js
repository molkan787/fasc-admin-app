
function ui_products_init() {
    var products = ui.products = {
        // Properties
        elt: get('page_products'),
        elts: {
            prtsList: get('prts_list')
        },
        loadAction: null,
        deleteAction: null,

        filters: {},

        dimc: ui.dimmer.create('prts_dimmer'),

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
            var i1 = crt_elt('i', btn1);
            var i2 = crt_elt('i', btn2);
            var t1 = crt_elt('span', btn1);
            var t2 = crt_elt('span', btn2);

            div.className = 'prt item';
            val(img, data.image);
            val(a_span, data.title);
            val(span, 'Stock: ' + data.quantity);
            var span_class = 'stock ' + (data.quantity == 0 ? 'none' : (data.quantity < 5 ? 'low' : ''));
            span.className = span_class;
            btn1.className = btn2.className = 'ui button';
            i1.className = 'edit icon';
            i2.className = 'delete icon';
            val(t1, 'Edit');
            val(t2, 'Delete');

            attr(btn1, 'pid', data.product_id);
            attr(btn2, 'pid', data.product_id);

            attr(btn2, 'pname', data.title);

            btn1.onclick = products.editButtonClick;
            btn2.onclick = products.deleteButtonClick;

            div.id = 'prt_panel_' + data.product_id;

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

        // Handlers
        loadActionCallback: function (action) {
            if (action.status == 'OK') {
                products.loadProducts(action.data);
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

        editButtonClick: function () {
            navigate('product', attr(this, 'pid'));
        },
        deleteButtonClick: function () {
            if (confirm('Product "' + attr(this, 'pname') + '" will be deleted permanently, Do you want to proceed anyway?')) {
                products.dimc.show();
                products.deleteAction.do({product_id: attr(this, 'pid')});
            }
        }
    };

    products.loadAction = actions.create(function (filters) { dm.getProducts(filters, products.loadAction); }, products.loadActionCallback);
    products.deleteAction = fetchAction.create('product/delete', products.deleteActionCallback);

    registerPage('products', products.elt, 'Products', function () {
        products.update();
    }, { icon: 'plus', handler: function () {navigate('product', 'new'); }});
}
