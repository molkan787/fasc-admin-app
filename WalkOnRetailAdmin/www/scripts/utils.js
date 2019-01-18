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

function attr_rm(elt, attr_name) {
    elt.removeAttribute(attr_name);
}

function class_rm(elt, className) {
    var _class = elt.className;
    _class = _class.replace(className, '');
    if (elt.className != _class)
        elt.className = _class;
}

function class_add(elt, className) {
    if (elt.className.indexOf(className) == -1) {
        elt.className = (elt.className + ' ' + className).replace('  ', ' ');
    }
}

function get(element_id) {
    if (typeof element_id == 'object') return element_id;
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

function setOptions(parent, options, incAll, textProp, valueProp) {
    parent.innerHTML = '';

    var p_t = (typeof textProp == 'undefined') ? 'text' : textProp;
    var p_v = (typeof valueProp == 'undefined') ? 'id' : valueProp;
    
    if (options) {
        attr_rm(parent, 'disabled');
    } else {
        attr(parent, 'disabled', true);
        return;
    }

    if (typeof incAll != 'undefined') {
        var opt = crt_elt('option');
        opt.value = '';
        if (typeof incAll == 'boolean' && incAll)
        { val(opt, 'All'); parent.appendChild(opt); }
        else if (typeof incAll != 'boolean')
        { val(opt, incAll); parent.appendChild(opt); }
    }

    for (var i = 0; i < options.length; i++) {
        var opt = crt_elt('option', parent);
        val(opt, options[i][p_t]);
        opt.value = options[i][p_v];
    }
    parent.selectedIndex = 0;
}

function getSelectedText(elt) {
    elt = get(elt);
    if (elt.selectedIndex == -1)
        return null;
    return elt.options[elt.selectedIndex].text;
}

function getIndexInParent(elt) {
    return Array.prototype.slice.call(elt.parentNode.children).indexOf(elt);
}

function insertNodeAsFirst(elt, parent) {
    if (parent.children.length) {
        parent.insertBefore(elt, parent.firstChild);
    } else {
        parent.appendChild(elt);
    }
}

function swapHtmlElts(elt1, elt2) {
    elt2.parentNode.removeChild(elt2);
    elt1.parentNode.insertBefore(elt2, elt1);
}

function moveEltToBot(elt) {
    elt.parentNode.appendChild(elt.parentNode.removeChild(elt));
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

function httpPostText(theUrl, text, callback, failcallback) {
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
    xmlHttp.open("POST", theUrl, true);
    xmlHttp.addEventListener("error", failcallback);
    xmlHttp.send(text);
}

function getBase64(file, callback, failCallback) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        callback(reader.result);
    };
    reader.onerror = function (error) {
        if (failCallback)
            failCallback(error);
    };
}