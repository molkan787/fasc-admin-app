
function ui_popup_init() {
    ui.popup = {
        elt: null,
        isOpen: false,
        nextElt: null,

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
            this.elt = null;
            if (this.nextElt) {
                this.show(this.nextElt, true);
            }
        }
    };
    ui.popup.show = function (elt, isSwitch) {
        if (this.isOpen && this.elt) {
            this.nextElt = elt;
            this.hide();
            return;
        }
        this.nextElt = null;
        this.isOpen = true;
        elt = get(elt);
        this.elt = elt;
        elt.style.display = 'block';
        this.showAnimation.targets = '#' + elt.id;
        if (!isSwitch) ui.mx.bbp.show(1);
        anime(this.showAnimation);
    };

    ui.popup.hide = function () {
        this.isOpen = false;
        this.hideAnimation.targets = '#' + this.elt.id;
        if (!this.nextElt) ui.mx.bbp.hide(1);
        anime(this.hideAnimation);
    };


    ui.mx.bbp.setClickHandler(1, function () {
        ui.popup.hide();
    });

}