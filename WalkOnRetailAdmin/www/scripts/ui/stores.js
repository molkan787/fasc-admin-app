var stores;
function stores_init() {
    stores = {
        elt: get('page_stores'),
        elts: {
            list: get('stores_list')
        },

        dimc: ui.dimmer.create('stores_dimmer'),

        loadAction: null,

        // methods
        update: function () {
            this.dimc.show();
            this.loadAction.do();
        },

        createPanel: function (data) {
            var div = crt_elt('div');
            var btn = crt_elt('label', div);
            var icon = crt_elt('i', btn);
            var h4_1 = crt_elt('h4', div);
            var h4_2 = crt_elt('h4', div);
            var span_2 = crt_elt('label', h4_1);
            var span_1 = crt_elt('span', h4_1);
            var span_4 = crt_elt('label', h4_2);
            var span_3 = crt_elt('span', h4_2);

            btn.className = 'ui label';
            icon.className = 'setting icon';
            btn.append('Options');

            val(span_1, ' (id:' + data.store_id + ')');
            val(span_2, '<i class="building icon"></i>' + data.name);
            val(span_3, ' (Store Admin)');
            val(span_4, '<i class="user icon"></i> s' + data.store_id + '_admin');
            h4_2.className = 'smaller';

            this.elts.list.appendChild(div);
        },

        loadStores: function (data) {
            val(this.elts.list, '');
            for (var i = 0; i < data.length; i++) {
                this.createPanel(data[i]);
            }
        },

        // Callbacks
        loadActionCallback: function (action){
            if (action.status == 'OK') {
                this.loadStores(action.data);
            } else {
                msg.show(txt('error_3'));
                goBack();
            }
            this.dimc.hide();
        }
    };

    stores.loadAction = fetchAction.create('setting/list_stores', function (action) { stores.loadActionCallback(action) });

    registerPage('stores', stores.elt, 'Stores', function () {
        stores.update();
    });
}