/**
 * JavaScript Carousel
 *
 * A simple customizable carousel built with plain JavaScript which can
 * be the starting point to build your own carousel solution.
 *
 * @constructor
 * @param   {Object} Configuration options for the carousel.
 * @param   {string} config.carouselSelector - Defines CSS selector for the carousel container element.
 * @param   {string} config.slideSelector - Defines CSS selector for the individual slide elements within the carousel.
 * @param   {boolean} [config.enablePagination=true] - Whether to enable pagination for the carousel.
 * @param   {boolean} [config.enableAutoplay=true] - Whether to enable autoplay for the carousel.
 * @param   {number} [config.autoplayInterval=2000] - Autoplay interval in milliseconds.
 * @returns {Object} An object containing methods to control the carousel.
 * @returns {Function} create - A function to create and initialize the carousel.
 * @returns {Function} destroy - A function to destroy and clean up the carousel.
 * @author  Rahul C.
 * @see     https://github.com/c99rahul/js-carousel
 */
const JSCarousel = ({
  carouselSelector,
  slideSelector,
  enablePagination = true,
  enableAutoplay = true,
  autoplayInterval = 2000,
}) => {
  // Find the carousel element in the DOM.
  const carousel = document.querySelector(carouselSelector);

  // If carousel element is not found, log an error and exit.
  if (!carousel) {
    console.error("Specify a valid selector for the carousel.");
    return null;
  }

  // Find all slides within the carousel
  const slides = carousel.querySelectorAll(slideSelector);

  // If no slides are found, log an error and exit.
  if (!slides.length) {
    console.error("Specify a valid selector for slides.");
    return null;
  }

  /*
   * Initialize variables to keep track of carousel state and
   * references to different elements.
   */
  let currentSlideIndex = 0;
  let prevBtn, nextBtn;
  let autoplayTimer;
  let paginationContainer;

  /*
   * Utility function to create and append HTML elements with
   * attributes and children.
   */
  const addElement = (tag, attributes, children) => {
    const element = document.createElement(tag);

    if (attributes) {
      // Set attributes to the element.
      Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
    }

    if (children) {
      // Set content to the element.
      if (typeof children === "string") {
        element.textContent = children;
      } else {
        children.forEach((child) => {
          if (typeof child === "string") {
            element.appendChild(document.createTextNode(child));
          } else {
            element.appendChild(child);
          }
        });
      }
    }

    return element;
  };

  /*
   * Modify the DOM structure and add required containers and controls
   * to the carousel element.
   */

  const playPauseBtn = addElement(
    "button",
    { class: "playBtn-hidden", id: "playBtn" },
    "\u23F8\ufe0e"
  );

  const tweakStructure = () => {
    carousel.setAttribute("tabindex", "0");

    // Create a div for carousel inner content.
    const carouselInner = addElement("div", {
      class: "carousel-inner",
    });
    carousel.insertBefore(carouselInner, slides[0]);

    /*
     * Move slides from the carousel element to the carousel inner
     * container to facilitate alignment.
     */
    slides.forEach((slide) => {
      carouselInner.appendChild(slide);
    });

    // Create and append previous button.
    prevBtn = addElement(
      "btn",
      {
        class: "carousel-btn carousel-btn--prev-next carousel-btn--prev",
        "aria-label": "Previous Slide",
      },
      "\u25C0\ufe0e" //unicode character requires trailing variant selecto (after second \u) to ensure an emoji isn't displayed on some mobile browsers
    );
    carouselInner.appendChild(prevBtn);

    // Create and append next button.
    nextBtn = addElement(
      "btn",
      {
        class: "carousel-btn carousel-btn--prev-next carousel-btn--next",
        "aria-label": "Next Slide",
      },
      "\u25B6\ufe0e"
    );
    carouselInner.appendChild(nextBtn);

    // If pagination is enabled, create and append pagination buttons.
    if (enablePagination) {
      paginationContainer = addElement("nav", {
        class: "carousel-pagination",
        role: "tablist",
        id: "pagination-nav",
      });
      carousel.appendChild(paginationContainer);
    }

    /*
     * Set initial alignment styles for the slides, inject pagination
     * buttons, and attach event listeners to them.
     */

    slides.forEach((slide, index) => {
      slide.style.transform = `translateX(${index * 100}%)`;
      if (enablePagination) {
        const paginationBtn = addElement(
          "btn",
          {
            class: `carousel-btn caroursel-btn--${index + 1}`,
            role: "tab",
          },
          `${index + 1}`
        );

        paginationContainer.appendChild(paginationBtn);

        if (index === 0) {
          paginationBtn.classList.add("carousel-btn--active");
          paginationBtn.setAttribute("aria-selected", true);
        }

        paginationBtn.addEventListener("click", () => {
          handlePaginationBtnClick(index);
        });
      }
    });

    //Add play/pause button - JF
    //need if statement check autoplay enabled? or add parameter to constructor to include this button
    const nav = document.getElementById("pagination-nav");

    //add event listener to button
    playPauseBtn.addEventListener("click", handleplayPauseBtn);
    //add play/pause button to the DOM
    if (enableAutoplay == true) {
      carouselInner.appendChild(playPauseBtn);
    }
  };

  //initialize variable to store if the carousel is playing
  let isPlaying = false;
  let userPaused = false;

  function handleplayPauseBtn() {
    console.log("play/ pause clicked");
    if (userPaused == false) {
      //stop the player and and remove hover events
      stopAutoplay();
      userPaused = true;
      isPlaying = false;
      console.log("user paused");
      //remove mouse over event listeners
      carousel.removeEventListener("mouseenter", handleMouseEnter);
      carousel.removeEventListener("mouseleave", handleMouseLeave);
      playPauseBtn.innerHTML = "\u25B6";
    } else {
      //restart the player and add back hover events
      startAutoplay();
      userPaused = false;
      isPlaying = true;
      console.log("user restart");
      //add back in mouse over event listeners
      carousel.addEventListener("mouseenter", handleMouseEnter);
      carousel.addEventListener("mouseleave", handleMouseLeave);
      playPauseBtn.innerHTML = "\u23F8";
    }
  }

  // Function to Start autoplaying of slides.
  const startAutoplay = () => {
    if (isPlaying === false) {
      autoplayTimer = setInterval(() => {
        moveSlide("next");
      }, autoplayInterval);
      isPlaying = true;
      console.log("Start");
      console.log("isPlaying " + isPlaying);
    }
  };

  // Function to stop autoplaying of slides.
  const stopAutoplay = () => {
    clearInterval(autoplayTimer);
    isPlaying = false;
    console.log("stop");
    console.log("isPlaying? " + isPlaying);
  };

  /* Event handlers to manage autoplaying intelligentally on mouse
   * enter and leave events.
   */
  const handleMouseEnter = () => {
    if (isPlaying == true) {
      stopAutoplay();
      isPlaying = false;
    }
  };
  const handleMouseLeave = () => startAutoplay();

  //Checks for autoplay
  if (enableAutoplay && autoplayInterval !== null) {
    console.log("attach listeners");
    carousel.addEventListener("mouseenter", handleMouseEnter);
    carousel.addEventListener("mouseleave", handleMouseLeave);
    //playPauseBtn.style.visibility = "visible";
  } else {
    playPauseBtn.style.visibility = "hidden";
  }

  //protocode for play/pause button:
  //add play/pause functionality to button to stop autoplay
  //if paused - remove event listener for mouseleave starting autoplay
  //if played - add event listener for starting autoplay
  //need logic showing/hiding this button based on autopplay config

  // Adjust slide positions according to the currently selected slide.
  const adjustSlidePosition = () => {
    slides.forEach((slide, i) => {
      slide.style.transform = `translateX(${100 * (i - currentSlideIndex)}%)`;
    });
  };
  //Update the state of pagination buttons according to the currently
  //selected slide.

  const updatePaginationBtns = () => {
    const paginationBtns = paginationContainer.children;
    const prevActiveBtns = Array.from(paginationBtns).filter((btn) =>
      btn.classList.contains("carousel-btn--active")
    );
    prevActiveBtns.forEach((btn) => {
      btn.classList.remove("carousel-btn--active");
      btn.removeAttribute("aria-selected");
    });

    const currActiveBtns = paginationBtns[currentSlideIndex];
    if (currActiveBtns) {
      currActiveBtns.classList.add("carousel-btn--active");
      currActiveBtns.setAttribute("aria-selected", true);
    }
  };

  // Update the overall carousel state.
  const updateCarouselState = () => {
    if (enablePagination) {
      updatePaginationBtns();
    }
    adjustSlidePosition();
  };

  // Move slide left and right based on direction provided.
  const moveSlide = (direction) => {
    const newSlideIndex =
      direction === "next"
        ? (currentSlideIndex + 1) % slides.length
        : (currentSlideIndex - 1 + slides.length) % slides.length;
    currentSlideIndex = newSlideIndex;
    updateCarouselState();
  };

  // Event handler for pagination button click event.
  const handlePaginationBtnClick = (index) => {
    currentSlideIndex = index;
    updateCarouselState();
  };

  // Event handlers for previous and next button clicks.
  const handlePrevBtnClick = () => moveSlide("prev");
  const handleNextBtnClick = () => moveSlide("next");

  // Function to attach event listeners to relevant elements.
  const attachEventListeners = () => {
    prevBtn.addEventListener("click", handlePrevBtnClick);
    nextBtn.addEventListener("click", handleNextBtnClick);

    //Get overall carousel element - JF
    const carouselArea = document.querySelector(carouselSelector);
    //Get caption elements - getElementsbyClassName returns an HTML collection
    //Convert to array with Array.from
    const captionElements = Array.from(
      document.getElementsByClassName("slide-caption")
    );
    //*
    //console.log(captionElements);
    // Event listener for the whole carousel to show next/prev buttons - JF
    carouselArea.addEventListener("mouseenter", () => {
      prevBtn.style.visibility = "visible";
      nextBtn.style.visibility = "visible";
      playPauseBtn.classList.remove("playBtn-hidden");
      playPauseBtn.classList.add("playBtn");
      //loop through captionElements to show
      for (let i = 0; i < captionElements.length; i++) {
        //console.log(captionElements[i]);
        captionElements[i].classList.remove("slide-caption-hidden");
      }
    });
    // Event listener to hide prev/next buttons and pause button - JF
    carouselArea.addEventListener("mouseleave", () => {
      prevBtn.style.visibility = "hidden";
      nextBtn.style.visibility = "hidden";
      playPauseBtn.classList.add("playBtn-hidden");

      for (let i = 0; i < captionElements.length; i++) {
        captionElements[i].classList.add("slide-caption-hidden");
      }
    });
  };

  // Function to Initialize/create the carousel.
  const create = () => {
    tweakStructure();
    attachEventListeners();
    if (enableAutoplay && autoplayInterval !== null) {
      startAutoplay();
      console.log("start playing");
    }
  };

  // Function to Destroy the carousel/clean-up.
  const destroy = () => {
    // Remove event listeners.
    prevBtn.removeEventListener("click", handlePrevBtnClick);
    nextBtn.removeEventListener("click", handleNextBtnClick);
    if (enablePagination) {
      const paginationBtns =
        paginationContainer.querySelectorAll(".carousel-btn");
      if (paginationBtns.length) {
        paginationBtns.forEach((btn) => {
          btn.removeEventListener("click", handlePaginationBtnClick);
        });
      }
    }

    // Clear autoplay intervals if autoplay is enabled.
    if (enableAutoplay && autoplayInterval !== null) {
      carousel.removeEventListener("mouseenter", handleMouseEnter);
      carousel.removeEventListener("mouseleave", handleMouseLeave);
      console.log("destroy");
      stopAutoplay();
    }
  };

  // Return an object with methods to create and destroy the carousel.
  return { create, destroy };
};

const carousel1 = JSCarousel({
  carouselSelector: "#carousel-1",
  slideSelector: ".slide",
  enableAutoplay: true,
});

carousel1.create();

window.addEventListener("beforeunload", () => {
  //console.log("unload");
  carousel1.destroy();
});
