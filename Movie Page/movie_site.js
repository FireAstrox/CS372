// Function to set a form message
// function setFormMessage(formElement, type, message) {
//     // Select the message element
//     const messageElement = formElement.querySelector(".form__message");
    
//     // Set the text content of the message element
//     messageElement.textContent = message;
    
//     // Remove any existing message classes
//     messageElement.classList.remove("form__message--success", "form__message--error", "form--hidden");
    
//     // Add the new message class
//     messageElement.classList.add(`form__message--${type}`);
// }

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('Login');

    // let login = false;

    // if(loginForm == "Login"){
    //     console.log("Login");
    //     login = true;
    // }
    // else{
    //     console.log("fail");
    //     login = false;
    // }

    loginForm.addEventListener('submit', e => {
        e.preventDefault(); 

        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;

        const userData = { 
            username:username, 
            password:password 
        }
//if (login == true){
        $.post('/login', userData, (response) => {
            if (response.success ){//&& username == "viewer") {

                window.location.href = "/Movie Page/viewer";
            console.log(response.message);
            }
            // else if (response.success && username == "Content-Manager") {

            //     window.location.href = "/content-manager";
            // }
            // else if (response.success && username == "Marketing-Manager"){
                
            //     window.location.href = "/marketing-manager";
            // }
            else {
                //setFormMessage( "Invalid Username or Password.", 'error', response.message);
                alert(response.message);
            }
        })
    //}
        
        });
    });