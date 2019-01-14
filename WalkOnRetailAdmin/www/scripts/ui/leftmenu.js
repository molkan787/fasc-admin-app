var lm;

function leftmenu_init() {
    lm = ui.lm = {
        elt: get('left_menu'),
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
            if (lm.current_item) lm.current_item.className = 'item';
            this.className = 'item active';
            lm.current_item = this;

            lm.close();
            if (lm.onNavigate) {
                lm.onNavigate(this.getAttribute('action'));
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
}