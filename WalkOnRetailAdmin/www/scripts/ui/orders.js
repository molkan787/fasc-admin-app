﻿var orders;
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

        currentPage: 0,
        itemsPerPage: 20,

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
            
            var status_id = parseInt(data.order_status_id);

            div_par.className = 'ord_item';
            div_s.className = ord_getStatusClass(status_id);
            div_t.className = 'total';
            div_c.className = 'customer';

            icon.className = ord_getStatusIcon(status_id) + ' icon';
            val(span_s, ord_getStatusText(status_id));

            val(span_t, 'Total');
            val(h3_t, ui.fasc.formatPrice(data.total));
            val(span_c, 'Customer');
            val(h4_c, data.customer.replace(' ', '<br/>'));

            div_par.onclick = function () {
                navigate('order', data.order_id);
            };

            div_par.id = 'ord_pan_' + data.order_id;

            return div_par;
        },

        updatePanelStatus: function (order_id, status) {
            var pan = get('ord_pan_' + order_id);
            if (!pan) return;
            var div = pan.children[0];
            var i = get_bt('i', div)[0];
            var span = get_bt('span', div)[0];
            div.className = ord_getStatusClass(status);
            i.className = ord_getStatusIcon(status) + ' icon';
            val(span, ord_getStatusText(status));
        },

        loadOrders: function (list) {
            val(this.elts.ordsList, '');
            for (var i = 0; i < list.length; i++) {
                var pan = this.createPanel(list[i]);
                this.elts.ordsList.appendChild(pan);
            }
        },

        update: function (param) {
            this.dimc.show();
            if (typeof param == 'object' && param) {
                this.fc.lock();
                this.fc.clear();
                this.fc.setFilter({ name: 'customer_id', value: param.customer_id, text: 'Customer: ' + param.name });
                this.fc.unlock();
                this.loadAction.refStart = 0;
                this.loadAction.do(this.filters);

            } else if (typeof param == 'number') {
                this.filters.push({ name: 'start', value: param * this.itemsPerPage });
                this.filters.push({ name: 'limit', value: this.itemsPerPage });
                this.loadAction.refStart = param * this.itemsPerPage;
                this.loadAction.do(this.filters);
                this.filters.pop();
                this.filters.pop();

            } else {
                this.loadAction.refStart = 0;
                this.loadAction.do(this.filters);
            }
        },

        loadActionCallback: function (action) {
            if (action.status == 'OK') {
                rtdc.releaseTime();
                this.pagination.setState(action.refStart, action.data.items.length);
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

    orders.pagination = Pagination(orders.itemsPerPage, [get('ords_btns1'), get('ords_btns2')]);

    orders.loadAction = fetchAction.create('orderadm/list', function (action) { orders.loadActionCallback(action) });

    orders.fc = filtersController.create(get('ords_filters'), orders.filtersChanged, orders.filters);
    orders.elts.filterSubmit.onclick = function () { orders.submitFilters() };

    registerPage('orders', orders.elt, 'Orders', function (param) {
        orders.update(param);
    }, null, { icon: 'filter', handler: function () { orders.showFilters() }});
}

function ord_getStatusText(status_id) {
    if (status_id == 5)
        return 'Completed';
    else if (status_id == 7)
        return 'Canceled';
    else
        return 'Pending';
}
function ord_getStatusIcon(status_id) {
    if (status_id == 5)
        return 'check circle';
    else if (status_id == 7)
        return 'ban';
    else
        return 'time';
}
function ord_getStatusClass(status_id) {
    if (status_id == 5)
        return 'completed';
    else if (status_id == 7)
        return 'canceled';
    else
        return 'pending';
}