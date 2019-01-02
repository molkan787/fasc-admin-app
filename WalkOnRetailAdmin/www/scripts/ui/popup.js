
function ui_popup_init() {
    ui.popup = {
        elt: null,

        showAnimation: {
            targets: '',
            opacity: 1,
            easing: 'easeOutExpo',
            duration: 500
        },
        hideAnimation: {
            tagets: '',
            opacity: 0,
            easing: 'easeOutExpo',
            duration: 500,
            complete: function () {
                ui.popup.animCompleted();
            }
        },

        animCompleted: function () {
            this.elt.style.display = 'none';
        }
    };
    ui.popup.show = function (elt) {
        this.elt = elt;
        elt.style.display = 'block';
        this.showAnimation.targets = '#' + elt.id;
        ui.mx.bbp.show(1);
        anime(this.showAnimation);
    };

    ui.popup.hide = function () {
        this.hideAnimation.targets = '#' + this.elt.id;
        ui.mx.bbp.hide(1);
        anime(this.hideAnimation);
    };

}