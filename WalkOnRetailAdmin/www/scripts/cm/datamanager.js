var dm;

function dm_init() {
    cm.dm = dm = {
        // Properties
        productsCache: [
            { title: 'Test product panel 100%', image: 'http://fasc.local/image/cache/catalog/Products/khmlgj-120x120.jpg', stock: '3', id: '54' },
            { title: 'Test product panel 110%', image: 'http://fasc.local/image/cache/catalog/Products/khmlgj-120x120.jpg', stock: '0', id: '53' },
            { title: 'Test product panel 120%', description: 'Some testing test product - Demo', image: 'http://fasc.local/image/cache/catalog/Products/khmlgj-120x120.jpg', stock: '15', id: '57' },
            { title: 'Test product panel 130%', image: 'http://fasc.local/image/cache/catalog/Products/khmlgj-120x120.jpg', stock: '320', id: '24' },
            { title: 'Test product panel 140%', image: 'http://fasc.local/image/cache/catalog/Products/khmlgj-120x120.jpg', stock: '59', id: '32' }
        ],

        // Methods
        getProducts: function (filters) {
            return this.productsCache;
        },

        getProduct: function (id) {
            var result;
            foreach(this.productsCache, function (product) {
                if (parseInt(product.id) == id) {
                    result = product;
                    return true;
                }
            });
            return result;
        }
    };
}