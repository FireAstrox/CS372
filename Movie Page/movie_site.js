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

document.addEventLisntener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function (e){
        e.preventDefault(); 

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const userData = {
            username: username,
            password: password
        };

        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
            })
            .then((response) => response.json())
            .then((data) => {
                 if (data.redirect) {

                    window.location.href = data.redirect;
                 }
                 else{

                    alert('Login failed. Please try again.');
    }});
    });
});