// Add an event listener for the 'DOMContentLoaded' event to ensure the DOM is fully loaded before proceeding
document.addEventListener('DOMContentLoaded', () => {
    // Get the login form element by its ID
    const loginForm = document.getElementById('Login');

    // Add an event listener for the 'submit' event on the login form
    loginForm.addEventListener('submit', e => {
        // Prevent the default form submission behavior
        e.preventDefault(); 

        // Get the values of the username and password input fields
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;

        // Create a userData object to store the username and password values
        const userData = { 
            username:username, 
            password:password 
        }

/*********************************************************
----------------------------------------------------------
----------------Send Login to server----------------------
----------------------------------------------------------
*********************************************************/

        $.post('/login', userData, (response) => {
            // If the response indicates a successful login,
            // log the response message and redirect the user to the appropriate page
            if (response.success ){
            console.log(response.message);
                if(response.role === 'Viewer') {
                    window.location.href = "/viewer.html";
                }
                else if(response.role === 'Content-Manager') {
                    window.location.href = '/content-manager.html';
                }
                else if (response.role === 'Marketing-Manager') {
                    window.location.href = '/marketing-manager.html';    
                }
        }
            // If the response indicates a failed login,
            // alert the user with the response message
            else {
                
                alert(response.message);
            }
        })
        
        });
    });