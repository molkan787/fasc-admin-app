
function ui_orders_init() {
    var orders = ui.orders = {
        // Proprties
        elt: get('page_orders'),
        elts: {
            ordsList: get('ords_list')
        },
        dimc: ui.dimmer.create('ords_dimmer'),

        loadAction: null,

        // Methods
        createPanel: function (data) {
            var div_par = crt_elt('div');
            var div_s = crt_elt('div', div_par);
            var div_t = crt_elt('div', div_par);
            var div_c = crt_elt('div', div_par);
            var icon = crt_elt('i', div_s);
            crt_elt('br', div_s);
            var span_s = crt_elt('span', div_s);
            var span_t = crt_elt('span', div_t);
            var h3_t = crt_elt('h3', div_t);
            var span_c = crt_elt('span', div_c);
            var h4_c = crt_elt('h4', div_c);

            var isc = (data.order_status == 'Complete');

            div_par.className = 'ord_item';
            div_s.className = isc ? 'completed' : 'pending';
            div_t.className = 'total';
            div_c.className = 'customer';

            icon.className = (isc ? 'check' : 'time') + ' icon';
            val(span_s, (isc ? 'Completed' : 'Pending'));
            val(span_t, 'Total');
            val(h3_t, ui.fasc.formatPrice(data.total));
            val(span_c, 'Customer');
            val(h4_c, data.customer.replace(' ', '<br/>'));

            div_par.onclick = function () {
                navigate('order', data.order_id);
            };

            return div_par;
        },

        loadOrders: function (list) {
            val(this.elts.ordsList, '');
            for (var i = 0; i < list.length; i++) {
                var pan = this.createPanel(list[i]);
                this.elts.ordsList.appendChild(pan);
            }
        },

        loadActionCallback: function (action) {
            this.loadOrders(action.data.items);
            this.dimc.hide();
        }
    };

    orders.loadAction = fetchAction.create('orderadm/list', function (action) { orders.loadActionCallback(action) });

    registerPage('orders', orders.elt, 'Orders', function () {
        orders.dimc.show();
        orders.loadAction.do();
    });
}