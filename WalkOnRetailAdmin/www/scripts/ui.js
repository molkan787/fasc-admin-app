﻿var navHistory = [];
var pages = {};
var page_prev;
var page_current;
var param_current;

var ui = {};

function ui_init() {

    ui.voidContainer = get('void_container');

    ui.fab = get('fab');
    ui.fabIcon = get('fab_icon');

    pdr_init();
    uiu_init();
    uiis_init();
    ui_fasc_init();
    mx_init();
    leftmenu_init();
    header_init();
    ui_products_init();
    ui_product_init();
    ui_orders_init();
    ui_order_init();
    ui_customers_init();
    banners_init();
    banner_init();
    categories_init();
    category_init();
    setting_init();
    users_init();
    stores_init();
    master_setting_init();
    pos_init();
    home_init();
    account_init();
    ls_init();
    promos_init();
    promo_init();

    ui_popup_init();
    dialogs_init();

    uiis.init_components();
    BarcodeScanner_init();

    lm.onNavigate = navigate;

    //PullToRefresh.init({
    //    mainElement: '#header',
    //    onRefresh: function () {
    //        log('Refreshig');
    //    }
    //});
}

function registerPage(slug, element, title, updater, headbarAction, fab) {
    pages[slug] = {
        slug: slug,
        element: element,
        title: title,
        updater: updater,
        headbarAction: headbarAction,
        fab: fab
    };
    pdr.addElement(element);
}

function addToHistory(page, param) {
    navHistory.push({ slug: page, param: param});
}

function reloadPage(newParam) {
    var param = (typeof newParam != 'undefined') ? newParam : param_current;
    if (page_current) {
        if (navHistory.length > 0) {
            navHistory.pop();
        }
        navigate(page_current.slug, param, false, true);
    }
}

var forceReload = false;
function goBack(reload) {
    if (navHistory.length < 1) return;
    navHistory.pop();
    var page = navHistory.pop();
    if (page.slug == 'category') reload = true;
    navigate(page.slug || 'home', page.param, true, reload || forceReload);
    forceReload = false;
}

function navigate(page_slug, param, isBack, forceReload) {
    if (page_slug == 'logout') {
        confirmLogout();
        return;
    }
    var page = pages[page_slug];
    if (!page) return;

    addToHistory(page_slug, param);
    
    if (!forceReload && page_current && page_current.slug == page_slug && param == param_current) return;

    page_prev = page_current;
    page_current = page;
    param_current = param;

    if (page.updater && (!isBack || forceReload)) {
        page.updater(param);
    }

    if (page_prev) page_prev.element.style.display = 'none';

    page_current.element.style.display = 'block';

    var backButton = (attr(page.element, 'rbb') == '1');

    if (typeof page.title == 'string') {
        val(ui.title, page.title);
    } else if (typeof page.title == 'function') {

        var data = page.title(param);
        if (typeof data == 'string') {
            val(ui.title, data);
        } else if (typeof data == 'object') {
            val(ui.title, data.title);
            if (data.backButton) {
                backButton = true;
            }
        }

    } else {
        val(ui.title, '');
    }

    ui.hb.setButton(backButton ? 'back' : 'menu');
    ui.hb.setActionIcon(page.headbarAction);

    if (page.fab) {
        ui.fabIcon.className = 'icon ' + page.fab.icon;
        ui.fab.onclick = page.fab.handler;
        ui.fab.style.display = 'block';
    } else {
        ui.fab.style.display = 'none';
    }
}

function confirmLogout() {
    msg.confirm(txt('confirm_logout'), function (answer) {
        if (answer == 'yes') {
            dm.setToken('');
            ls.show();
        }
    });
}

function ui_device_backBtn_click() {
    goBack();
}