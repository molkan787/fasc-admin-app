var langEN = {
    error_txt1: 'We could not complete the action, Please check your internet access.',
    error_2: 'We could not save changes, Please check your internet access.',
    error_3: 'We could not load data, Please check your internet access.',
    msg_1: 'Changes was successfully saved!',
    msg_2: '{%1} was successfully deleted!'
};

function txt(textName, s1) {
    if (langEN[textName])
        return langEN[textName].replace('{%1}', s1);
    else
        return '';
}