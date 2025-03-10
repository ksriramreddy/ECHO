import {toast} from 'react-hot-toast'


export  function formValidation(formData){
    let isValid = true;

    const {fullName, userName, email, password} = formData;
    if(!email){
      toast.error(`Invalid email`)
      isValid = false;
    }
    if(!fullName){
      toast.error(`Full name is required`)
      isValid = false;
    }
    if(!userName){
      toast.error(`Username is required`)
      isValid = false;
    }

    if (/\s/.test(userName)) {
        toast.error(" Username cannot contain spaces.");
        isValid = false;
    }

    if (/^\d/.test(userName)) {
        toast.error(" Username cannot start with a digit.");
        isValid = false;
    }

    if (!/^[A-Za-z0-9_]+$/.test(userName)) {
        toast.error(" Username can only contain letters, numbers, and underscores.");
        isValid = false;
    }

    if (userName.length < 3 || userName.length > 20) {
        toast.error(" Username must be between 3 to 20 characters long.");
        isValid = false;
    }

    if(!password){
      toast.error(`Password is required`)
      isValid = false;
    }
    if(password.length < 6){
      toast.error(`Password must be atleast 6 characters long`)
      isValid = false;
    }
    return isValid;
  }