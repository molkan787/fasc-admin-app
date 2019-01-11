var category;
function category_init() {
    category = {
        elt: get('page_category'),
        elts: {
            subs: get('subcats_subs'),
            img: get('cat_img'),
            imgBtn: get('cat_img_btn')
        },

        data: {},
        currentCat: null,

        dimc: ui.dimmer.create('subcats_dimmer'),

        saveAction: null,

        imgSlt: null,

        // Methods
        update: function (param) {
            this.imgSlt.reset();
            if (param != 'new') {
                var cat = dm.getCat(param);
                this.loadCat(cat);
            } else {
                this.loadCat({});
            }
        },

        loadCat: function (data) {
            val('subcats_subs', data.text);
        }
    };

    category.saveAction = fetchAction.create('');

    category.imgSlt = imageSelector.init(category.elts.imgBtn, category.elts.img);

    registerPage('category', category.elt, 'Category details', function (param) {
        category.update(param);
    }, { icon: 'save' });
}