var filtersController = {};
var imageSelector = {};
function mx_init() {
    ui.mx = {};

    // ============ BBP ============
    ui.mx.bbp = {
        panels: get_bc('bbp'),
        _show_anim: {
            targets: '',
            opacity: 0.7,
            easing: 'easeOutExpo',
            duration: 700
        },
        _hide_anim: {
            targets: '',
            opacity: 0,
            easing: 'easeOutExpo',
            duration: 500
        },

        show: function (panel) {
            this.panels[panel].style.display = 'block';
            this._show_anim.targets = '#' + this.panels[panel].id;
            anime(this._show_anim);
        },

        hide: function (panel) {
            var elt = this.panels[panel];
            this._hide_anim.panel = panel;
            this._hide_anim.targets = '#' + elt.id;
            this._hide_anim.complete = function () {
                elt.style.display = 'none';
            };
            anime(this._hide_anim);
        },

        setClickHandler: function (panel, handler) {
            this.panels[panel].onclick = handler;
        }
    };
    // =============================

    // ========== Dimmer ===========

    ui.dimmer = {
        create: function (elt_id) {
            var dimc = {
                elt: get(elt_id),
                visibile: false,
                show: function () {
                    this.visibile = true;
                    this.elt.style.display = 'block';
                },
                hide: function () {
                    this.visibile = false;
                    this.elt.style.display = 'none';
                }
            };
            return dimc;
        }
    };

    // =============================


    // ========== Filter ===========
    filtersController.idPtr = 100;
    filtersController.create = function (uiParent, changedCallback, filtersArray) {
        var fc = {
            id: filtersController.idPtr++,
            uiParent: get(uiParent),
            changedCallback: changedCallback,
            //removedCallback: removedCallback,
            uiElts: [],
            filters: (typeof filtersArray != 'undefined' ? filtersArray : [])
        };

        fc.getValue = function (filterName) {
            for (var i = 0; i < this.filters.length; i++) {
                if (this.filters[i].name == filterName) {
                    return this.filters[i].value;
                }
            }
            return '';
        };

        fc.removeFilter = function (name) {
            for (var i = 0; i < this.filters.length; i++) {
                var filter = this.filters[i];
                if (filter.name == name) {
                    uiu.removeElt('fc_' + this.id + filter.name + filter.value);
                    this.filters.splice(i, 1);
                    break;
                }
            }
        }

        fc.removeClickHandler = function () {
            var filterName = attr(this, 'fname');
            fc.removeFilter(filterName);
            if (fc.removedCallback) {
                fc.removedCallback(filterName);
            }
            if (fc.changedCallback) {
                fc.changedCallback();
            }
        };

        fc.setFilter = function (filter) {
            this.removeFilter(filter.name);
            if (!filter.value) return;
            this.filters.push(filter);

            var label = crt_elt('label');
            val(label, filter.text);
            var icon = crt_elt('i', label);
            label.className = 'ui label';
            icon.className = 'delete icon';

            label.id = 'fc_' + this.id + filter.name + filter.value;
            attr(icon, 'fname', filter.name);

            icon.onclick = this.removeClickHandler;

            this.uiParent.appendChild(label);

            if (this.changedCallback) {
                this.changedCallback();
            }
        }
        return fc;
    };

    // =============================


    // ====== Image Selector =======

    imageSelector.init = function (btnElt, imgElt, callback, autoRelease) {
        var imgslc = {
            inpElt: crt_elt('input', ui.voidContainer),
            btnElt: btnElt,
            imgElt: imgElt,
            callback: callback,
            autoRelease: (typeof autoRelease == 'boolean' ? autoRelease : true),

            changed: false,

            update: function () {
                if (this.inpElt.files.length == 0) return;
                if (this.imgElt) this.imgElt.src = 'images/spinner.gif';
                var _this = this;
                getBase64(this.inpElt.files[0], function (data) {
                    _this.changed = true;
                    if (_this.autoRelease) {
                        _this.imgElt.src = data;
                    } else {
                        _this.data = data;
                    }
                    if (_this.callback) {
                        _this.callback(data);
                    }
                });
            },

            release: function () {
                this.imgElt.src = this.data;
            },

            getData: function () {
                if (this.autoRelease) {
                    return this.imgElt.src;
                } else {
                    return this.data;
                }
            },

            reset: function () {
                this.changed = false;
            }
        };

        attr(imgslc.inpElt, 'type', 'file');
        imgslc.inpElt.onchange = function () {
            imgslc.update();
        };
        btnElt.onclick = function () {
            imgslc.inpElt.click();
        };

        return imgslc;
    };

    // =============================
}