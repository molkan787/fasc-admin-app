var rtdc;
function rtdc_init() {
    var rtdc_time = parseInt(window.localStorage.getItem('rtdc_time'));
    rtdc = {
        action: null,

        pingTime: rtdc_time,
        checkTime: rtdc_time,

        data: {
            orders_count: 0,
        },

        check: function () {
            this.action.do({ time: this.pingTime });
        },

        releaseTime: function () {
            this.setPingTime(this.checkTime);
            this.data.orders_count = 0;
            lm.setOrdersCount(0);
        },

        // Callbacks
        actionCallback: function (action) {
            if (action.status == 'OK') {
                this.checkTime = parseInt(action.data.time);
                var orders_count = parseInt(action.data.orders_count);
                if (orders_count != this.data.orders_count) {
                    this.data.orders_count = orders_count;
                    lm.setOrdersCount(orders_count);
                }
            }
            var _this = this;
            if (this.timer) clearTimeout(this.timer);
            this.timer = setTimeout(function () { _this.check(); }, 10000);
        },

        // -----------
        setPingTime: function (time) {
            this.pingTime = time;
            window.localStorage.setItem('rtdc_time', time);
        }
    };

    rtdc.action = fetchAction.create('rtdc', function (action) { rtdc.actionCallback(action) });
}