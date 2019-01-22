
function header_init() {
    ui.title = get('title');

    get('header_menu_img').onclick = function () {
        if (ui.hb.mainBtn == 'menu') {
            lm.open();
        } else {
            goBack();
        }
    };

    ui.hb = {
        elts: {
            actionIcon: get('headbar_action_icon'),
            mainBtn: get('header_menu_img')
        },
        actionIconHandler: null,

        mainBtn: 'menu',

        // Methods
        setActionIcon: function (actionIcon) {
            if (actionIcon) {
                this.elts.actionIcon.className = actionIcon.icon + ' icon';
                this.elts.actionIcon.style.display = 'block';
                this.actionIconHandler = actionIcon.handler;
            } else {
                this.elts.actionIcon.style.display = 'none';
                this.actionIconHandler = null;
            }
        },

        setButton: function (button) {
            this.mainBtn = button;
            this.elts.mainBtn.src = (button == 'menu') ? 'images/icons/menu.png' : 'images/icons/left_arrow.png';
        },

        // Handlers
        actionIconClick: function () {
            if (ui.hb.actionIconHandler) {
                ui.hb.actionIconHandler();
            }
        }
    };

    ui.hb.elts.actionIcon.onclick = ui.hb.actionIconClick;
}