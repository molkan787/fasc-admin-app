
function ui_product_init() {
    var product = ui.product = {
        elt: get('page_product'),
        elts: {
            ID: get('prt_id'),
            Title: get('prt_title'),
            Desc: get('prt_description'),
            Stock: get('prt_stock'),
            Image: get('prt_image'),
            Price: get('prt_price'),
            Discount: get('prt_discount'),
            DiscountType: get('prt_discount_type'),
            GST: get('prt_gst'),
            HSN: get('prt_hsn')
        },
        loadAction: null,
        saveAction: null,

        dimc: ui.dimmer.create('prt_dimmer'),

        // Methods
        load: function (data) {
            if (typeof data == 'string') {
                data = { product_id: data };
            }
            val(this.elts.ID, data.product_id);
            val(this.elts.Title, data.title || '');
            val(this.elts.Desc, data.description || '');
            val(this.elts.Stock, data.stock || '');
            val(this.elts.Image, data.image || '');
            val(this.elts.Price, ui.fasc.formatPrice(data.price || '', true));
            val(this.elts.Discount, data.discount_amt || '');
            val(this.elts.DiscountType, data.discount_type);
            val(this.elts.GST, data.gst || '');
            val(this.elts.HSN, data.hsn || '');
        },

        save: function () {
            var data = {
                pid: this.currentProduct,
                title: val(this.elts.Title),
                description: val(this.elts.Desc),
                stock: val(this.elts.Stock),
                price: val(this.elts.Price),
                discount_amt: val(this.elts.Discount),
                discount_type: val(this.elts.DiscountType),
                gst: val(this.elts.GST),
                hsn: val(this.elts.HSN)
            };
            this.dimc.show();
            this.saveAction.do(data);
        },

        // Handlers
        loadActionCallback: function (action) {
            if (action.status == 'OK') {
                product.load(action.data);
            } else {
                log(action.error);
                msg.show('We could not retrieve data, Please check if you have internet access.');
            }
            ui.product.dimc.hide();
        },
        saveActionCallback: function (action) {
            //log(action.error);
            if (action.status == 'OK') {
                msg.show('Changes was successfully saved!');
            } else {
                msg.show('We could not save changes, Please check if you have internet access.');
            }
            ui.product.dimc.hide();
        }
    };

    product.loadAction = actions.create(function (id) { dm.getProduct(id, product.loadAction); }, product.loadActionCallback);
    product.saveAction = actions.create(function (data) { dm.saveProduct(data, product.saveAction); }, product.saveActionCallback);

    registerPage('product', product.elt, function (param) {
        if (param == 'new') return 'Add Product';
        else return 'Edit Product';
    }, function (param) { // OnNavigate updater
        ui.product.currentProduct = param;
        if (param == 'new') {
            ui.product.load(param)
        }else {
            ui.product.dimc.show();
            product.loadAction.do(param);
        }
    },  {
        icon: 'save',
        handler: function () {
            ui.product.save();
        }
    });
}