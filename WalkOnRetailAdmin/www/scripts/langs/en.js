var langEN = {
    error_txt1: 'We could not complete the action'
};

function txt(textName) {
    if (langEN[textName])
        return langEN[textName];
    else
        return '';
}