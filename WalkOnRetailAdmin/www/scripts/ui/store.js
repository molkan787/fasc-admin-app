var store;
function store_init() {
    store = {
        elt: get('page_store'),

        dimc: ui.dimmer.create('store_dimmer'),

        loadAction: null,

        // Methods
        update: function (param) {

        }
    };

    store.loadAction = fetchAction.create('');

    registerPage('store', store.elt, 'Store details', function (param) {
        store.update(param);
    });
}