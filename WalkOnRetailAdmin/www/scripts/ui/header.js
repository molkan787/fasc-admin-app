
function header_init() {
    ui.title = get('title');

    get('header_menu_img').onclick = function () {
        lm.open();
    }
}