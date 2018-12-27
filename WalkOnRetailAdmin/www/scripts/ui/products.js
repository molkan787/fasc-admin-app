
function ui_products_init() {
    var products = ui.products = {
        // Properties
        elt: get('page_products'),
        elts: {
            prtsList: get('prts_list')
        },

        filters: {},

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
            val(span, 'Stock: ' + data.stock);
            var span_class = 'stock ' + (data.stock == 0 ? 'none' : (data.stock < 5 ? 'low' : ''));
            span.className = span_class;
            btn1.className = btn2.className = 'ui button';
            i1.className = 'edit icon';
            i2.className = 'delete icon';
            val(t1, 'Edit');
            val(t2, 'Delete');

            attr(btn1, 'pid', data.id);
            attr(btn2, 'pid', data.id);

            btn1.onclick = products.editButtonClick;

            return div;
        },

        loadProducts: function (list) {
            val(this.elts.prtsList, '');
            for (var i = 0; i < list.length; i++) {
                this.elts.prtsList.appendChild( this.createPanel(list[i]) );
            }
        },

        update: function () {
            this.loadProducts(dm.getProducts(this.filters));
        },

        // Handlers
        editButtonClick: function () {
            navigate('product', attr(this, 'pid'));
        }
    };

    registerPage('products', products.elt, 'Products', function () {
        products.update();
    });
}
