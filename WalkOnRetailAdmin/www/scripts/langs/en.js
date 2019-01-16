var langEN = {
    error_txt1: 'We could not complete the action, Please check your internet access.',
    error_2: 'We could not save changes, Please check your internet access.',
    error_3: 'We could not load data, Please check your internet access.',
    msg_1: 'Changes was successfully saved!',
    msg_2: '{%1} was successfully deleted!',
    msg_3: '{%1} was successfully added!',
    user_created: 'User was successfully created!',
    ask_1: 'Do you really want to delete {%1}?',
    confirm_customer_delete: 'Do you really want to delete customer "{%1}" ?',
    confirm_store_delete: 'Do you really want to delete store "{%1}" ?',
    warn_store_del: 'Store "{%1}" will be permanently deleted',
    wrong_password: 'Wrong password',
    enter_password: 'Please type the password',
    valid_store_name: 'Please type a valid store name',
    store_created: 'Store was successfully created!',
    confirm_add_store: 'Do you confirm adding store with a name "{%1}" ?',

    fullname_must_be: 'The Fullname must be longer than 8 characters & shorter than 40 characters',
    username_must_be: 'The Username must be longer than 5 characters & shorter than 30 characters',

    action_confirm_reset: 'Do you really want to Reset the password for user "{%1}" ?',
    action_confirm_suspend: 'Do you really want to Suspend user "{%1}" ?',
    action_confirm_unsuspend: 'Do you really want to Unsuspend user "{%1}" ?',
    action_confirm_delete: 'Do you really want to Permanently Delete  user "{%1}" ?',

    action_progress_reset: 'Reseting',
    action_progress_suspend: 'Suspending',
    action_progress_unsuspend: 'Unsuspending',
    action_progress_delete: 'Deleting',

    msg_new_pwd: 'Here is the new password for user "{%1}" : {%2}',

    user_1: 'Master Admin',
    user_2: 'Master Sub Admin',
    user_3: 'Accountant',
    user_4: 'C R',
    user_11: 'Store Admin',
    user_12: 'Store Sub Admin',
    user_13: 'Inventory Boy',
    user_14: 'Delivery Boy'
};

function txt(textName) {
    if (langEN[textName]) {
        var text = langEN[textName];

        for (var i = 1; i < arguments.length; i++){
            text = text.replace('{%' + i + '}', arguments[i]);
        }

        return text;

    }else return '';
}