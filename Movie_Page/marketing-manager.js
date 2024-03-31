document.addEventListener('DOMContentLoaded', () => {
    // Wait for the DOM to fully load before fetching movies
    fetchMovies();
});

/*********************************************************
----------------------------------------------------------
-------Fetch all the current movies from data base--------
----------------------------------------------------------
*********************************************************/

function fetchMovies() {
    // Fetch movies from the '/movies' endpoint
    fetch('/movies')
       .then(response => {
            // Throw an error if the response is not OK
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            // Convert the response to JSON
            return response.json();
        })
       .then(movies => {
            // Throw an error if the response is not an array
            if (!Array.isArray(movies)) {
                throw new Error('Expected an array of movies');
            }
            // Get the movieListDiv element
            const movieListDiv = document.getElementById('movieList');
            // Update the movieListDiv's innerHTML with the mapped movies
            movieListDiv.innerHTML = movies.map(movie => `
                <div class="movie-item">
                    <h3>${movie.title}</h3>
                    <p>Genre: ${movie.genre}</p>
                    <p>Likes: ${movie.likes}</p>
                    ${renderCommentsForm(movie._id)}
                    ${renderComments(movie.comments)}
                </div>
            `).join('');
            // Attach event listeners to the comment forms
            attachCommentFormEventListeners();
        })
       .catch(error => {
            // Log the error in the console and update the movieListDiv's innerHTML with an error message
            console.error('Error fetching movies:', error);
            document.getElementById('movieList').innerHTML = '<p>Error loading movies.</p>';
        });
}

/*********************************************************
----------------------------------------------------------
---Dynamically add HTML to show the add comments fields---
----------------------------------------------------------
*********************************************************/

function renderCommentsForm(movieId) {
    // Return the HTML for the comment form
    return `
        <form class="comment-form" data-movie-id="${movieId}">
            <input type="text" name="comment" placeholder="Leave a comment" required>
            <button type="submit">Submit Comment</button>
        </form>
    `;
}

/*********************************************************
----------------------------------------------------------
----Render all the current comment data for each movie----
----------------------------------------------------------
*********************************************************/

function renderComments(comments = []) {
    // Return the HTML for the comments
    return `
        <div class="comments">
            ${comments.map(comment => `
                <div class="comment">
                    <strong>${comment.username}:</strong> ${comment.comment}
                    <br>
                    <small>${formatTimestamp(comment.timestamp)}</small>
                </div>
            `).join('')}
        </div>
    `;
}

/*********************************************************
----------------------------------------------------------
-------Format timestamps to be displayed in comments------
----------------------------------------------------------
*********************************************************/

function formatTimestamp(timestamp) {
    // Convert the ISO 8601 timestamp to a more readable format
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
}

/*********************************************************
----------------------------------------------------------
----------Attach Comments to each movie listing-----------
----------------------------------------------------------
*********************************************************/

function attachCommentFormEventListeners() {
    // Attach submit event listeners to all comment forms
    document.querySelectorAll('.comment-form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const movieId = this.getAttribute('data-movie-id');
            const comment = this.comment.value;

            fetch(`/addComment/${movieId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: 'MarketingManager', comment })
            })
           .then(response => response.json())
           .then(data => {
                if (data.success) {
                    alert('Comment added successfully.');
                    fetchMovies(); // Refresh the list to show the new comment
                } else {
                    alert('Failed to add comment.');
                }
            })
           .catch(error => console.error('Error adding comment:', error));
        });
    });
}