
function ui_order_init() {
    var order = ui.order = {
        // Properties
        elt: get('page_order'),
        elts: {
            customer: get('ord_customer'),
            phone: get('ord_phone'),
            total: get('ord_total'),
            statusCon: get('ord_status_con'),
            statusText: get('ord_status_text'),
            statusIcon: get('ord_status_icon'),
            delDate: get('ord_del_date'),
            delAddr: get('ord_del_addr'),
            orderDate: get('ord_order_date'),
            itemsTable: get('ord_items_table')
        },

        loadAction: null,

        dimc: ui.dimmer.create('ord_dimmer'),

        // Methods

        createTableRow: function (v1, v2, v3) {
            var tr = crt_elt('tr', this.elts.itemsTable);
            var td1 = crt_elt('td', tr);
            var td2 = crt_elt('td', tr);
            var td3 = crt_elt('td', tr);

            td2.className = 'second';
            td3.className = 'third';

            val(td1, v1);
            val(td2, v2);
            val(td3, v3);
        },

        loadOrder: function (data) {
            val(this.elts.customer, data.customer);
            val(this.elts.phone, data.telephone);
            val(this.elts.total, fasc.formatPrice(data.total, true));
            val(this.elts.delDate, data.date_added);
            val(this.elts.delAddr, data.shipping_address_1 + ', ' + data.shipping_city);
            val(this.elts.orderDate, data.date_added);

            var isc = (data.order_status_id == 5);
            this.elts.statusCon.className = 'status ' + (isc ? 'completed' : 'pending');
            this.elts.statusIcon.className = 'icon ' + (isc ? 'check' : 'time');
            val(this.elts.statusText, isc ? 'Completed' : 'Pending');

            val(this.elts.itemsTable, '');

            for (var i = 0; i < data.items.length; i++) {
                var item = data.items[i];
                this.createTableRow(item.name, item.quantity, fasc.formatPrice(item.price, true));
            }
        },

        loadActionCallback: function (action) {
            if (action.status == 'OK') {
                this.loadOrder(action.data);
            } else {
                msg.show('We could not load order data.');
            }
            this.dimc.hide();
        },

        // Handlers
        actionIconClick: function () {
            log('clicked!')
        }
    };

    order.loadAction = fetchAction.create('orderadm/info', function (action) { order.loadActionCallback(action) } );

    registerPage('order', order.elt, 'Order Details', function (param) {
        order.dimc.show();
        order.loadAction.do({ order_id: param });
    }, { icon: 'ellipsis vertical', handler: order.actionIconClick });
}