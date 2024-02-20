
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

    both.forEach(bt => {
        bt.addEventListener('mousedown', (a) => {
            clickedButton = a.target.innerHTML;
            console.log(clickedButton);
            if(clickedButton == "loginButton") {
                console.log("Logging in");
            } else { 
                console.log("Signing up");
            }
        });
    });
    logIn.addEventListener("submit", e => {
        e.preventDefault();
        var userID = document.getElementById("username").value;
        var password = document.getElementById("password").value;
        var lower = false;
        var upper = false;
        var special = false;
        var number = false;
        var specials = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?~]/;

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

        if (!(userID.length >= 5 && userID.split("_").length === 2)) {
            setFormMessage(logIn, "error", "Invalid username. Usernames must consist of at least 4 letters, and end in an underscore.");
        } else if (!(lower && upper && number && special)){
            setFormMessage(logIn, "error", "Invalid password.");
        } else {
            setFormMessage(logIn, "success", "Valid Username and password");
        }
        console.log(both);
    }});
});

/* const fs = require('fs');
      const form = document.getElementById('LogIn');
      form.addEventListener('signupButton', (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const data = {
    username: username,
    password: password
  };

  const jsonData = JSON.stringify(data, null, 2);

  fs.appendFile('Login.json', jsonData, (err) => {
    if (err) {
      console.log('Error writing file:', err);
    } else {
      console.log('File has been created successfully!');
    }
  });
}) */
