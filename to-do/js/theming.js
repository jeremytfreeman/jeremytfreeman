//theming.js

// Switch themes
export function switchTheme() {
  const styleSheet = document.getElementById("themeStylesheet");
  const currentTheme = styleSheet.getAttribute("href");

  // Set the href attribute based on the theme
  if (currentTheme.includes("dark.css")) {
    styleSheet.setAttribute("href", "./css/light.css");
  } else {
    styleSheet.setAttribute("href", "./css/dark.css");
  }

  // Store theme in localStorage
  localStorage.setItem("theme", styleSheet.getAttribute("href"));
}
window.switchTheme = switchTheme;

// Function to load the theme on page load
export function loadTheme() {
  const savedTheme = localStorage.getItem("theme");
  // If a theme was saved, apply it
  if (savedTheme) {
    document.getElementById("themeStylesheet").setAttribute("href", savedTheme);
  } else {
    document
      .getElementById("themeStylesheet")
      .setAttribute("href", "./css/dark.css"); // Apply default theme
  }
}
