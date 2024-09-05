
//back to top button functions 

//display button when scrolled
function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      mybutton.style.display = "block";
    } else {
      //else hide button
      mybutton.style.display = "none";
    }
  }

  //scroll page back to top
  function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }


// Get the back to top button
let mybutton = document.getElementById("topBtn");
// When the user scrolls down 20px from the top of the document, show the back to top button
window.onscroll = function () { scrollFunction() };
//Event listener to scroll page to top on click
mybutton.addEventListener("click", topFunction);


//Toggle page scollable when mobile navigation menu is open:
//get the check button and html elements
const menuCheckButton = document.getElementById("check");
const pageBody = document.querySelector("body");
const pageHTML = document.querySelector("html");

//Listen for change event
menuCheckButton.addEventListener("change", toggleScroll); 

//Function to toggle scroll
function toggleScroll() {
  //toggle class to stop scrolling  on the body and html elements
  pageBody.classList.toggle("stopScroll");
  pageHTML.classList.toggle("stopScroll");
}