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
const mybutton = document.getElementById("topBtn");

// When the user scrolls down 20px from the top of the document, show the back to top button
window.onscroll = function () {
  scrollFunction();
  //call show scroll logo
  showScrollLogo();
};
//Event listener to scroll page to top on click
mybutton.addEventListener("click", topFunction);

//----------Nav menu enhancements ----------

//Get DOM elements
const menuCheckButton = document.getElementById("check");
const pageBody = document.querySelector("body");
const pageHTML = document.querySelector("html");
const menuIconSpan = document.getElementById("menu-icon");
const workNavElement = document.getElementById("work-nav");


//Function to toggle scrollability of page:
function toggleScroll() {
  //Toggle css class to stop scrolling when menu is open
  pageHTML.classList.toggle("stopScroll");
  pageBody.classList.toggle("stopScroll");
  pageBody.classList.toggle("bodyFixed");
}

//Change icon when memu is opened
function changMenuIcon() {
  if (menuIconSpan.innerText === "menu") {
    menuIconSpan.innerHTML = "close";
  } else if (menuIconSpan.innerText === "close") {
    menuIconSpan.innerHTML = "menu";
  }
}

//Call changeMenu and toggleScroll
function openCloseMenu() {
  changMenuIcon();
  toggleScroll();
} 


//Function to close menu and call to toggle the stop scroll
function closeMenu() {
  if (menuCheckButton.checked == true) {
    toggleScroll();
    menuCheckButton.checked = false;
    menuIconSpan.innerHTML = "menu";
  }
}


//Close mobile nav menu when window is > 860px
function updateWindowSize() {
  const width = window.innerWidth;
  if (width > 860 && menuCheckButton.checked == true) {
    menuCheckButton.checked = false;
    menuIconSpan.innerHTML = "menu";
    //remove stopScroll and bodyFixed classes
    toggleScroll();
  } else {
  }
}

//Listen for change events
menuCheckButton.addEventListener("change", openCloseMenu);
window.addEventListener("resize", updateWindowSize);
//Listener for clicking of "Work" link:
workNavElement.addEventListener("click", closeMenu);



// Display logo under nav when page scrolled down

const scrollLogo = document.getElementById("jtf-logo-scroll");

function showScrollLogo() {
  if (
    document.body.scrollTop > 300 ||
    document.documentElement.scrollTop > 300
  ) {
    scrollLogo.classList.remove("logo-scroll-hide");
    scrollLogo.classList.add("logo-scroll-show");
  } else {
    //else hide button
    scrollLogo.classList.add("logo-scroll-hide");
  }
}

