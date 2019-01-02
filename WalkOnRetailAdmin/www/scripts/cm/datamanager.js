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
        ordersCache: [
            { id: 14, status: 1, total: 2450.8, customer: { firstName: 'Rachid', lastName: 'Berberovich' } },
            { id: 13, status: 5, total: 1340.35, customer: { firstName: 'Malik', lastName: 'Fraicheur' } },
            { id: 12, status: 5, total: 1340.35, customer: { firstName: 'Jhon', lastName: 'Pourboir' } },
            { id: 11, status: 5, total: 1340.35, customer: { firstName: 'Hitist', lastName: 'Feshel' } }
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
        },

        getOrders: function (filters) {
            return this.ordersCache;
        },
        getOrder: function (id) {
            var result;
            foreach(this.ordersCache, function (order) {
                if (parseInt(order.id) == id) {
                    result = order;
                    return true;
                }
            });
            return result;
        },
    };
    dm_oca_init();
}