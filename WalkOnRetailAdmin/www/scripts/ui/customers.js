﻿var customers;

function ui_customers_init() {

    customers = {
        elt: get('page_customers'),
        listElt: get('cust_list'),
        elts: {
            customerPopup: get('cust_popup'),
            filtersPopup: get('cust_filters_popup'),
            filterStatus: get('cust_filters_status'),
            filterRegDate: get('cust_filters_reg_date'),
            filterName: get('cust_filters_name'),
            filterPhone: get('cust_filters_phone'),
            filterSubmit: get('cust_filters_submit'),
            popupName: get('cust_pp_name'),
            popupPhone: get('cust_pp_phone'),
            popupEmail: get('cust_pp_email'),
            popupStatusLabel: get('cust_pp_status_label'),
            popupStatusIcon: get('cust_pp_status_icon'),
            popupStatusText: get('cust_pp_status_text'),
            popupShowOrdersBtn: get('cust_pp_show_orders'),
            popupDeleteBtn: get('cust_pp_delete')
        },

        items: null,

        currentPage: 0,
        itemsPerPage: 20,

        loadAction: null,
        deleteCustomerAction: null,
        filters: [],

        dimc: ui.dimmer.create('cust_dimmer'),
        popupDimc: ui.dimmer.create('cust_pp_dimmer'),
        fc: null,

        // Methods 

        createPanel: function (data) {
            var div = crt_elt('div');
            var i1 = crt_elt('i', div);
            var span1 = crt_elt('span', div);
            crt_elt('br', div);
            var i2 = crt_elt('i', div);
            var span2 = crt_elt('span', div);
            var label = crt_elt('label', div);
            var l_icon = crt_elt('i', label);
            var l_span = crt_elt('span', label);

            div.className = 'cust item';
            i1.className = 'user icon';
            i2.className = 'phone icon';
            val(span1, data.name);
            val(span2, data.telephone);

            var isv = (parseInt(data.verified) == 1);
            label.className = 'ui tiny label ' + (isv ? 'green' : 'red');
            l_icon.className = 'icon ' + (isv ? 'check circle icon' : 'ban icon');
            val(l_span, isv ? 'Verified' : 'Not verified');

            div.id = 'cust_panel_' + data.customer_id;
            attr(div, 'customer_id', data.customer_id);
            div.onclick = this.panelClick;

            this.listElt.appendChild(div);
        },

        loadCustomers: function (data) {
            this.items = {};
            val(this.listElt, '');
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                this.items[item.customer_id] = item;
                this.createPanel(item);
            }
        },

        update: function (page) {

            this.dimc.show();

            var page_n = page || 0;

            this.filters.push({ name: 'start', value: page_n * this.itemsPerPage });
            this.filters.push({ name: 'limit', value: this.itemsPerPage });
            this.loadAction.refStart = page_n * this.itemsPerPage;
            this.loadAction.do(this.filters);
            this.filters.pop();
            this.filters.pop();
        },

        showFilters: function () {
            val(this.elts.filterStatus, this.fc.getValue('status'));
            val(this.elts.filterRegDate, this.fc.getValue('reg_date'));
            val(this.elts.filterName, this.fc.getValue('name'));
            val(this.elts.filterPhone, this.fc.getValue('phone'));
            ui.popup.show(this.elts.filtersPopup);
        },

        submitFilters: function () {
            this.fc.lock();
            this.fc.setFilter({ name: 'status', value: val(this.elts.filterStatus), text: getSelectedText(this.elts.filterStatus) });
            this.fc.setFilter({ name: 'reg_date', value: val(this.elts.filterRegDate), text: 'Reg: ' + val(this.elts.filterRegDate) });
            this.fc.setFilter({ name: 'name', value: val(this.elts.filterName), text: 'Name: ' + val(this.elts.filterName) });
            this.fc.setFilter({ name: 'phone', value: val(this.elts.filterPhone), text: 'Phone: ' + val(this.elts.filterPhone) });
            this.fc.unlock(true);
            ui.popup.hide();
        },

        showCustomer: function (customer_id) {
            var customer = this.items[customer_id];
            if (!customer) return;
            this.currentCustomer = customer;
            val(this.elts.popupName, customer.name);
            val(this.elts.popupPhone, customer.telephone);
            var no_email = (customer.email.substr(0, 9) == 'customer_');
            var email = (no_email ? ' (Empty) ' : customer.email);
            var verified = (parseInt(customer.verified) == 1);
            val(this.elts.popupEmail, email);
            this.elts.popupEmail.style.fontStyle = (no_email ? 'italic' : 'unset');
            this.elts.popupEmail.style.color = (no_email ? '#666' : 'unset');
            val(this.elts.popupStatusText, verified ? 'Verified' : 'Not verified');
            this.elts.popupStatusLabel.className = 'ui tiny label ' + (verified ? 'green' : 'red');
            this.elts.popupStatusIcon.className = 'icon ' + (verified ? 'check circle' : 'ban');

            ui.popup.show(this.elts.customerPopup);
        },

        showCustomerOrders: function () {
            ui.popup.hide();
            navigate('orders', this.currentCustomer);
        },

        deleteCustomer: function () {
            var text = txt('confirm_customer_delete', this.currentCustomer.name);
            var _this = this;
            msg.confirm(text, function (answer) {
                if (answer == 'yes') {
                    _this.popupDimc.show();
                    _this.deleteCustomerAction.do({ customer_id: _this.currentCustomer.customer_id });
                }
            });
        },

        // Callbacks

        loadActionCallback: function (action) {
            if (action.status == 'OK') {
                this.pagination.setState(action.refStart, action.data.items.length);
                this.loadCustomers(action.data.items);
            } else {
                msg.show(txt('error_3'));
            }
            this.dimc.hide();
        },
        deleteCustomerActionCallback: function (action) {
            if (action.status == 'OK') {
                ui.popup.hide();
                uiu.removeElt('cust_panel_' + action.params.customer_id, true);
            } else {
                msg.show(txt('error_txt1'));
            }
            this.popupDimc.hide();
        },

        // Handlers

        filtersChanged: function () {
            this.update();
        },

        panelClick: function () {
            customers.showCustomer(attr(this, 'customer_id'));
        }
    };

    customers.pagination = Pagination(customers.itemsPerPage, [get('cust_btns1'), get('cust_btns2')]);

    customers.loadAction = fetchAction.create('client/list', function (action) { customers.loadActionCallback(action) });
    customers.deleteCustomerAction = fetchAction.create('client/delete', function (action) { customers.deleteCustomerActionCallback(action); });

    customers.fc = filtersController.create('cust_filters', function () { customers.filtersChanged(); }, customers.filters);

    customers.elts.filterSubmit.onclick = function () { customers.submitFilters(); };
    customers.elts.popupShowOrdersBtn.onclick = function () { customers.showCustomerOrders() };
    customers.elts.popupDeleteBtn.onclick = function () { customers.deleteCustomer(); };

    registerPage('customers', customers.elt, 'Customers', function (param) {
        customers.update(param);
    }, null, { icon: 'filter', handler: function () { customers.showFilters() }});

}