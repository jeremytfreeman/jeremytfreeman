
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