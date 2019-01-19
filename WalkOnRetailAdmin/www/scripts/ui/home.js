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
            notVerifiedCustomers: get('stats_notverified_customers')
        },

        loadAction: null,

        days: 30,

        dimmer: ui.dimmer.create('page_home', true),

        update: function () {
            this.dimmer.show();
            this.loadAction.do('report/general&days=' + this.days);
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
            var spd_v = [];
        },

        // Callbacks
        loadActionCallback: function (action) {
            if (action.status == 'OK') {
                this.loadData(action.data);
            } else {
                msg.show(txt('error_3'));
            }
            this.dimmer.hide();
        }
    };

    home.loadAction = fetchAction.create('', function (action) { home.loadActionCallback(action) });

    var data = {
        // A labels array that can contain any sort of values
        labels: ['01/18', '01/19', '01/20', '01/21', '01/22'],
        // Our series array that contains series objects or in this case series data arrays
        series: [
            [500, 200, 400, 200, 0],
            [800, 300, 700, 600, 400]
        ]
    };

    // Create a new line chart object where as first parameter we pass in a selector
    // that is resolving to our chart container element. The Second parameter
    // is the actual data object.
    new Chartist.Line('#home_chart_sales', data);
    new Chartist.Line('#home_chart_orders', data);
    new Chartist.Line('#home_chart_customers', data);

    registerPage('home', home.elt, 'Dashboard', function () {
        home.update();
    });
}