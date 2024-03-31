document.addEventListener("DOMContentLoaded", async () => {
    // Event listener for when the webpage has finished loading

    try {
        // Fetch data from the '/movies' endpoint
        const response = await fetch('/movies');

        // Throw an error if the response is not successful
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Convert the response into a JSON object
        const Movies = await response.json();

        // Clear existing content from the movie list div
        const movieListDiv = document.getElementById("movieList");
        movieListDiv.innerHTML = '';

        // Loop through each movie object in the 'Movies' array
        Movies.forEach(movie => {
            // Create a new 'div' element for each movie
            const movieElement = document.createElement('div');

            // Add the 'movie-item' class to the 'div' element
            movieElement.classList.add('movie-item');

            // Add the movie details to the 'div' element as HTML
            movieElement.innerHTML = `
                <h3>${movie.title}</h3>
                <p>Genre: ${movie.genre}</p>
                <p>URL: <a href="${movie.videoUrl}" target="_blank">${movie.videoUrl}</a></p>
                <p>Likes: ${movie.likes}</p>
                ${renderComments(movie.comments)}
                <button class="delete-button" onclick="deleteMovie('${movie._id}')">Delete</button>
            `;

            // Append the 'div' element to the movie list div
            movieListDiv.appendChild(movieElement);
        });
    } catch (error) {
        // Log the error to the console and alert the user
        console.error('Error fetching movies:', error);
        alert("Error fetching movies. Please try again.");
    }

    // Event listener for the 'add' button click
    const addButton = document.getElementById("add");
    addButton.addEventListener("click", () => {
        // Redirect the user to the '/content-add' page
        window.location.href = '/content-add';
        console.log("Successful Add detection");
    });

    // Event listener for each 'delete-button' click
    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', function() {
            // Get the movie ID from the button's attribute
            const movieId = this.getAttribute('data-movie-id');
            // Log the movie deletion attempt to the console
            console.log("Deleting movie with ID:", movieId);

            // Send a request to delete the movie
            fetch(`/deleteMovie/${movieId}`, { method: 'DELETE' })
               .then(response => response.json())
               .then(data => {
                    // Alert the user if the movie was successfully deleted
                    if (data.success) {
                        alert('Movie deleted successfully');
                        // Refresh the page to update the list
                        window.location.reload();
                    }
                })
               .catch(error => {
                    // Log the error to the console and alert the user
                    console.error('Error deleting movie:', error);
                    alert('Error deleting movie. Please try again.');
                });
        });
    });
});

// Function to delete a movie with a given ID
async function deleteMovie(movieId) {
    // Log the movie deletion attempt to the console
    console.log("Attempting to delete movie with ID:", movieId);

    try {
        // Send a request to delete the movie
        const response = await fetch(`/deleteMovie/${movieId}`, { method: 'DELETE' });

        // Convert the response into a JSON object
        const data = await response.json();

        // Throw an error if the response is not successful
        if (!response.ok) {
            throw new Error(data.message || 'Failed to delete movie');
        }
        // Alert the user if the movie was successfully deleted
        alert('Movie deleted successfully');
        // Refresh the page to update the list
        window.location.reload();
    } catch (error) {
        // Log the error to the console and alert the user
        console.error('Error deleting movie:', error);
        alert('Error deleting movie. Please try again.');
    }
}

// Function to render comments for a movie
function renderComments(comments = []) {
    return `
        <div class="comments">
            ${comments.map(comment => `
                <div class="comment">
                    <strong>${comment.username}:</strong> ${comment.comment}
                    <br>
                    <small>${new Date(comment.timestamp).toLocaleString()}</small>
                </div>
            `).join('')}
        </div>
    `;
}