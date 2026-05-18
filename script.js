// Animações modernas no scroll
const revealElements = document.querySelectorAll(".reveal");
const header = document.querySelector(".site-header");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
    rootMargin: "0px 0px -60px 0px",
  }
);

revealElements.forEach((element) => revealObserver.observe(element));

function updateHeader() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 24);
}

updateHeader();
window.addEventListener("scroll", updateHeader);

// Carrosséis 100% manuais.
// Corrige as setas da seção Serviços e também mantém compatibilidade
// com outros carrosséis que usem classes/data-attributes parecidos.
function initManualCarousels() {
  const carousels = document.querySelectorAll("[data-services-carousel], .services-carousel");

  carousels.forEach((carousel) => {
    const track = carousel.querySelector("[data-services-track], .services-track");
    if (!track || carousel.dataset.carouselReady === "true") return;

    const prevButton = carousel.querySelector(
      "[data-services-prev], .carousel-arrow-left, .services-arrow-prev, .carousel-btn.prev"
    );

    const nextButton = carousel.querySelector(
      "[data-services-next], .carousel-arrow-right, .services-arrow-next, .carousel-btn.next"
    );

    const dotsContainer =
      carousel.querySelector("[data-services-dots], .carousel-dots, .services-dots") || null;

    const slides = Array.from(track.children).filter((item) => item.matches("article, .service-card, .testimonial"));
    if (!slides.length) return;

    carousel.dataset.carouselReady = "true";
    let currentIndex = 0;

    function visibleSlides() {
      if (window.innerWidth <= 720) return 1;
      if (window.innerWidth <= 1100) return 2;
      return 3;
    }

    function maxIndex() {
      return Math.max(0, slides.length - visibleSlides());
    }

    function slideStep() {
      const firstSlide = slides[0];
      const rect = firstSlide.getBoundingClientRect();
      const styles = window.getComputedStyle(track);
      const gap = parseFloat(styles.columnGap || styles.gap || "0") || 0;
      return rect.width + gap;
    }

    function buildDots() {
      if (!dotsContainer) return;

      dotsContainer.innerHTML = "";
      const count = maxIndex() + 1;

      for (let i = 0; i < count; i += 1) {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = dotsContainer.classList.contains("carousel-dots") ? "carousel-dot" : "services-dot";
        dot.setAttribute("aria-label", `Ir para o item ${i + 1}`);
        dot.addEventListener("click", () => {
          currentIndex = i;
          updateCarousel();
        });
        dotsContainer.appendChild(dot);
      }
    }

    function updateCarousel() {
      currentIndex = Math.max(0, Math.min(currentIndex, maxIndex()));
      track.style.transform = `translate3d(-${currentIndex * slideStep()}px, 0, 0)`;

      if (prevButton) prevButton.disabled = currentIndex === 0;
      if (nextButton) nextButton.disabled = currentIndex === maxIndex();

      if (dotsContainer) {
        Array.from(dotsContainer.children).forEach((dot, index) => {
          dot.classList.toggle("is-active", index === currentIndex);
        });
      }
    }

    prevButton?.addEventListener("click", (event) => {
      event.preventDefault();
      currentIndex -= 1;
      updateCarousel();
    });

    nextButton?.addEventListener("click", (event) => {
      event.preventDefault();
      currentIndex += 1;
      updateCarousel();
    });

    window.addEventListener("resize", () => {
      buildDots();
      updateCarousel();
    });

    buildDots();
    updateCarousel();
  });
}

initManualCarousels();
