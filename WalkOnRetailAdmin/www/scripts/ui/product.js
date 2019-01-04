var product;
function ui_product_init() {
    product = ui.product = {
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
            HSN: get('prt_hsn'),
            Cat: get('prt_cat'),
            Subcat: get('prt_subcat')
        },
        data: {
            prtImage: '',
            prtImages: []
        },

        loadAction: null,
        saveAction: null,
        uploadAction: null,
        saveActionsChain: null,

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
            val(this.elts.Cat, data.cat || '0');
            val(this.elts.Subcat, data.subcat || '0');
        },

        save: function () {
            this.dimc.show();
            if (this.imgSlt.changed) {
                this.saveActionsChain.start(this.imgSlt.getData());
            } else {
                this.saveActionsChain.start(this.getData(), 1);
            }
        },

        getData: function () {
            var data = {
                pid: this.currentProduct,
                title: val(this.elts.Title),
                description: val(this.elts.Desc),
                stock: val(this.elts.Stock),
                price: val(this.elts.Price),
                discount_amt: val(this.elts.Discount),
                discount_type: val(this.elts.DiscountType),
                gst: val(this.elts.GST),
                hsn: val(this.elts.HSN),
                cat: val(this.elts.Cat),
                subcat: val(this.elts.Subcat),
                image: this.data.prtImage
            };
            return data;
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
        },
        uploadActionCallback: function (action) {
            if (action.status == 'OK') {
                product.data.prtImage = action.data.filename;
                product.imgSlt.release();
            } else {
                msg.show('We could not upload the image, Please check if you have internet access.');
            }
        },

        saveActionsCallback: function (chain) {
            if (chain.currentStatus == 'OK') {

                if (chain.currentStep == 'image') {
                    this.imgSlt.reset();
                    this.data.prtImage = chain.data.filename;
                    chain.doNext(this.getData());
                } else if (chain.currentStep == 'data') {
                    msg.show(txt('msg_1'));
                    this.dimc.hide();
                }

            } else {
                msg.show(txt('error_2'));
                this.dimc.hide();
            }
        },

        catChanged: function () {
            setOptions(product.elts.Subcat, dm.subcats[val(this)], '---');
        },

    };

    product.loadAction = actions.create(function (id) { dm.getProduct(id, product.loadAction); }, product.loadActionCallback);

    // ====== Save actions chain =====

    var uploadAction = fetchAction.create('image/upBase64&folder=products');
    var saveAction = fetchAction.create('product/save');

    product.saveActionsChain = actionsChain.create([uploadAction, saveAction], ['image', 'data'], null,
        function (chain) { product.saveActionsCallback(chain); });

    // ===============================


    product.elts.Cat.onchange = product.catChanged;

    dm.registerCallback(function () {
        setOptions(product.elts.Cat, dm.cats, '---');
    });

    product.imgSlt = imageSelector.init(get('prt_btn_change_img'), get('prt_image'));

    registerPage('product', product.elt, function (param) {
        if (param == 'new') return 'Add Product';
        else return 'Edit Product';
    }, function (param) { // OnNavigate updater
        product.currentProduct = param;
        product.imgSlt.reset();
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