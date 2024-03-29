//let currentMovieId = null; // To track the currently playing movie's ID

document.addEventListener('DOMContentLoaded', () => {
    fetchMovies();
});

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

function playMovie(videoUrl, movieId) {
    // Extract the YouTube video ID from the URL
    const videoId = videoUrl.split('watch?v=')[1];
    const embedUrl = `https://www.youtube.com/embed/${videoId}&movieId=${movie._id}`;

    const videoPlayer = document.getElementById('videoPlayer');
    videoPlayer.style.display = 'block';

    // Use an iframe to embed the YouTube video
    const videoElement = document.getElementById('videoElement');
    videoElement.innerHTML = `<iframe width="720" height="405" src="${embedUrl}"></iframe>`;
}
