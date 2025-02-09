// index.js
document.addEventListener("DOMContentLoaded", () => {
    console.log("Index.js loaded");

    const toggleButton = document.getElementById("theme-toggle");
    if (toggleButton) {
        toggleButton.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
            localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
        });

        // Set theme based on saved preference
        if (localStorage.getItem("theme") === "dark") {
            document.body.classList.add("dark-mode");
        }
    }
});
