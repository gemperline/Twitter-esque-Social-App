// helpers for validation
const isEmpty = (string) => {
    if (string.trim() === '') return true;
    else return false;
};

const isEmail = (email) => {
    // regular expression to validate email, could also use various JS libs 
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    if (email.match(regEx)) return true;
    else return false;
};


exports.validateRegistrationData = (data) => {
    let errors = {};

    // email validity
    if (isEmpty(data.email)) 
        errors.email = 'Cannot be empty';
    else if (!isEmail(data.email)) 
        errors.email = 'Must be a valid email address';
    
    // password validity
    if (isEmpty(data.password))
        errors.password = 'Cannot be empty';
    if (data.password !== data.confirmPassword)
        errors.confirmPassword = 'Passwords must match';
    if (isEmpty(data.handle))
        errors.handle = 'Cannot be empty';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    };
};


exports.validateLoginData = (data) => {
    let errors = {};

    // check form completeness
    if (isEmpty(data.email))
        errors.email = 'Cannot be empty';
    if (isEmpty(data.password))
        errors.password = 'Cannot be empty';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    };
};



exports.reduceUserDetails = (data) => {
    let userDetails = {};

    if (!isEmpty(data.bio.trim()))
        userDetails.bio = data.bio;

    if (!isEmpty(data.website.trim()))
    {
        // if web address does not start with 'http', add it
        if (data.website.trim().substring(0, 4) !== 'http')
        {
            userDetails.website = `http://${data.website.trim()}`;
        }
        else 
            userDetails.website = data.website;
    }

    if (!isEmpty(data.location.trim()))
        userDetails.location = data.location;

    return userDetails;
}