
function ui_orders_init() {
    var orders = ui.orders = {
        elt: get('page_orders')
        // Proprties

    };

    registerPage('orders', orders.elt, 'Orders');
}