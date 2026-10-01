const jokeElement = document.querySelector("#joke");
const button = document.querySelector("#jokeBtn");

const categorySelect = document.querySelector("#category");
const typeSelect = document.querySelector("#type");
const safeMode = document.querySelector("#safe-mode");


button.addEventListener("click", () => {

    const category = categorySelect.value;
    const type = typeSelect.value;
    const isSafe = safeMode.checked;

    let url = `https://v2.jokeapi.dev/joke/${category}`;

    const parameters = [];

    if (type !== "") {
        parameters.push(`type=${type}`);
    }

    if (isSafe) {
        parameters.push(
            "blacklistFlags=nsfw,racist,sexist,explicit,political,religious"
        );
    }

    if (parameters.length > 0) {
        url += `?${parameters.join("&")}`;
    }


    // Show loading state
    jokeElement.textContent = "Getting a joke...";

    button.disabled = true;
    button.textContent = "Loading...";


    fetch(url)

        .then(response => {

            // Check if the HTTP request failed
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }

            return response.json();
        })

        .then(data => {

            // Check if JokeAPI itself returned an error
            if (data.error) {
                throw new Error(
                    data.message || "Joke API returned an error."
                );
            }


            // Display a single-line joke
            if (data.type === "single") {

                jokeElement.textContent = data.joke;

            }

            // Display a two-part joke
            else if (data.type === "twopart") {

                jokeElement.textContent =
                    `${data.setup} — ${data.delivery}`;

            }

            // Handle an unexpected response
            else {

                throw new Error("Unknown joke format.");
            }

        })

        .catch(error => {

            jokeElement.textContent =
                "Sorry, we couldn't get a joke.";

            console.error("Joke error:", error);

        })

        .finally(() => {

            // Restore button after request finishes
            button.disabled = false;
            button.textContent = "Get Joke";

        });

});