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