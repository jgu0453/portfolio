console.log('IT’S ALIVE!');

// Utility function to select multiple DOM elements
function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// Highlight the current page link in the navigation menu
function highlightCurrentPage() {
  const navLinks = $$("nav a");
  const currentPage = window.location.pathname;

  navLinks.forEach((link) => {
    const linkPath = new URL(link.href).pathname;
    if (linkPath === currentPage) {
      link.classList.add("current");
    }
  });
}

// Dark mode toggle functionality
function setupDarkModeToggle() {
  const body = document.body;
  const darkModeButton = document.querySelector(".dark-mode-toggle");

  if (!darkModeButton) {
    console.warn("Dark mode button not found!");
    return;
  }

  // Toggle dark mode and update the button text
  function toggleDarkMode() {
    const isDarkMode = body.classList.toggle("dark-mode");
    darkModeButton.textContent = isDarkMode ? "Disable Dark Mode" : "Enable Dark Mode";
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }

  // Add click event listener to the button
  darkModeButton.addEventListener("click", toggleDarkMode);

  // Load the saved theme from localStorage
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    body.classList.add("dark-mode");
    darkModeButton.textContent = "Disable Dark Mode";
  }
}

// Run functions on page load
document.addEventListener("DOMContentLoaded", () => {
  highlightCurrentPage();
  setupDarkModeToggle();
});
