
function header_init() {
    ui.title = get('title');

    get('header_menu_img').onclick = function () {
        lm.open();
    }

    ui.hb = {
        elts: {
            actionIcon: get('headbar_action_icon')
        },
        actionIconHandler: null,

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

        // Handlers
        actionIconClick: function () {
            if (ui.hb.actionIconHandler) {
                ui.hb.actionIconHandler();
            }
        }
    };

    ui.hb.elts.actionIcon.onclick = ui.hb.actionIconClick;
}