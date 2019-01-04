var langEN = {
    error_txt1: 'We could not complete the action',
    error_2: 'We could not save changes, Please check if you have internet access.',
    msg_1: 'Changes was successfully saved!'
};

function txt(textName) {
    if (langEN[textName])
        return langEN[textName];
    else
        return '';
}