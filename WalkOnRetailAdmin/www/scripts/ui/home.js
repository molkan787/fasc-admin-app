var home;
function home_init() {

    home = {
        elt: get('page_home'),
        elts: {
            totalSales: get('stats_total_sales'),
            walkonSales: get('stats_walkon_sales'),
            onlineSales: get('stats_online_sales'),
            totalOrders: get('stats_total_orders'),
            completedOrders: get('stats_completed_orders'),
            pendingOrders: get('stats_pending_orders'),
            totalCustomers: get('stats_total_customers'),
            verifiedCustomers: get('stats_verified_customers'),
            notVerifiedCustomers: get('stats_notverified_customers'),
            popup: get('home_popup'),
            popupRange: get('home_pp_range'),
            popupSubmit: get('home_pp_submit')
        },

        loadAction: null,

        days: 10,

        dimmer: ui.dimmer.create('page_home', true),

        update: function () {
            this.dimmer.show();
            this.loadAction.do(null, 'report/general&days=' + this.days);
        },

        loadData: function (data) {
            val(this.elts.totalSales, fasc.formatPrice(data.total_sales.total));
            val(this.elts.walkonSales, fasc.formatPrice(data.total_sales.walkon));
            val(this.elts.onlineSales, fasc.formatPrice(data.total_sales.online));

            val(this.elts.totalOrders, data.orders.total);
            val(this.elts.completedOrders, data.orders.completed);
            val(this.elts.pendingOrders, data.orders.pending);

            val(this.elts.totalCustomers, data.customers.total);
            val(this.elts.verifiedCustomers, data.customers.verified);
            val(this.elts.notVerifiedCustomers, data.customers.not_verified);

            // Preparing charts data
            var spd = data.salesPerDay;
            var spd_l = [];
            var spd_v = [[], []];
            for (var day in spd) {
                if (spd.hasOwnProperty(day)) {
                    spd_l.push(day.substr(-5));
                    spd_v[0].push(spd[day].w);
                    spd_v[1].push(spd[day].o);
                }
            }
            initChart('home_chart_sales', spd_l, spd_v);

            spd = data.ordersPerDay;
            spd_l = [];
            spd_v = [];
            for (var day in spd) {
                if (spd.hasOwnProperty(day)) {
                    spd_l.push(day.substr(-5));
                    spd_v.push(spd[day]);
                }
            }
            initChart('home_chart_orders', spd_l, [spd_v]);

            spd = data.customersPerDay;
            spd_l = [];
            spd_v = [];
            for (var day in spd) {
                if (spd.hasOwnProperty(day)) {
                    spd_l.push(day.substr(-5));
                    spd_v.push(spd[day]);
                }
            }
            initChart('home_chart_customers', spd_l, [spd_v]);
        },

        showPopup: function () {
            val(this.elts.popupRange, this.days);
            ui.popup.show(this.elts.popup);
        },

        // Callbacks
        loadActionCallback: function (action) {
            if (action.status == 'OK') {
                this.loadData(action.data);
            } else {
                msg.show(txt('error_3'));
            }
            this.dimmer.hide();
        },

        // Handlers
        submitBtnClick: function () {
            ui.popup.hide();
            home.days = val(home.elts.popupRange);
            home.update();
        }

    };

    home.loadAction = fetchAction.create('', function (action) { home.loadActionCallback(action) });

    home.elts.popupSubmit.onclick = home.submitBtnClick;

    registerPage('dashboard', home.elt, 'Dashboard', function () {
        home.update();
    }, null, { icon: 'calendar', handler: function () { home.showPopup() } });
}

function initChart(elt, labels, series) {
    var data = {
        labels: labels,
        series: series
    };
    new Chartist.Line('#' + elt, data, {width: '100%', height: '300px'});
}