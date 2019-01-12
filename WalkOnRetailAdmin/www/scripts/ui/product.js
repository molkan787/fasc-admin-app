var product;
function ui_product_init() {
    product = ui.product = {
        elt: get('page_product'),
        elts: {
            Lang: get('prt_lang'),
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
            Subcat: get('prt_subcat'),
            Images: get('prt_images'),
            AddImageBtn: get('prt_add_image_btn')
        },
        data: {
            prtImage: '',
            prtOldImages: null,
            prtNewImages: null,
            desc: null,
            lang: '1'
        },

        loadAction: null,
        saveAction: null,
        uploadAction: null,
        saveActionsChain: null,

        dimc: ui.dimmer.create('prt_dimmer'),

        // UI methods

        createImageBlock: function (imgUrl, imgId) {
            var div = crt_elt('div');
            var img = crt_elt('img', div);
            var btn = crt_elt('button', div);
            div.className = 'prt_image_item';
            btn.className = 'ui tiny button';
            val(img, imgUrl);
            val(btn, 'Remove');
            attr(div, 'state', 'enabled');
            if (typeof imgId != 'undefined') {
                attr(div, 'imgid', imgId);
            }

            btn.onclick = this.toggleImageState;

            this.elts.Images.appendChild(div);
        },
        toggleImageState: function () {
            var par = this.parentNode;
            var state = attr(par, 'state');
            if (state == 'enabled') {
                attr(par, 'state', 'disabled');
                class_add(par, 'disabled');
                val(this, 'Undo');
            } else {
                attr(par, 'state', 'enabled');
                class_rm(par, 'disabled');
                val(this, 'Remove');
            }
        },

        // Methods
        load: function (data) {
            if (typeof data == 'string') {
                data = { product_id: data, d: { 1: {}, 2: {} } };
            }
            this.data.desc = data.d;
            this.data.lang = '1';
            val(this.elts.Lang, 1);
            val(this.elts.ID, data.product_id);
            val(this.elts.Stock, data.stock || '');
            val(this.elts.Image, data.image || 'images/document_blank.png');
            val(this.elts.Price, ui.fasc.formatPrice(data.price || 0, true));
            val(this.elts.Discount, data.discount_amt || '');
            val(this.elts.DiscountType, data.discount_type);
            val(this.elts.GST, data.gst || '');
            val(this.elts.HSN, data.hsn || '');
            val(this.elts.Cat, data.cat || '0');
            val(this.elts.Subcat, data.subcat || '0');
            val(this.elts.Images, '');
            val(this.elts.Title, data.d[1].name || '');
            val(this.elts.Desc, data.d[1].description || '');

            this.elts.Images.appendChild(this.elts.AddImageBtn);
            var _this = this;
            if (data.images) {
                foreach(data.images, function (item) {
                    _this.createImageBlock(item.image, item.product_image_id);
                });
            }
        },

        save: function () {
            this.dimc.show('Saving');

            this.data.prtOldImages = [];
            this.data.prtNewImages = [];
            this.data.uploadQueue = [];
            var imgElts = get_bc('prt_image_item', this.elts.Images);
            for (var i = 0; i < imgElts.length; i++) {
                var elt = imgElts[i];
                if (attr(elt, 'state') == 'enabled') {
                    var imgId = attr(elt, 'imgid');
                    if (imgId) this.data.prtOldImages.push(imgId);
                    else this.data.uploadQueue.push(get_bt('img', elt)[0].src);
                }
            }


            if (this.imgSlt.changed) {
                this.saveActionsChain.start(this.imgSlt.getData());
            } else if (this.data.uploadQueue.length > 0) {
                this.saveActionsChain.start(this.data.uploadQueue.shift(), 1);
            } else {
                this.saveActionsChain.start(this.getData(), 2);
            }
        },

        getData: function () {
            this.data.desc[this.data.lang].name = val(this.elts.Title);
            this.data.desc[this.data.lang].description = val(this.elts.Desc);
            var data = {
                pid: this.currentProduct,
                desc: JSON.stringify(this.data.desc),
                stock: val(this.elts.Stock),
                price: val(this.elts.Price),
                discount_amt: val(this.elts.Discount),
                discount_type: val(this.elts.DiscountType),
                gst: val(this.elts.GST),
                hsn: val(this.elts.HSN),
                cat: val(this.elts.Cat),
                subcat: val(this.elts.Subcat),
                image: this.data.prtImage,
                images_to_keep: this.data.prtOldImages,
                images_to_add: this.data.prtNewImages
            };
            return data;
        },

        switchLanguage: function (lang) {
            this.data.desc[this.data.lang].name = val(this.elts.Title);
            this.data.desc[this.data.lang].description = val(this.elts.Desc);
            val(this.elts.Title, this.data.desc[lang].name);
            val(this.elts.Desc, this.data.desc[lang].description);
            this.data.lang = lang;
        },

        // Handlers
        loadActionCallback: function (action) {
            if (action.status == 'OK') {
                product.load(action.data);
            } else {
                msg.show('We could not retrieve data, Please check if you have internet access.');
                goBack();
            }
            ui.product.dimc.hide();
        },

        saveActionsCallback: function (chain) {
            if (chain.currentStatus == 'OK') {

                if (chain.currentStep == 'image') {
                    this.imgSlt.reset();
                    this.data.prtImage = chain.data.filename;
                    if (this.data.uploadQueue.length > 0) {
                        chain.doNext(this.data.uploadQueue.shift());
                    } else {
                        chain.skipNext();
                        chain.doNext(this.getData());
                    }
                } else if (chain.currentStep == 'images') {
                    this.data.prtNewImages.push(chain.data.filename);
                    if (this.data.uploadQueue.length > 0) {
                        chain.redo(this.data.uploadQueue.shift());
                    } else {
                        chain.doNext(this.getData())
                    }
                } else if (chain.currentStep == 'data') {
                    msg.show(txt('msg_1'));
                    this.dimc.hide();
                    goBack();
                }

            } else {
                msg.show(txt('error_2'));
                this.dimc.hide();
            }
        },

        catChanged: function () {
            setOptions(product.elts.Subcat, dm.subcats[val(this)], '---');
        },

        imageAdded: function (imageData) {
            product.createImageBlock(imageData);
        },

        langChanged: function () {
            product.switchLanguage(this.value);
        }

    };

    product.loadAction = actions.create(function (id) { dm.getProduct(id, product.loadAction); }, product.loadActionCallback);

    // ====== Save actions chain =====

    var uploadAction = fetchAction.create('image/upBase64&folder=products');
    var saveAction = fetchAction.create('product/save');

    product.saveActionsChain = actionsChain.create([uploadAction, uploadAction, saveAction], ['image', 'images', 'data'], null,
        function (chain) { product.saveActionsCallback(chain); });

    // ===============================


    product.elts.Cat.onchange = product.catChanged;
    product.elts.Lang.onchange = product.langChanged;

    dm.registerCallback(function () {
        setOptions(product.elts.Cat, dm.cats, '---');
    });

    product.imgSlt = imageSelector.init(get('prt_btn_change_img'), get('prt_image'));

    imageSelector.init(product.elts.AddImageBtn, null, product.imageAdded, false);

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