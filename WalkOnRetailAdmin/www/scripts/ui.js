var navHistory = [];
var pages = {};
var page_prev;
var page_current;
var param_current;

var ui = {};

function ui_init() {

    ui.voidContainer = get('void_container');

    ui.fab = get('fab');
    ui.fabIcon = get('fab_icon');

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
    categories_init();
    category_init();
    setting_init();
    users_init();
    stores_init();
    master_setting_init();
    pos_init();
    home_init();

    ui_popup_init();
    dialogs_init();

    uiis.init_components();
    BarcodeScanner_init();

    navigate('home');

    lm.onNavigate = navigate;
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
}

function addToHistory(page) {
    for (var i = 0; i < navHistory.length; i++) {
        if (navHistory[i] == page) {
            navHistory.splice(i, 1);
            break;
        }
    }
    navHistory.push(page);
}

function reloadPage() {
    if (page_current) {
        navigate(page_current.slug, param_current, false, true);
    }
}

function goBack(relaod) {
    if (navHistory.length < 1) return;
    navHistory.pop();
    navigate(navHistory.pop() || 'home', null, true, relaod);
}

function navigate(page_slug, param, isBack, forceReload) {
    var page = pages[page_slug];
    if (!page) return;

    addToHistory(page_slug);

    if (!forceReload && page_current && page_current.slug == page_slug && param == param_current) return;

    page_prev = page_current;
    page_current = page;
    param_current = param;

    if (page.updater && (!isBack || forceReload)) {
        page.updater(param);
    }

    if (page_prev) page_prev.element.style.display = 'none';

    page_current.element.style.display = 'block';

    var backButton = false;

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
