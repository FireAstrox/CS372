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
                    const videoId = new URL(movie.videoUrl).searchParams.get('v');
                    window.location.href = `/moviePlayer.html?videoId=${videoId}&movieId=${movie._id}`;
                    console.log(movie._id);
                });
                movieListDiv.appendChild(movieDiv);
            });
        })
        .catch(error => console.error('Error fetching movies:', error));
}