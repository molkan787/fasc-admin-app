var msg;
function dialogs_init() {
    msg = {
        show: function (text) {
            alert(text);
        },

        confirm: function (text, callback) {
            setTimeout(function () {
                callback(confirm(text) ? 'yes' : 'no');
            }, 0);
        }
    };
}