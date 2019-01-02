﻿var filtersController = {};
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
                show: function () {
                    this.elt.style.display = 'block';
                },
                hide: function () {
                    this.elt.style.display = 'none';
                }
            };
            return dimc;
        }
    };

    // =============================


    // ========== Filter ===========
    filtersController.idPtr = 100;
    filtersController.create = function (uiParent, options) {
        var fc = { id: filtersController.idPtr++, uiParent: uiParent, uiElts: [], filters: [] };

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

        fc.setFilter = function (filter) {
            this.filters.push(filter);

            var label = crt_elt('label');
            val(label, filter.text);
            var icon = crt_elt('i', label);
            label.className = 'ui label';
            icon.className = 'delete icon';

            label.id = 'fc_' + this.id + filter.name + filter.value;
            this.uiParent.appendChild(label);
        }
    };

    // =============================
}