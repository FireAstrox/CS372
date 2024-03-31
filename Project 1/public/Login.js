// Function to set a form message
function setFormMessage(formElement, type, message) {
    // Select the message element
    const messageElement = formElement.querySelector(".form__message");
    
    // Set the text content of the message element
    messageElement.textContent = message;
    
    // Remove any existing message classes
    messageElement.classList.remove("form__message--success", "form__message--error", "form--hidden");
    
    // Add the new message class
    messageElement.classList.add(`form__message--${type}`);
}



// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", () => {
    // Select the log in form
    const logIn = document.querySelector("#LogIn");
    // Select all buttons
    const both = document.querySelectorAll('.btn');
    // Initialize variables to keep track of which button was clicked
    let clickedButton = "";
    let LogIN_test = false;
    let SignUp_test = false;
    
    // Add a mousedown event listener to each button
    both.forEach(bt => {
        bt.addEventListener('mousedown', (a) => {
            // Set the clicked button variable
            clickedButton = a.target.innerHTML;
            console.log(clickedButton);
            // If the button is "Login"
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

    // Add a submit event listener to the log in form
    logIn.addEventListener("submit", e => {
        e.preventDefault();
    
        // Get the username and password values
        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;

        // Initialize variables to check password requirements
        var lower = false;
        var upper = false;
        var special = false;
        var number = false;
        var specials = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?~]/;
        
        // Check if the password is at least 8 characters long
        if(password.length >= 8){
            // Loop through each character in the password
            for(let i = 0; i < password.length; i++){
                // Check if the character is lowercase
                if(password.charAt(i) == password.charAt(i).toLowerCase()){
                    lower = true;
                }
                // Check if the character is uppercase
                if(password.charAt(i) == password.charAt(i).toUpperCase()){
                    upper = true;
                }
                // Check if the character is a number
                if(password.charAt(i) >= 0 && password.charAt(i) <= 9){
                    number = true;
                }
                // Check if the character is a special character
                if(specials.test(password)){
                    special = true;
                }
            }
        }

        // Check if the username is at least 4 characters long and contains only one underscore
        if (username.length >= 4 && username.split("_").length === 2) {
            
            // Set the form message to success and a message
            setFormMessage(logIn, "success", "Valid Username and password");
            
            // Check if the password meets the requirements
            if (!(lower && upper && number && special)){
                // Set the form message to error and a message
                setFormMessage(logIn, "error", "Invalid password, does not meet requirements.");    
            } 
            else {
                //Password passes requirement checks
                setFormMessage(logIn, "success", "");

                // Check which button was clicked
                if (LogIN_test == true && SignUp_test == false) {
                    // Create an object userData with the username and password
                    const userData = { username:username, password:password }
                
                // Send a POST request to the server to log in
                $.post('/login', userData, (response) => {
                    if (response.success) {

                        // Redirect to the main page upon successful login
                        window.location.href = '/mainpage';
                    }
                    else if (response.message === "User does not exist") {
                            //User not found send error
                            setFormMessage(logIn, 'error', "User does not exist");
                        }
                    else {
                         //After seeing incorrect password start showing remains failed attempts
                        const remainingAttempts = parseInt(response.message.split(':')[1]);
                        if(isNaN(remainingAttempts) || remainingAttempts <= 0){
                            setFormMessage(logIn, 'error', 'User has been deleted due to too many attempts');
                        }
                        else{
                        setFormMessage(logIn, 'error', `Incorrect Password. Remaining attempts: ${5 - remainingAttempts}`);
                           }
                        }
                });
                }
                else if (SignUp_test == true && LogIN_test == false) {
                    const userData = { username:username, password:password }
                    $.post('/signup', userData, (response) => {
                        if (response.success) {
                            // Redirect to the main page after successful sign up
                            window.location.href = '/mainpage';
                        }
                        else {
                            // Set the form message to error and a message
                            setFormMessage(logIn, 'error', response.message);
                        }
                    });
                }
        }
        

     }
      else {
            // Set the form message to error and a message
           setFormMessage(logIn, 'error', "Invalid username. Username must contain at least 4 letters and only 1 underscore.");
        }
        console.log(both);
    });

});

