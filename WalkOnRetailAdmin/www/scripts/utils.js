//window.log = function (log_content) {
//    console.log(log_content);
//};
window.log = console.log;
function crt_elt(tagname, parent, id) {
    var elt = document.createElement(tagname);
    if (parent) {
        if (typeof parent == 'string') {
            elt.id = parent;
        } else {
            parent.appendChild(elt);
        }
    }
    if (id) {
        elt.id = id;
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

function val(elt, value) {
    if (typeof elt == 'string') elt = get(elt);
    var p = get_primary_val_property(elt);

    if (typeof value != 'undefined') {
        elt[p] = value;
    }
    return elt[p];
}

function attr(elt, attr_name, value) {
    if (value) {
        elt.setAttribute(attr_name, value);
    }
    return elt.getAttribute(attr_name);
}

function class_rm(elt, className) {
    var _class = elt.className;
    _class = _class.replace(className, '');
    elt.className = _class;
}

function class_add(elt, className) {
    elt.className = (elt.className + ' ' + className).replace('  ', ' ');
}

function get(element_id) {
    return document.getElementById(element_id);
}

function get_bc(class_name, parent) {
    if (typeof parent == 'undefined') parent = document;
    return parent.getElementsByClassName(class_name);
}

function get_bt(tag_name, parent) {
    if (typeof parent == 'undefined') parent = document;
    return parent.getElementsByTagName(tag_name);
}

function get_primary_val_property(elt) {
    var tn = elt.tagName;
    if (tn == 'INPUT' || tn == 'SELECT' || tn == 'TEXTAREA')
        return 'value';
    else if (tn == 'IMG')
        return 'src';
    else
        return 'innerHTML';
}

function foreach(arr, func) {
    var l = arr.length;
    for (var i = 0; i < l; i++) {
        if (func(arr[i])) {
            break;
        }
    }
}



function httpGetAsync(theUrl, callback, failcallback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
        else if (xmlHttp.status === 404)
            if (failcallback) {
                failcallback();
                failcallback = null;
            }
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.addEventListener("error", failcallback);
    xmlHttp.send(null);
}