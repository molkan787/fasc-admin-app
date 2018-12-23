
function crt_elt(tagname, parent) {
    var elt = document.createElement(tagname);
    if (parent) {
        parent.appendChild(elt);
    }
    return elt;
}

function style(elt, styles) {
    for (var p in styles) {
        if (styles.hasOwnProperty(p)) {
            elt.style[p] = styles[p];
        }
    }
}