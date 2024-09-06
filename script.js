//----------Back to top button functions----------

//Display button when scrolled
function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    //else hide button
    mybutton.style.display = "none";
  }
}

//Scroll page back to top
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

// Get the back to top button
let mybutton = document.getElementById("topBtn");
// When the user scrolls down 20px from the top of the document, show the back to top button
window.onscroll = function () {
  scrollFunction();
};
//Event listener to scroll page to top on click
mybutton.addEventListener("click", topFunction);

//----------Nav menu enhancements ----------

//Get the check button and html elements
const menuCheckButton = document.getElementById("check");
const pageBody = document.querySelector("body");
const pageHTML = document.querySelector("html");

//Listen for change event
menuCheckButton.addEventListener("change", toggleScroll);

//Function to toggle scroll:
function toggleScroll() {
  //Toggle class to stop scrolling  on the body and html elements
  pageHTML.classList.toggle("stopScroll");
  pageBody.classList.toggle("stopScroll");
  pageBody.classList.toggle("bodyFixed");
}

//Close menu when clicking work link in main nav:
//Get work nav element:
const workNavElement = document.getElementById("work-nav");

//Function to close menu and call to toggle the stop scrolling behavior:
function closeMenu() {
  menuCheckButton.checked = false;
  toggleScroll();
}
//Listener for clicking of "Work" link:
workNavElement.addEventListener("click", closeMenu);

//Close mobile nav menu when window is > 860px
function updateWindowSize() {
  const width = window.innerWidth;
  if (width > 860 && menuCheckButton.checked == true) {
    console.log(menuCheckButton.checked)
    menuCheckButton.checked = false;
    toggleScroll();

  }
}

window.addEventListener('resize', updateWindowSize);


// Display logo under nav when page scrolled down