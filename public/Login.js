
function setFormMessage(formElement, type, message) {
    const messageElement = formElement.querySelector(".form__message");

    messageElement.textContent = message;
    messageElement.classList.remove("form__message--success", "form__message--error", "form--hidden");
    messageElement.classList.add(`form__message--${type}`);
}




document.addEventListener("DOMContentLoaded", () => {
    const logIn = document.querySelector("#LogIn");
    const both = document.querySelectorAll('.btn');
    let clickedButton = "";
    let LogIN_test = false;
    let SignUp_test = false;
    

    both.forEach(bt => {
        bt.addEventListener('mousedown', (a) => {
            clickedButton = a.target.innerHTML;
            console.log(clickedButton);
            if(clickedButton == "Login") {
                console.log("Logging in");
                LogIN_test = true;
                SignUp_test = false;
            } else { 
                console.log("Signing up");
                LogIN_test = false;
                SignUp_test = true;
                
            }
        });
    });

    logIn.addEventListener("submit", e => {
        e.preventDefault();
    

        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;
        var lower = false;
        var upper = false;
        var special = false;
        var number = false;
        var specials = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?~]/;
        var xhr = new XMLHttpRequest();

        if(password.length >= 8){
            for(let i = 0; i < password.length; i++){
                if(password.charAt(i) == password.charAt(i).toLowerCase()){
                    lower = true;
                }
                if(password.charAt(i) == password.charAt(i).toUpperCase()){
                    upper = true;
                }
                if(password.charAt(i) >= 0 && password.charAt(i) <= 9){
                    number = true;
                }
                if(specials.test(password)){
                    special = true;
                }
            }
        }

        if (username.length >= 4 && username.split("_").length === 2) {
            setFormMessage(logIn, "success", "Valid Username and password");

            if (!(lower && upper && number && special)){
            setFormMessage(logIn, "error", "Invalid password, does not meet requirements.");    
            } 
            else {
                //Password passes requirement checks
                setFormMessage(logIn, "success", "");
                if (LogIN_test == true && SignUp_test == false) {
                    const userData = { username:username, password:password }
                
                $.post('/login', userData, (response) => {
                    if (response.success) {
                        //redirect to mainpage upon successful login
                        window.location.href = '/mainpage';
                    }
                    else if (response.message === "User does not exist") {
                            //User not found send error
                            setFormMessage(logIn, 'error', "User does not exist");
                        }
                    else {if (response.message.startsWith('Incorrect Password')) {
                            //After seeing incorrect password start showing remains failed attempts
                            if(5 - remainingAttempts <= 0){
                               setFormMessage(logIn, 'error', 'User has been deleted due to too many attempts');
                           }
                           else{
                           const remainingAttempts = parseInt(response.message.split(':')[1]);
                            setFormMessage(logIn, 'error', `Incorrect Password. Remaining attempts: ${5 - remainingAttempts}`);
                           }
                        }
                   }
                });
                }
                else if (SignUp_test == true && LogIN_test == false) {
                    const userData = { username:username, password:password }
                    $.post('/signup', userData, (response) => {
                        if (response.success) {
                            //Redirect to mainpage after success
                            window.location.href = '/mainpage';
                        }
                        else {
                            setFormMessage(logIn, 'error', response.message);
                        }
                    });
                }
        }
        

     }
      else {
           setFormMessage(logIn, 'error', "Invalid username. Username must contain at least 4 letters and only 1 underscore.");
        }
        console.log(both);
    });

});

