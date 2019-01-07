var actions;
var fetchAction;
var actionsChain;

function actions_init() {

    actions = {
        // Properties
        idPtr: 1,

        create: _actions_create,
    };

    fetchAction = {
        create: _fetch_action_create
    };

    actionsChain = {
        create: _actions_chains_create
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
        isBusy: false,
        req: req,
        callback: callback,
        data: null,

        do: function (params) {
            if (this.isBusy) return false;
            this.isBusy = true;
            var isPostReq = (typeof params == 'string');
            this.params = params;
            var _this = this;
            var url;
            url = dm._getApiUrl(this.req, isPostReq ? null : params);

            if (isPostReq) {
                httpPostText(url, params, function (resp) {
                    _this.__cb(resp);
                }, function () {
                    _this.__fcb();
                });
            } else {
                httpGetAsync(url, function (resp) {
                    _this.__cb(resp);
                }, function () {
                    _this.__fcb();
                });
            }
        },

        release: function (status, error) {
            this.isBusy = false;
            this.status = status;
            this.error_code = error;
            if (this.callback) {
                this.callback(this);
            }
        },

        __cb: function (resp) {
            //log(resp);
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


function _actions_chains_create(actions, names, options, callback) {
    var chain = {
        actionIndex: 0,
        actions: actions,
        names: names,
        callback: callback,

        completed: false,

        _lastParam: null,

        // Methods

        start: function (param, startAt) {
            this.completed = false;
            this.actionIndex = (typeof startAt == 'number' ? startAt : 0);
            this.doNext(param);
        },

        doNext: function (param) {
            this.actions[this.actionIndex++].do(param);
        },

        redo: function (param) {
            this.actionIndex--;
            this.doNext(param);
        },

        skipNext: function () {
            this.actionIndex++;
        },

        _actionsCallback: function (action) {
            this.data = action.data;
            this.currentStatus = action.status;
            this.currentErrorCode = action.error_code;
            this.currentData = action.data;
            this.currentStep = this.names[this.actionIndex - 1];
            this.completed = (this.actionIndex == this.actions.length);
            this.status = (this.completed ? 'completed' : 'inprogress');
            this.callback(this);
        }


    };

    var caller = function (action) { chain._actionsCallback(action) };
    foreach(actions, function (action) { action.callback = caller; });

    return chain;
}