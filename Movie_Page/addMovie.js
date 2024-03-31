document.addEventListener("DOMContentLoaded", () => {
    const addMovieForm = document.querySelector("#addMovieForm");

    addMovieForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const title = document.getElementById("title").value;
        const genre = document.getElementById("genre").value;
        const videoUrl = document.getElementById("link").value;

        const movieInfo = {
            title:title,
            genre:genre,
            videoUrl:videoUrl,
            likes: 0
        }

        $.post('/addMovie', movieInfo, (response) => {
            if (response.success) {
                alert("Movie added successfully!");
                // Successful addition, redirect to another page
               window.location.href = '/content-manager';
            } else {
                alert("Error adding movie. Please try again.");
            }
        });
    });
});