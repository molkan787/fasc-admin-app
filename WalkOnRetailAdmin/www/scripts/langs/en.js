var langEN = {
    error_txt1: 'We could not complete the action, Please check your internet access.',
    error_2: 'We could not save changes, Please check your internet access.',
    error_3: 'We could not load data, Please check your internet access.',
    msg_1: 'Changes was successfully saved!',
    msg_2: '{%1} was successfully deleted!',
    msg_3: '{%1} was successfully added!',
    ask_1: 'Do you really want to delete {%1}?',
    confirm_customer_delete: 'Do you really want to delete customer "{%1}" ?',
    confirm_store_delete: 'Do you really want to delete store "{%1}" ?',
    warn_store_del: 'Store "{%1}" will be permanently deleted',
    wrong_password: 'Wrong password',
    enter_password: 'Please type the password',
    valid_store_name: 'Please type a valid store name',
    store_created: 'Store was successfully created!',
    confirm_add_store: 'Do you confirm adding store with a name "{%1}" ?'
};

function txt(textName, s1) {
    if (langEN[textName])
        return langEN[textName].replace('{%1}', s1);
    else
        return '';
}