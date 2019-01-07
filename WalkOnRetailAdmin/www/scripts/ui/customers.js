var customers;

function ui_customers_init() {

    customers = {
        elt: get('page_customers'),
        listElt: get('cust_list'),
        elts: {
            filtersPopup: get('cust_popup'),
            filterStatus: get('cust_filters_status'),
            filterRegDate: get('cust_filters_reg_date'),
            filterName: get('cust_filters_name'),
            filterPhone: get('cust_filters_phone'),
            filterSubmit: get('cust_filters_submit')
        },

        loadAction: null,
        filters: [],

        dimc: ui.dimmer.create('cust_dimmer'),
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
            this.listElt.appendChild(div);
        },

        loadCustomers: function (data) {
            val(this.listElt, '');
            for (var i = 0; i < data.length; i++) {
                this.createPanel(data[i]);
            }
        },

        update: function () {
            this.dimc.show();
            this.loadAction.do(this.filters);
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

        // Callbacks

        loadActionCallback: function (action) {
            if (action.status == 'OK') {
                this.loadCustomers(action.data.items);
            } else {
                msg.show(txt('error_3'));
            }
            this.dimc.hide();
        },

        // Handlers

        filtersChanged: function () {
            this.update();
        }
    };


    customers.loadAction = fetchAction.create('client/list', function (action) { customers.loadActionCallback(action) });

    customers.fc = filtersController.create('cust_filters', function () { customers.filtersChanged(); }, customers.filters);

    customers.elts.filterSubmit.onclick = function () { customers.submitFilters(); };

    registerPage('customers', customers.elt, 'Customers', function () {
        customers.update();
    }, null, { icon: 'filter', handler: function () { customers.showFilters() }});

}