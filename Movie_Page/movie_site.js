document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('Login');

    loginForm.addEventListener('submit', e => {
        e.preventDefault(); 

        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;

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
            else {
                
                alert(response.message);
            }
        })
        
        });
    });