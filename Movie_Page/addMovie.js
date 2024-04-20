// Event listener that waits for the DOM to be fully loaded before executing the code inside
document.addEventListener("DOMContentLoaded", () => {
    
    // Selecting the 'addMovieForm' element from the DOM
    const addMovieForm = document.querySelector("#addMovieForm");
    
    // Adding a submit event listener to the 'addMovieForm' element
    addMovieForm.addEventListener("submit", async (e) => {
        
        // Preventing the default form submission behavior
        e.preventDefault();
        
        // Getting the values of the 'title', 'genre', and 'link' elements from the DOM
        const title = document.getElementById("title").value;
        const genre = document.getElementById("genre").value;
        const videoUrl = document.getElementById("link").value;

        // Validate the YouTube URL
        if (!isValidYoutubeUrl(videoUrl)) {
            alert("Please enter a valid YouTube URL.");
            return;
        }
        
        // Creating an object containing the movie information
        const movieInfo = {
            title:title,
            genre:genre,
            videoUrl:videoUrl,
            likes: 0
        }
        
        // Sending a POST request to the '/addMovie' endpoint with the 'movieInfo' object as the data
        $.post('/addMovie', movieInfo, (response) => {
            
            // Checking if the response was successful
            if (response.success) {
                
                // Alerting the user that the movie was added successfully
                alert("Movie added successfully!");
                
                // Redirecting the user to the '/content-manager' page
                window.location.href = '/content-manager';
            } else {
                
                // Alerting the user that there was an error adding the movie
                alert("Error adding movie. Please try again.");
            }
        });
    });
});

/*********************************************************
----------------------------------------------------------
--------------------Valid URL Check-----------------------
----------------------------------------------------------
*********************************************************/

function isValidYoutubeUrl(url) {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9\-_]{11}/;
    return regex.test(url);
}