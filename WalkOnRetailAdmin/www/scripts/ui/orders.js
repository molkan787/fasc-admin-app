var orders;
function ui_orders_init() {
    orders = ui.orders = {
        // Proprties
        elt: get('page_orders'),
        elts: {
            ordsList: get('ords_list'),
            filtersPopup: get('ords_popup'),
            filterStatus: get('ords_filters_status'),
            filterOrderDate: get('ords_filters_order_date'),
            filterSubmit: get('ords_filters_submit')
        },
        dimc: ui.dimmer.create('ords_dimmer'),

        filters: [],

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

        update: function () {
            this.dimc.show();
            this.loadAction.do(orders.filters);
        },

        loadActionCallback: function (action) {
            if (action.status == 'OK') {
                this.loadOrders(action.data.items);
            } else {
                msg.show(txt('error_3'));
            }
            this.dimc.hide();
        },

        filtersChanged: function () {
            orders.update();
        },

        showFilters: function () {
            val(this.elts.filterStatus, this.fc.getValue('status'));
            val(this.elts.filterOrderDate, this.fc.getValue('order_date'));
            ui.popup.show(this.elts.filtersPopup);
        },

        submitFilters: function () {
            this.fc.lock();
            this.fc.setFilter({ name: 'status', value: val(this.elts.filterStatus), text: getSelectedText(this.elts.filterStatus) });
            this.fc.setFilter({ name: 'order_date', value: val(this.elts.filterOrderDate), text: 'Order date: ' + val(this.elts.filterOrderDate) });
            this.fc.unlock(true);
            ui.popup.hide();
        }
    };

    orders.loadAction = fetchAction.create('orderadm/list', function (action) { orders.loadActionCallback(action) });

    orders.fc = filtersController.create(get('ords_filters'), orders.filtersChanged, orders.filters);
    orders.elts.filterSubmit.onclick = function () { orders.submitFilters() };

    registerPage('orders', orders.elt, 'Orders', function () {
        orders.update();
    }, null, { icon: 'filter', handler: function () { orders.showFilters() }});
}