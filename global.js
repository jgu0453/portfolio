// global.js
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

// Function to fetch JSON data
export async function fetchJSON(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching JSON:', error);
  }
}

// Function to render projects dynamically
export function renderProjects(projects, container, headingLevel = 'h3') {
  if (!container) {
    console.error("Projects container not found!");
    return;
  }

  container.innerHTML = ''; // Clear previous content

  projects.forEach(project => {
    const article = document.createElement('article');
    article.classList.add('project');

    // Project title
    const heading = document.createElement(headingLevel);
    heading.textContent = project.title;
    article.appendChild(heading);

    // Project year
    const year = document.createElement('p');
    year.classList.add('project-year');
    year.textContent = `Year: ${project.year}`;
    article.appendChild(year);

    // Project image
    const img = document.createElement('img');
    img.src = project.image || '../assets/placeholder.png'; // Fallback image
    img.alt = project.title;
    article.appendChild(img);

    // Project description
    const description = document.createElement('p');
    description.textContent = project.description;
    article.appendChild(description);

    // Project link
    if (project.link) {
      const link = document.createElement('a');
      link.href = project.link;
      link.textContent = 'View Project';
      link.target = '_blank';
      article.appendChild(link);
    }

    container.appendChild(article);
  });
}
