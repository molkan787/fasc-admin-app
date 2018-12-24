var dm;

function dm_init() {
    cm.dm = dm = {
        // Properties

        // Methods
        getProducts: function (filters) {
            return [
                { title: 'Test product panel 100%', image: 'http://fasc.local/image/cache/catalog/Products/khmlgj-120x120.jpg', stock: '3', id: '54' },
                { title: 'Test product panel 110%', image: 'http://fasc.local/image/cache/catalog/Products/khmlgj-120x120.jpg', stock: '0', id: '53' },
                { title: 'Test product panel 120%', image: 'http://fasc.local/image/cache/catalog/Products/khmlgj-120x120.jpg', stock: '15', id: '57' },
                { title: 'Test product panel 130%', image: 'http://fasc.local/image/cache/catalog/Products/khmlgj-120x120.jpg', stock: '320', id: '24' },
                { title: 'Test product panel 140%', image: 'http://fasc.local/image/cache/catalog/Products/khmlgj-120x120.jpg', stock: '59', id: '32' }
            ];
        }
    };
}