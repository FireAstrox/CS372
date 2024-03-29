document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch('/movies');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const Movies = await response.json();

        const movieListDiv = document.getElementById("movieList");
        movieListDiv.innerHTML = ''; // Clear existing content

        Movies.forEach(movie => {
            // Assuming each movie object has 'title', 'genre', and 'link' properties
            const movieElement = document.createElement('div');
            movieElement.classList.add('movie-item');
            movieElement.innerHTML = `
                <h3>${movie.title}</h3>
                <p>Genre: ${movie.genre}</p>
                <p>URL: <a href="${movie.videoUrl}" target="_blank">${movie.videoUrl}</a></p>
                <p>Likes: ${movie.likes}</p>
                ${renderComments(movie.comments)}
                <button class="delete-button" onclick="deleteMovie('${movie._id}')">Delete</button>
            `;
            movieListDiv.appendChild(movieElement);
        });
    } catch (error) {
        console.error('Error fetching movies:', error);
        alert("Error fetching movies. Please try again.");
    }

    const addButton = document.getElementById("add");
    addButton.addEventListener("click", () => {
        window.location.href = '/addMovies';
        console.log("Successful Add detection");
    });

    // const deleteButton = document.getElementById("delete");
    // deleteButton.addEventListener("click", () => {
    //     window.location.href = '/deleteMovies';
    //     console.log("Successful Delete detection");
    // });

    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', function() {
            const movieId = this.getAttribute('data-movie-id');
            console.log("Deleting movie with ID:", movieId);
            // Send a request to delete the movie
            fetch(`/deleteMovie/${movieId}`, { method: 'DELETE' })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('Movie deleted successfully');
                        // Optionally, remove the movie element from the page
                    } else {
                       // alert('Failed to delete movie');
                    }
                })
                .catch(error => console.error('Error deleting movie:', error));
        });
    });
});

async function deleteMovie(movieId) {
    console.log("Attempting to delete movie with ID:", movieId);
    try {
        const response = await fetch(`/deleteMovie/${movieId}`, { method: 'DELETE' });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to delete movie');
        }
        alert('Movie deleted successfully');
        window.location.reload(); // Refresh the page to update the list
    } catch (error) {
        console.error('Error deleting movie:', error);
        alert('Error deleting movie. Please try again.');
    }
}

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