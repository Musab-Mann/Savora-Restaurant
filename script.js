/* =========================================================
   SAVORA — script.js
   All interactivity: nav, filtering, scroll effects,
   validation, reveal animations, back-to-top.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------------------------------------------------------
     1. MOBILE HAMBURGER MENU
  --------------------------------------------------------- */
  const navToggle = document.getElementById("navToggle");
  const primaryNav = document.getElementById("primaryNav");

  navToggle.addEventListener("click", () => {
    const isOpen = primaryNav.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  // Close mobile menu whenever a nav link is clicked
  primaryNav.querySelectorAll(".navbar__link, .navbar__cta").forEach((link) => {
    link.addEventListener("click", () => {
      primaryNav.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------------------------------------------------------
     2. NAVBAR SCROLL EFFECT (sticky + solid background)
  --------------------------------------------------------- */
  const navbar = document.getElementById("navbar");

  const handleNavbarScroll = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
  };
  window.addEventListener("scroll", handleNavbarScroll);
  handleNavbarScroll();

  /* ---------------------------------------------------------
     3. SMOOTH SCROLLING (fallback for older browsers +
        offset handling; CSS scroll-behavior covers the rest)
  --------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });

  /* ---------------------------------------------------------
     4. ACTIVE NAV LINK WHILE SCROLLING
  --------------------------------------------------------- */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".navbar__link");

  const setActiveLink = () => {
    let currentId = "home";
    const scrollPos = window.scrollY + 130;

    sections.forEach((section) => {
      if (scrollPos >= section.offsetTop) {
        currentId = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle("active-link", link.getAttribute("href") === `#${currentId}`);
    });
  };
  window.addEventListener("scroll", setActiveLink);
  setActiveLink();

  /* ---------------------------------------------------------
     5. MENU CATEGORY FILTERING
  --------------------------------------------------------- */
  const filterButtons = document.querySelectorAll(".filter-btn");
  const menuCards = document.querySelectorAll(".menu-card");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");

      filterButtons.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");

      menuCards.forEach((card) => {
        const matches = filter === "all" || card.getAttribute("data-category") === filter;
        card.classList.toggle("is-hidden", !matches);
      });
    });
  });

  /* ---------------------------------------------------------
     6. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
  --------------------------------------------------------- */
  const revealItems = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  /* ---------------------------------------------------------
     7. ANIMATED STAT COUNTERS (triggered once visible)
  --------------------------------------------------------- */
  const statNumbers = document.querySelectorAll(".stat__number");

  const animateCount = (el) => {
    const target = parseInt(el.getAttribute("data-target"), 10);
    const suffix = el.getAttribute("data-suffix") || "";
    const duration = 1400;
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.round(target * eased);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  statNumbers.forEach((el) => statObserver.observe(el));

  /* ---------------------------------------------------------
     8. BACK TO TOP BUTTON
  --------------------------------------------------------- */
  const backToTop = document.getElementById("backToTop");

  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("visible", window.scrollY > 500);
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------------------------------------------------------
     9. CONTACT FORM VALIDATION
  --------------------------------------------------------- */
  const contactForm = document.getElementById("contactForm");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");
  const formSuccess = document.getElementById("formSuccess");

  const showError = (input, errorEl, message) => {
    input.closest(".form-group").classList.add("invalid");
    errorEl.textContent = message;
  };

  const clearError = (input, errorEl) => {
    input.closest(".form-group").classList.remove("invalid");
    errorEl.textContent = "";
  };

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    formSuccess.textContent = "";
    let isValid = true;

    // Name validation
    const nameError = document.getElementById("nameError");
    if (nameInput.value.trim().length < 2) {
      showError(nameInput, nameError, "Please enter your full name.");
      isValid = false;
    } else {
      clearError(nameInput, nameError);
    }

    // Email validation
    const emailError = document.getElementById("emailError");
    if (!isValidEmail(emailInput.value.trim())) {
      showError(emailInput, emailError, "Please enter a valid email address.");
      isValid = false;
    } else {
      clearError(emailInput, emailError);
    }

    // Message validation
    const messageError = document.getElementById("messageError");
    if (messageInput.value.trim().length < 10) {
      showError(messageInput, messageError, "Message should be at least 10 characters.");
      isValid = false;
    } else {
      clearError(messageInput, messageError);
    }

    if (isValid) {
      formSuccess.textContent = "Thank you! Your message has been sent — we'll be in touch shortly.";
      contactForm.reset();
      setTimeout(() => {
        formSuccess.textContent = "";
      }, 6000);
    }
  });

  // Clear individual field errors as the user types
  [
    [nameInput, "nameError"],
    [emailInput, "emailError"],
    [messageInput, "messageError"],
  ].forEach(([input, errorId]) => {
    input.addEventListener("input", () => {
      clearError(input, document.getElementById(errorId));
    });
  });

  /* ---------------------------------------------------------
     10. FOOTER YEAR
  --------------------------------------------------------- */
  document.getElementById("year").textContent = new Date().getFullYear();
});
