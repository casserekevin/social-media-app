const isEmail = (email) => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(regEx)) {
        return true;
    }
    return false;
  };
  
const isEmpty = (string) => {
    if (string.trim() === '') {
        return true;
    }
    return false;
};

const hasHttpString = (website) => {
    if (website.trim().substring(0, 4) === 'http') {
        return true;
    }
    return false;
};

//TODO: Validate users
exports.validateSignupData = (data) => {
    let errors = {}
    //email
    if(isEmpty(data.email)) errors.email = 'Must not be empty'
    else if(!isEmail(data.email)) errors.email = 'Must be a valid email address'
    
    //password
    if(isEmpty(data.password)) errors.password = 'Must not be empty'

    //confirmPassword
    if(data.password !== data.confirmPassword) errors.confirmPassword = 'passwords must be equal'
    
    //handle
    if(isEmpty(data.handle)) errors.handle = 'Must not be empty'

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
}

exports.validateLoginData = (data) => {
    let errors = {}
    //email
    if(isEmpty(data.email)) errors.email = 'Must not be empty'
    else if(!isEmail(data.email)) errors.email = 'Must be a valid email address'
    
    //password
    if(isEmpty(data.password)) errors.password = 'Must not be empty'

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
}

exports.reduceUserDetails = (data) => {
    let userDetails = {}

    if(!isEmpty(data.bio)) userDetails.bio = data.bio
    if(!isEmpty(data.website)) {
        if(!hasHttpString(data.website)){
            userDetails.website = `http://${data.website}`
        }
        else userDetails.website = data.website
    }
    if(!isEmpty(data.location)) userDetails.location = data.location

    return {
        userDetails,
        valid: Object.keys(userDetails).length !== 0 ? true : false
    }
}




//TODO: Validate screams
exports.validatePostOneScreamData = (data) => {
    let errors = {}
    //body
    if(isEmpty(data.body)) errors.body = 'Must not be empty'

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
}