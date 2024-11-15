﻿var lm;

function leftmenu_init() {
    lm = ui.lm = {
        elt: get('left_menu'),
        elts: {
            ordersCount: get('lm_order_count')
        },
        _open_anim: {
            targets: '#left_menu',
            left: '0',
            easing: 'easeOutExpo',
            duration: 700
        },
        _close_anim: {
            targets: '#left_menu',
            left: '-18rem',
            easing: 'easeOutExpo',
            duration: 500,
            complete: function () {
                lm.elt.style.display = 'none';
            }
        },
        current_item: null,

        open: function () {
            lm.elt.style.display = 'block';
            ui.mx.bbp.show(0);
            anime(this._open_anim);
        },

        close: function () {
            ui.mx.bbp.hide(0);
            anime(this._close_anim);
        },

        nav_click: function () {
            var action = this.getAttribute('action');
            var param = this.getAttribute('param');
            var rss = this.getAttribute('rss');

            if ((rss || param == 'normal') && parseInt(account.data.user_type) < 10 && dm.storeId == 0) {
                msg.show(txt('select_store_to_visit'));
                return;
            }


            if (lm.current_item) lm.current_item.className = 'item';
            this.className = 'item active';
            lm.current_item = this;

            lm.close();
            if (lm.onNavigate) {
                lm.onNavigate(action, param);
            }
        },

        setAvPages: function (userData) {
            //navigate('order', 81); return;
            var ai = userData.ai;
            var items = get_bt('a', get('lm_items'));
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var act = attr(item, 'action');
                if (act == 'promos') act = 'banners';
                var aii = ai[act];
                if ((typeof aii != 'undefined' && parseInt(aii) == 0)) { // || act == 'stores'
                    item.style.display = 'none';
                } else {
                    item.style.display = 'block';
                }
            }
            if (parseInt(userData.user_type) == 1) {
                get('lm_item_ms').style.display = 'block';
                get('lm_item_mu').style.display = 'block';
            } else {
                get('lm_item_ms').style.display = 'none';
                get('lm_item_mu').style.display = 'none';
            }

            if (parseInt(userData.user_type) > 10) {
                get('lm_sep_1').style.display = 'none';
                get('lm_sep_2').style.display = 'none';
            } else {
                get('lm_sep_1').style.display = 'inline-block';
                get('lm_sep_2').style.display = 'inline-block';
            }

            //if (parseInt(userData.fullaccess) == 1) {
            //    navigate('stores');
            //    return;
            //}
            navigate(navPerUser[userData.user_type]);
        },

        setOrdersCount: function (count) {
            val(this.elts.ordersCount, count);
            if (count < 1) {
                this.elts.ordersCount.style.display = 'none';
            } else {
                this.elts.ordersCount.style.display = 'inline-block';
            }
        }
    };

    var items_parent = get('left_menu_subcon');
    var items = get_bt('a', items_parent);
    foreach(items, function (item) {
        item.onclick = lm.nav_click;
    });

    ui.mx.bbp.setClickHandler(0, function () {
        lm.close();
    });

    $$("body").swipeRight(swipteRightHandler);
    $$("body").swipeLeft(swipteLeftHandler);
}

function swipteRightHandler(e) {
    var startX = e.iniTouch.x;
    var endX = e.currentTouch.x;
    if (startX < 80 && endX > 130) {
        lm.open();
    }
}

function swipteLeftHandler(e) {
    var startX = e.iniTouch.x;
    var endX = e.currentTouch.x;
    if (startX - endX > 100) {
        lm.close();
    }
}

// var navPerUser = {
//     1: 'dashboard',
//     2: 'dashboard',
//     3: 'dashboard',
//     4: 'pos',
//     11: 'dashboard',
//     12: 'dashboard',
//     13: 'products',
//     14: 'orders'
// };
var navPerUser = {
   1: 'stores',
   2: 'stores',
   3: 'stores',
   4: 'pos',
   11: 'dashboard',
   12: 'dashboard',
   13: 'products',
   14: 'orders'
};