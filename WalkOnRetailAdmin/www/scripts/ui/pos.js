var pos;
function pos_init() {
    pos = {
        elt: get('page_pos'),
        elts: {
            sec1: get('pos_sec1'),
            sec2: get('pos_sec2'),
            cItems: get('pos_c_items'),
            aItems: get('pos_a_items'),
            total: get('pos_total'),
            search: get('pos_search'),
            clearBtn: get('pos_btn_clear'),
            submitBtn: get('pos_btn_submit'),
            loadDataBtn: get('pos_loaddata_btn')
        },

        dimmer: ui.dimmer.create('page_pos', true),

        products: {},
        products_arr: null,

        total: 0,

        cart: {},

        dataLoaded: false,

        loadAction: null,
        submitAction: null,

        submit: function () {
            var prts = [];

            for (var pid in this.cart) {
                if (this.cart.hasOwnProperty(pid) && this.cart[pid] > 0) {
                    var pd = this.products[pid];
                    var p = {
                        id: pid,
                        q: this.cart[pid],
                        name: pd.name,
                        price: pd.price
                    };
                    prts.push(p);
                }
            }

            var _this = this;
            msg.confirm(txt('pos_confirm', fasc.formatPrice(this.total, true) + ' INR'), function (answer) {
                if (answer == 'yes') {
                    _this.dimmer.show('Submiting');
                    _this.submitAction.do({ products: JSON.stringify({ items: prts }) });
                }
            });
        },

        loadData: function (data) {
            this.products_arr = data.items;
            var l = data.items.length;
            var ai = [];
            for (var i = 0; i < l; i++) {
                var p = data.items[i];
                this.products[p.id] = p;
                if (i < 40) {
                    ai.push(p);
                }
            }
            this.setAvItems(ai);
        },

        setAvItems: function (items) {
            val(this.elts.aItems, '');
            for (var i = 0; i < items.length; i++) {
                this.createPanel(items[i]);
            }
        },

        clearCart: function () {
            this.cart = {};
            this.elts.cItems.innerHTML = '';
            this.updateTotal();
        },

        setProductCount: function (p_id, dir) {
            var cart_p = this.cart[p_id];
            if (cart_p) {
                this.cart[p_id] += dir;
                val('pos_row_count_' + p_id, this.cart[p_id]);
            } else {
                if (dir != 1) return;
                this.cart[p_id] = 1;
                this.createRow(this.products[p_id]);
            }
            if (this.cart[p_id] == 0) {
                uiu.removeElt('pos_row_' + p_id);
            }
            this.updateTotal();
        },

        updateTotal: function () {
            var total = 0;
            for (var pid in this.cart) {
                if (this.cart.hasOwnProperty(pid) && this.cart[pid] > 0) {
                    var price = this.products[pid].price;
                    total += this.cart[pid] * price;
                }
            }
            this.total = total;
            val(this.elts.total, fasc.formatPrice(total, true));
        },

        search: function (text, onlyBarcode) {
            if (!this.dataLoaded) return;
            var arr = this.products_arr;
            var l = arr.length;
            var ai = [];
            if (text.length < 3) {
                if (l > 40) l = 40;
                for (var i = 0; i < l; i++) {
                    ai.push(arr[i]);
                }
                this.setAvItems(ai);
                return;
            }
            for (var i = 0; i < l; i++) {
                var p = arr[i];
                if (p.barcode == text) {
                    this.setProductCount(p.id, 1);
                    if (!onlyBarcode) {
                        val(this.elts.search, '');
                        this.search('');
                    }
                    return;
                } else if(!onlyBarcode) {
                    if (p.name.toLowerCase().indexOf(text) != -1) {
                        ai.push(p);
                        if (ai.length >= 40) {
                            break;
                        }
                    }
                }
            }
            if (!onlyBarcode) this.setAvItems(ai);
        },

        // Methods
        createRow: function (data) {
            var tr = crt_elt('tr');
            var td1 = crt_elt('td', tr);
            var td2 = crt_elt('td', tr);
            var td3 = crt_elt('td', tr);
            var img = crt_elt('img', td1);
            var lbl = crt_elt('label', td3);
            var l_i1 = crt_elt('i', lbl);
            var l_lbl = crt_elt('label', lbl);
            var l_i2 = crt_elt('i', lbl);

            td1.className = 'first toe';
            td1.appendChild(crt_txt(data.name));
            val(img, data.image);
            val(td2, fasc.formatPrice(data.price, true));
            lbl.className = 'ui label';
            l_i1.className = 'minus icon';
            val(l_lbl, '1');
            l_i2.className = 'plus icon';

            l_lbl.id = 'pos_row_count_' + data.id;
            tr.id = 'pos_row_' + data.id;

            attr(l_i1, 'pid', data.id);
            attr(l_i2, 'pid', data.id);
            l_i1.onclick = this.minusBtnClick;
            l_i2.onclick = this.plusBtnClick;

            this.elts.cItems.appendChild(tr);
        },

        createPanel: function (data) {
            var div = crt_elt('div');
            var img = crt_elt('img', div);
            var h4 = crt_elt('h4', div);
            var label = crt_elt('label', div);
            h4.className = 'toe';
            label.className = 'ui tiny label';
            val(img, data.image);
            val(h4, data.name);
            val(label, fasc.formatPrice(data.price));
            attr(div, 'pid', data.id);
            div.onclick = this.panelClick;
            this.elts.aItems.appendChild(div);
        },

        // Callbacks
        loadActionCallback: function (action) {
            if (action.status == 'OK') {
                this.loadData(action.data);
                this.dataLoaded = true;
                attr_rm(this.elts.search, 'disabled');
            } else {
                msg.show(txt('error_3'));
            }
            this.dimmer.hide();
        },

        submitActionCallback: function (action) {
            if (action.status == 'OK') {
                this.clearCart();
                msg.show(txt('pos_success', action.data.order_id));
            } else {
                msg.show(txt('error_txt1'));
            }
            this.dimmer.hide();
        },

        // Handlers
        panelClick: function () {
            pos.setProductCount(attr(this, 'pid'), 1);
        },
        plusBtnClick: function () {
            pos.setProductCount(attr(this, 'pid'), 1);
        },
        minusBtnClick: function () {
            pos.setProductCount(attr(this, 'pid'), -1);
        },
        searchBoxChanged: function () {
            pos.search(this.value);
        },
        clearBtnClick: function () {
            pos.clearCart();
        },
        submitBtnClick: function () {
            pos.submit();
        },
        loadDataBtnClick: function () {
            pos.dimmer.show('Loading data');
            pos.loadAction.do();
        }
    };

    pos.elts.clearBtn.onclick = pos.clearBtnClick;
    pos.elts.search.onkeyup = pos.searchBoxChanged;
    pos.elts.loadDataBtn.onclick = pos.loadDataBtnClick;
    pos.elts.submitBtn.onclick = pos.submitBtnClick;

    pos.loadAction = fetchAction.create('pos/listProducts', function (action) { pos.loadActionCallback(action) });
    pos.submitAction = fetchAction.create('pos/addOrder', function (action) { pos.submitActionCallback(action) });
    //pos.loadAction.do();
    registerPage('pos', pos.elt, 'POS');

    window.onresize = posUpdateClasses;
    posUpdateClasses();
}

function posUpdateClasses() {
    if (window.innerWidth > window.innerHeight) {
        class_add(pos.elts.sec1, 'pos_sec_h');
        class_add(pos.elts.sec2, 'pos_sec_h');
    } else {
        class_rm(pos.elts.sec1, 'pos_sec_h');
        class_rm(pos.elts.sec2, 'pos_sec_h');
    }
}