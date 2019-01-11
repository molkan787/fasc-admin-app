var cats;
function categories_init() {
    cats = {
        elt: get('page_categories'),
        elts: {
            list: get('cats_list')
        },

        dimc: ui.dimmer.create('cats_dimmer'),

        createPanel: function (data) {
            var div = crt_elt('div');
            var img = crt_elt('img', div);
            var h3 = crt_elt('h3', div);
            var btn = crt_elt('label', div);
            var icon = crt_elt('i', btn);

            val(img, data.image);
            val(h3, data.text);
            div.className = 'cats_item';
            btn.className = 'ui label';
            icon.className = 'delete icon';

            attr(btn, 'cancelclick', '1');
            attr(icon, 'cancelclick', '1');
            attr(div, 'cat_id', data.id);
            div.onclick = this.panelClick;

            this.elts.list.appendChild(div);
        },
        
        update: function () {
            this.loadCats(dm.cats);
        },

        loadCats: function (data) {
            val(this.elts.list, '');
            for (var i = 0; i < data.length; i++) {
                this.createPanel(data[i]);
            }
        },

        // Handlers
        panelClick: function (e) {
            if (attr(e.srcElement, 'cancelclick')) return;
            navigate('category', attr(this, 'cat_id'));
        }
    };


    registerPage('categories', cats.elt, 'Categories', function () {
        cats.update();
    });

}