class Slider {
  constructor(element, options = {}) {
    this.slider = element;
    this.track = element.querySelector(".slider-track");
    this.slides = [...element.querySelectorAll(".slide")];
    this.options = {
      autoplay: options.autoplay || true,
      speed: options.speed || 3000,
      slidesToShow: options.slidesToShow || 3,
      ...options,
    };

    this.currentIndex = 0;
    this.isMoving = false;
    this.autoplayInterval = null;

    this.init();
  }

  init() {
    // Clone slides for infinite effect
    const slidesToClone = 2;
    const clonedStart = this.slides
      .slice(-slidesToClone)
      .map((slide) => slide.cloneNode(true));
    const clonedEnd = this.slides
      .slice(0, slidesToClone)
      .map((slide) => slide.cloneNode(true));

    clonedStart.forEach((clone) =>
      this.track.insertBefore(clone, this.track.firstChild)
    );
    clonedEnd.forEach((clone) => this.track.appendChild(clone));

    // Add navigation
    this.createNavigation();

    // Add event listeners
    this.addEventListeners();

    // Initialize position
    this.updateSliderPosition();

    // Start autoplay if enabled
    if (this.options.autoplay) {
      this.startAutoplay();
    }
  }

  createNavigation() {
    // Create buttons
    const prevButton = document.createElement("button");
    const nextButton = document.createElement("button");
    prevButton.className = "slider-button slider-prev";
    nextButton.className = "slider-button slider-next";
    prevButton.setAttribute("aria-label", "Previous slide");
    nextButton.setAttribute("aria-label", "Next slide");

    // Create progress dots
    const progressContainer = document.createElement("div");
    progressContainer.className = "slider-progress";

    this.slides.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.className = "progress-dot";
      dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
      progressContainer.appendChild(dot);
    });

    this.slider.appendChild(prevButton);
    this.slider.appendChild(nextButton);
    this.slider.appendChild(progressContainer);

    // Store references
    this.prevButton = prevButton;
    this.nextButton = nextButton;
    this.progressDots = [...progressContainer.children];
  }

  addEventListeners() {
    // Navigation buttons
    this.prevButton.addEventListener("click", () => this.slide("prev"));
    this.nextButton.addEventListener("click", () => this.slide("next"));

    // Progress dots
    this.progressDots.forEach((dot, index) => {
      dot.addEventListener("click", () => this.goToSlide(index));
    });

    // Touch events
    let touchStartX = 0;
    let touchEndX = 0;

    this.slider.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.touches[0].clientX;
        this.pauseAutoplay();
      },
      { passive: true }
    );

    this.slider.addEventListener(
      "touchmove",
      (e) => {
        touchEndX = e.touches[0].clientX;
        const diff = touchStartX - touchEndX;
        const threshold = 50;

        if (Math.abs(diff) > threshold) {
          this.slide(diff > 0 ? "next" : "prev");
          touchStartX = touchEndX;
        }
      },
      { passive: true }
    );

    this.slider.addEventListener("touchend", () => {
      this.resumeAutoplay();
    });

    // Mouse events
    this.slider.addEventListener("mouseenter", () => this.pauseAutoplay());
    this.slider.addEventListener("mouseleave", () => this.resumeAutoplay());

    // Transition end
    this.track.addEventListener("transitionend", () => {
      this.isMoving = false;
      this.checkInfiniteSlide();
    });
  }

  slide(direction) {
    if (this.isMoving) return;
    this.isMoving = true;

    if (direction === "next") {
      this.currentIndex++;
    } else {
      this.currentIndex--;
    }

    this.updateSliderPosition();
  }

  goToSlide(index) {
    if (this.isMoving) return;
    this.isMoving = true;
    this.currentIndex = index;
    this.updateSliderPosition();
  }

  updateSliderPosition() {
    const slideWidth = this.slides[0].offsetWidth;
    const offset = -(this.currentIndex + 2) * slideWidth; // +2 for cloned slides
    this.track.style.transform = `translateX(${offset}px)`;
    this.updateProgressDots();
  }

  checkInfiniteSlide() {
    if (this.currentIndex === -2) {
      this.track.classList.add("no-transition");
      this.currentIndex = this.slides.length - 2;
      this.updateSliderPosition();
      setTimeout(() => this.track.classList.remove("no-transition"), 50);
    } else if (this.currentIndex === this.slides.length) {
      this.track.classList.add("no-transition");
      this.currentIndex = 0;
      this.updateSliderPosition();
      setTimeout(() => this.track.classList.remove("no-transition"), 50);
    }
  }

  updateProgressDots() {
    const normalizedIndex =
      (this.currentIndex + this.slides.length) % this.slides.length;
    this.progressDots.forEach((dot, index) => {
      dot.classList.toggle("active", index === normalizedIndex);
    });
  }

  startAutoplay() {
    this.autoplayInterval = setInterval(() => {
      this.slide("next");
    }, this.options.speed);
  }

  pauseAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }

  resumeAutoplay() {
    if (this.options.autoplay && !this.autoplayInterval) {
      this.startAutoplay();
    }
  }
}

// Initialize sliders
document.addEventListener("DOMContentLoaded", () => {
  const sliders = document.querySelectorAll(".slider");
  sliders.forEach((slider) => new Slider(slider));
});
