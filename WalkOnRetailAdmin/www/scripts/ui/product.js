
function product_init() {
    var product = ui.product = {
        elt: get('page_product')
    };

    registerPage('product', product.elt, function (param) {
        if (param == 'new') return 'Add product';
        else return 'Edit product';
    }, function (param) {
        // TODO
    });
}