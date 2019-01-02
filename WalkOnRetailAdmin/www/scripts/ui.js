var history = [];
var pages = {};
var page_prev;
var page_current;

var ui = {};

function ui_init() {

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

    ui_popup_init();
    dialogs_init();

    uiis.init_components();

    navigate('products');

    lm.onNavigate = navigate;
}

function registerPage(slug, element, title, updater, headbarAction) {
    pages[slug] = {
        slug: slug,
        element: element,
        title: title,
        updater: updater,
        headbarAction: headbarAction
    };
}

function navigate(page_slug, param) {
    var page = pages[page_slug];
    if (!page) return;

    if (page_current && page_current.slug == page_slug) return;

    page_prev = page_current;
    page_current = page;

    if (page.updater) {
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
}
