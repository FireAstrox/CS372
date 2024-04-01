document.addEventListener('DOMContentLoaded', () => {
    fetchMovies();
});

/*********************************************************
----------------------------------------------------------
-------Fetch all the current movies from data base--------
----------------------------------------------------------
*********************************************************/

function fetchMovies() {
    fetch('/movies')
        .then(response => response.json())
        .then(movies => {
            const movieListDiv = document.getElementById('movieList');
            movies.forEach(movie => {
                const movieDiv = document.createElement('div');
                movieDiv.className = 'movie-item';
                movieDiv.innerHTML = `<h2>${movie.title}</h2><p>${movie.genre}</p><p>Likes: ${movie.likes}</p> `;
                movieDiv.addEventListener('click', () => {
                    const url = new URL(movie.videoUrl);
                    let videoId;
                    // Check if URL is a shortened YouTube URL
                    if (url.host === 'youtu.be') {
                        // Extract video ID from the path
                        videoId = url.pathname.substring(1);
                    } else {
                        // Extract video ID using searchParams for standard YouTube URLs
                        videoId = url.searchParams.get('v');
                    }
                    window.location.href = `/moviePlayer.html?videoId=${videoId}&movieId=${movie._id}`;
                    console.log(movie._id);
                });
                movieListDiv.appendChild(movieDiv);
            });
        })
        .catch(error => console.error('Error fetching movies:', error));
}