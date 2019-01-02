var actions;
var fetchAction;

function actions_init() {

    actions = {
        // Properties
        idPtr: 1,

        create: _actions_create,
    };

    fetchAction = {
        create: _fetch_action_create
    };

}

function _actions_create(task, callback, ref) {
    var action = {
        id: actions.idPtr++,
        task: task,
        callbacks: [],
        ref: ref,

        release: function (status, error_code) {
            this.status = status;
            this.error = error_code || '';
            for (var i = 0; i < this.callbacks.length; i++){
                if (this.callbacks[i](this)) {
                    break;
                }
            }
        },

        do: function () {
            this.task.apply(null, arguments);
        }

    };

    action.callbacks.push(callback);

    return action;
}

function _fetch_action_create(req, callback) {
    var action = {
        req: req,
        callback: callback,
        data: null,

        do: function (params) {
            this.params = params;
            var url = dm._getApiUrl(this.req, params);
            var _this = this;
            httpGetAsync(url, function (resp) {
                _this.__cb(resp);
            }, function () {
                _this.__fcb();
            });
        },

        release: function (status) {
            this.status = status;
            if (this.callback) {
                this.callback(this);
            }
        },

        __cb: function (resp) {
            try {
                resp = JSON.parse(resp);
            } catch (ex) {
                this.release('FAIL', 'invalid_json');
                return;
            }
            if (resp.status == 'OK') {
                this.data = resp.data;
                this.release('OK');
            } else {
                this.release('FAIL', resp.error_code);
            }
        },

        __fcb: function () {
            this.release('FAIL', 'network_error');
        }
    };

    return action;
}