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
    const loginForm = document.getElementById('login');

    loginForm.addEventListener('submit', e => {
        e.preventDefault(); 

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const userData = { 
            username:username, 
            password:password 
        }

        $.post('/login', userData, (response) => {
            if (response.success && username == "viewer") {

                window.location.href = "/viewer";
            }
            else if (response.success && username == "Content-Manager") {

                window.location.href = "/content-manager";
            }
            else if (response.success && username == "Marketing-Manager"){
                
                window.location.href = "/marketing-manager";
            }
            else {
                //setFormMessage( "Invalid Username or Password.", 'error', response.message);
            }
        })
        
        });
    });