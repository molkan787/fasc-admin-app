var users;
function users_init() {
    users = {
        elt: get('page_users'),
        elts: {
            list: get('users_list'),
            optionsPopup: get('users_options_popup'),
            optionsUsername: get('user_opts_username'),
            optionsName: get('user_opts_name'),
            optionsType: get('user_opts_type'),
            optionsStatus: get('user_opts_status'),
            optionsStatusIcon: get('user_opts_status_icon'),
            optionsReset: get('user_opts_reset'),
            optionsStatusLabel: get('user_options_status_lbl'),
            optionsChangeStatus: get('user_opts_change_status'),
            optionsChangeStatusIcon: get('user_opts_change_status_icon'),
            optionsChangeStatusText: get('user_opts_change_status_text'),
            optionsDelete: get('user_opts_delete'),
            addPopup: get('users_add_popup'),
            addHeader: get('users_add_header'),
            addType: get('users_add_type'),
            addName: get('users_add_name'),
            addUsername: get('users_add_username'),
            addBtn: get('users_add_btn'),
            pwdPopup: get('users_password_popup'),
            pwdUser: get('users_pwd_user'),
            pwdPwd: get('users_pwd_pwd'),
            pwdBtn: get('users_pwd_btn')
        },

        currentType: 2,
        currentUser: null,
        data: {
            users: {}
        },

        dimc: ui.dimmer.create('users_dimmer'),
        dimcOptions: ui.dimmer.create('users_options_dimmer'),
        dimcAdd: ui.dimmer.create('users_add_dimmer'),

        loadAction: null,
        optionsAction: null,
        addAction: null,

        // Methods
        update: function (param) {
            this.currentType = (param == 'master') ? 1 : 2;

            var ism = this.currentType == 1;
            val(this.elts.addHeader, 'Add new ' + (ism ? 'Master User' : 'User'));
            this.elts.addType.innerHTML = '';
            var ts_start = ism ? 2 : 12;
            var ts_stop = ism ? 4 : 14;
            for (var i = ts_start; i <= ts_stop; i++) {
                var opt = crt_elt('option', this.elts.addType);
                opt.value = i;
                val(opt, txt('user_' + i));
            }

            var req = (param == 'master') ? 'users/list_master' : 'users/list';
            this.dimc.show();
            this.loadAction.do(null, req);
        },

        loadData: function (items) {
            val(this.elts.list, '');
            for (var i = 0; i < items.length; i++) {
                this.data.users[items[i].user_id] = items[i];
                this.createPanel(items[i]);
            }
        },

        doAction: function (action) {
            var req = 'users/';
            var isStatusAction = (action == 'suspend' || action == 'unsuspend');
            if (isStatusAction) req += 'change_status';
            else req += action;

            if (this.currentType == 1) req += '_master';

            this.optionsAction.lastAction = action;
            var params = {
                status: (action == 'unsuspend' ? 1 : 0),
                user_id: this.currentUser.user_id
            };
            this.optionsAction.do(params, req);
        },

        addUser: function () {
            var type = val(this.elts.addType);
            var name = val(this.elts.addName);
            var username = val(this.elts.addUsername);
            if (name.length < 8 ||name.length > 40) {
                msg.show(txt('fullname_must_be'));
                return;
            }
            if (username.length < 5 || username.length > 30) {
                msg.show(txt('username_must_be'));
                return;
            }
            var data = {
                fullname: name,
                username: username,
                user_type: type
            }
            var req = 'users/create' + (this.currentType == 1 ? '_master' : '');
            this.dimcAdd.show('Creating');
            this.addAction.do(data, req);
        },

        confirmAction: function (action) {
            var _this = this;
            var msgText = txt('action_confirm_' + action, this.currentUser.username);
            msg.confirm(msgText, function (answer) {
                if (answer == 'yes') {
                    _this.dimcOptions.show(txt('action_progress_' + action));
                    _this.doAction(action);
                }
            });
        },

        showOptionsPopup: function (user_id) {
            var data = this.data.users[user_id];
            this.currentUser = data;
            if (!data) return;
            val(this.elts.optionsUsername, data.username);
            val(this.elts.optionsName, data.fullname);
            val(this.elts.optionsType, txt('user_' + data.user_type));
            val(this.elts.optionsStatus, data.status == 1 ? 'Active' : 'Suspended');
            val(this.elts.optionsChangeStatusText, data.status == 1 ? 'Suspend' : 'Unsuspend');
            this.elts.optionsStatusIcon.className = 'icon ' + (data.status == 1 ? 'check circle' : 'ban');
            this.elts.optionsChangeStatusIcon.className = 'icon ' + (data.status == 1 ? 'ban' : 'check circle');
            this.elts.optionsStatusLabel.style.color = (data.status == 1) ? 'unset' : 'orangered';
            attr(this.elts.optionsChangeStatus, 'action', (data.status == 1) ? 'suspend' : 'unsuspend');
            ui.popup.show(this.elts.optionsPopup);
        },

        showAddForm: function () {
            var ism = this.currentType == 1;
            val(this.elts.addName, '');
            val(this.elts.addUsername, '');
            ui.popup.show(this.elts.addPopup);
        },

        showUserPassword: function (user, pwd) {
            val(this.elts.pwdUser, user);
            val(this.elts.pwdPwd, pwd);
            ui.popup.setCloseButton(this.elts.pwdBtn)
            ui.popup.show(this.elts.pwdPopup);
        },

        createPanel: function (data) {
            var div = crt_elt('div');
            var btn = crt_elt('button', div);
            var btn_i = crt_elt('i', btn);
            var lbl1 = crt_elt('label', div);
            crt_elt('br', div);
            var lbl2 = crt_elt('label', div);
            crt_elt('br', div);
            var lbl4 = crt_elt('label', div);
            crt_elt('br', div);
            var lbl3 = crt_elt('label', div);
            var i1 = crt_elt('i', lbl1);
            var i2 = crt_elt('i', lbl2);
            var i3 = crt_elt('i', lbl3);
            var i4 = crt_elt('i', lbl4);
            lbl1.append('Username: ');
            lbl2.append('Name: ');
            lbl3.append('Status: ');
            lbl4.append('Access: ');
            var span1 = crt_elt('span', lbl1);
            var span2 = crt_elt('span', lbl2);
            var span3 = crt_elt('span', lbl3);
            var span4 = crt_elt('span', lbl4);

            btn.className = 'ui label';
            btn_i.className = 'setting icon';
            i1.className = 'user icon';
            i2.className = 'user circle icon';
            i3.className = 'icon ' + (data.status == 1 ? 'check circle' : 'ban');
            i4.className = 'shield alternate icon';

            val(span1, data.username);
            val(span2, data.fullname);
            val(span3, data.status == 1 ? 'Active' : 'Suspended');
            val(span4, txt('user_' + data.user_type));

            if (data.status != 1) lbl3.style.color = 'orangered';

            attr(btn, 'user_id', data.user_id);
            btn.onclick = this.optionBtnClick;

            this.elts.list.appendChild(div);
        },

        // Callbacks
        loadActionCallback: function (action) {
            if (action.status == 'OK') {
                this.loadData(action.data.items);
            } else {
                msg.show(txt('error_3'));
                goBack();
            }
            this.dimc.hide();
        },

        optionsActionCallback: function (action) {
            if (action.status == 'OK') {
                if (action.lastAction == 'reset') {
                    this.showUserPassword(this.currentUser.username, action.data.password);
                } else if (action.lastAction == 'delete') {
                    msg.show(txt('msg_2', 'User'));
                    ui.popup.hide();
                    reloadPage();
                } else {
                    ui.popup.hide();
                    reloadPage();
                }
            } else {
                msg.show(txt('error_txt1'));
            }
            this.dimcOptions.hide();
        },

        addActionCallback: function (action) {
            if (action.status == 'OK') {
                this.showUserPassword(action.data.username, action.data.password);
                reloadPage();
            } else {
                msg.show(txt('error_txt1'));
            }
            this.dimcAdd.hide();
        },

        // Handlers
        hbBtnClick: function () {
            users.showAddForm();
        },
        optionBtnClick: function () {
            users.showOptionsPopup(attr(this, 'user_id'));
        },
        optionsBtnsClick: function () {
            var action = attr(this, 'action');
            users.confirmAction(action);
        },
        addBtnClick: function () {
            users.addUser();
        }
    };

    users.loadAction = fetchAction.create('', function (action) { users.loadActionCallback(action) });
    users.optionsAction = fetchAction.create('', function (action) { users.optionsActionCallback(action) });
    users.addAction = fetchAction.create('', function (action) { users.addActionCallback(action) });

    users.elts.optionsDelete.onclick = users.elts.optionsChangeStatus.onclick = users.elts.optionsReset.onclick = users.optionsBtnsClick;
    users.elts.addBtn.onclick = users.addBtnClick;

    registerPage('users', users.elt, function (param) { return param == 'master' ? 'Master Users' : 'Users'; },
        function (param) {
            users.update(param);
        }
        , { icon: 'plus', handler: users.hbBtnClick }
    );
}