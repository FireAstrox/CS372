document.addEventListener('DOMContentLoaded', () => {
    fetchMovies();
});

function fetchMovies() {
    fetch('/movies')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(movies => {
            if (!Array.isArray(movies)) {
                throw new Error('Expected an array of movies');
            }
            const movieListDiv = document.getElementById('movieList');
            movieListDiv.innerHTML = movies.map(movie => `
                <div class="movie-item">
                    <h3>${movie.title}</h3>
                    <p>Genre: ${movie.genre}</p>
                    <p>Likes: ${movie.likes}</p>
                    ${renderCommentsForm(movie._id)}
                    ${renderComments(movie.comments)}
                </div>
            `).join('');
            attachCommentFormEventListeners();
        })
        .catch(error => {
            console.error('Error fetching movies:', error);
            document.getElementById('movieList').innerHTML = '<p>Error loading movies.</p>';
        });
}

function renderCommentsForm(movieId) {
    return `
        <form class="comment-form" data-movie-id="${movieId}">
            <input type="text" name="comment" placeholder="Leave a comment" required>
            <button type="submit">Submit Comment</button>
        </form>
    `;
}

function renderComments(comments = []) {
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

function formatTimestamp(timestamp) {
    // Convert the ISO 8601 timestamp to a more readable format
    // Example format: "Oct 1, 2023, 12:00 PM"
    // This can be adjusted based on your preference and locale
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
}

function attachCommentFormEventListeners() {
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
