
function ui_product_init() {
    var product = ui.product = {
        elt: get('page_product'),
        elts: {
            prtTitle: get('prt_title'),
            prtDesc: get('prt_description'),
            prtStock: get('prt_stock')
        },

        // Methods
        load: function (data) {
            val(this.elts.prtTitle, data.title);
            val(this.elts.prtDesc, data.description);
            val(this.elts.prtStock, data.stock);
        }
    };

    registerPage('product', product.elt, function (param) {
        if (param == 'new') return 'Add Product';
        else return 'Edit Product';
    }, function (param) {
        var product = dm.getProduct(param);
        if (product) {
            ui.product.load(product);
        }
    },  {
        icon: 'save',
        handler: function () {
            log('TODO!');
        }
    });
}