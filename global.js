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
    darkModeButton.textContent = isDarkMode ? "Disable Dark Mode" : "Dark Mode";
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

export async function fetchJSON(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching or parsing JSON data:', error);
    }
}

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
    // Clear existing content
    containerElement.innerHTML = '';

    projects.forEach(project => {
        // Create an article element for each project
        const article = document.createElement('article');
        article.classList.add('project');

        // Dynamically set the heading level
        const heading = document.createElement(headingLevel);
        heading.textContent = project.title;
        article.appendChild(heading);

        // Add project description
        const description = document.createElement('p');
        description.textContent = project.description;
        article.appendChild(description);

        // Add project link
        const link = document.createElement('a');
        link.href = project.link;
        link.textContent = 'View Project';
        link.target = '_blank';
        article.appendChild(link);

        // Append the article to the container
        containerElement.appendChild(article);
    });
}

