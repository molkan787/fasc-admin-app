﻿var filtersController = {};
var imageSelector = {};
var cesl = {};
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
        create: function (elt_id, createIt) {
            if (createIt) {
                var elt = crt_elt('div', get(elt_id));
                var sub = crt_elt('div', elt);
                elt.className = 'ui active inverted dimmer';
                elt.style.display = 'none';
                sub.className = 'ui text loader';
            } else {
                var elt = get(elt_id);
            }
            var dimc = {
                elt: elt,
                visibile: false,
                show: function (text) {
                    var txt = (typeof text == 'undefined') ? 'Loading' : text;
                    this.visibile = true;
                    this.elt.style.display = 'block';
                    var txt_div = this.elt.children[0];
                    if (txt_div) val(txt_div, txt);
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
            isLocked: false,
            uiParent: get(uiParent),
            changedCallback: changedCallback,
            //removedCallback: removedCallback,
            uiElts: [],
            filters: (typeof filtersArray != 'undefined' ? filtersArray : [])
        };

        fc.lock = function () {
            this.isLocked = true;
        };
        fc.unlock = function (call) {
            this.isLocked = false;
            if (call && this.changedCallback) {
                this.changedCallback(this);
            }
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
            if (fc.changedCallback && !this.isLocked) {
                fc.changedCallback();
            }
        };

        fc.setFilter = function (filter) {
            this.removeFilter(filter.name);
            if (!filter.value) {
                if (this.changedCallback && !this.isLocked) {
                    this.changedCallback();
                }
                return;
            }
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

            if (this.changedCallback && !this.isLocked) {
                this.changedCallback();
            }
        }

        fc.clear = function (doNotCall) {
            this.filters.length = 0;
            this.uiParent.innerHTML = '';
            if (!doNotCall && !this.isLocked && this.changedCallback) {
                this.changedCallback();
            }
        };

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
                this.changed = false;
                if (this.autoRelease) {
                    return this.imgElt.src;
                } else {
                    return this.data;
                }
            },

            reset: function () {
                this.changed = false;
                //uiu.removeElt(this.inpElt);
                this.inpElt = crt_elt('input', ui.voidContainer);
                attr(this.inpElt, 'type', 'file');
                var _this = this;
                this.inpElt.onchange = function () {
                    _this.update();
                };
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

    contextMenu = {
        elt: get('menu_popup'),
        eltTitle: get('menu_popup_title'),
        eltList: get('menu_popup_list'),
        show: function (title, items, callback) {
            this.callback = callback;
            var height = items.length * 40 + 80;
            this.elt.style.height = height + 'px';
            this.elt.style.marginTop = '-' + (height / 2) + 'px';
            val(this.eltTitle, title);
            val(this.eltList, '');
            for (var i = 0; i < items.length; i++) {
                var div = crt_elt('div', this.eltList);
                val(div, items[i].text);
                attr(div, 'action', items[i].action);
                attr(div, 'nah', items[i].noAutoHide ? '1' : '0');
                div.onclick = this.itemClick;
            }
            ui.popup.show(this.elt);
        },

        itemClick: function () {
            if (attr(this, 'nah') != '1') ui.popup.hide();
            var action = attr(this, 'action');
            if (contextMenu.callback) {
                contextMenu.callback(action);
            }
        }
    };

    // =============================

    cesl.init = function (parent, options, onChangeHandler) {
        //var _opts = options || {};
        var _cesl = {
            visibile: false,
            checkboxes: null,
            checked: [],

            onChange: onChangeHandler,
            parent: parent,
            itemTag: 'div',
            unActiveClass: '',
            unCheckedClass: 'cb circle outline icon',
            checkedClass: 'cb check circle icon',

            checkEltTag: 'i',
            checkEltIndex: 0,

            activationEltTag: 'img',
            activationEltIndex: 0,

            initHandlers: function () {
                var _this = this;
                var items = get_bt(this.itemTag, this.parent);
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    var ref = attr(item, 'cesl-ref');
                    var activator = get_bt(this.activationEltTag, item)[this.activationEltIndex];
                    var checkbox = get_bt(this.checkEltTag, item)[this.checkEltIndex];
                    attr(activator, 'cesl-ref', ref);
                    attr(checkbox, 'cesl-ref', ref);
                    attr(activator, 'data-long-press-delay', 300);
                    activator.addEventListener('long-press', function (e) {
                        _this.activatorPress(e);
                    });
                    checkbox.onclick = activator.onclick = function () {
                        _this.switchState(_this.checkboxes[attr(this, 'cesl-ref')]);
                    };
                    this.checkboxes[ref] = checkbox;
                }
            },

            showCheckBoxes: function (cbToCheck) {
                var checkAll = (typeof cbToCheck == 'boolean' & cbToCheck);
                var _c = checkAll ? this.checkedClass : this.unCheckedClass;
                for (var cb in this.checkboxes) {
                    if (!this.checkboxes.hasOwnProperty(cb)) return;
                    var item = this.checkboxes[cb];
                    item.className = _c;
                    if (checkAll) {
                        this.switchState(item, true);
                    }
                }
                if (!checkAll) {
                    this.switchState(this.checkboxes[cbToCheck], true);
                }
            },

            switchState: function (cb, state) {
                var forceState = (typeof state == 'boolean');
                if (!this.visibile) return;
                var ref = attr(cb, 'cesl-ref');
                var checked = forceState ? !state : (attr(cb, 'cesl-checked') == '1');
                attr(cb, 'cesl-checked', checked ? '0' : '1');
                cb.className = checked ? this.unCheckedClass : this.checkedClass;
                checked ? this.removeFromChecked(ref) : this.addToChecked(ref);

                this.raiseOnChangeEvent();
            },

            addToChecked: function (ref) {
                this.checked.push(ref);
            },

            removeFromChecked: function (ref) {
                for (var i = 0; i < this.checked.length; i++) {
                    if (this.checked[i] === ref) {
                        this.checked.splice(i, 1);
                        break;
                    }
                }
            },

            raiseOnChangeEvent: function () {
                if (this.onChange) {
                    this.onChange(this, this.checked.length);
                }
            },

            // Handlers
            activatorPress: function (e) {
                var ref = attr(e.target, 'cesl-ref');
                if (!this.visibile) {
                    this.visibile = true;
                    this.showCheckBoxes(ref);
                }
            },

            // Public Methods
            refresh: function () {
                this.visibile = false;
                this.checkboxes = {};
                this.checked = [];
                this.initHandlers();
            },

            checkAll: function () {
                this.visibile = true;
                this.showCheckBoxes(true);
            }
        };
        _cesl.refresh();
        return _cesl;
    };
}