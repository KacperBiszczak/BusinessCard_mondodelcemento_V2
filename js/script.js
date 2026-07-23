/* =========================================================
   NAZWA FIRMY — skrypt strony
   ========================================================= */
(function () {
  "use strict";

  /* ---------- rok w stopce ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- nav: tło po przewinięciu ---------- */
  var nav = document.getElementById("nav");
  var onScroll = function () {
    if (window.scrollY > 12) nav.classList.add("is-scrolled");
    else nav.classList.remove("is-scrolled");

    var toTop = document.getElementById("toTop");
    if (toTop) {
      if (window.scrollY > 600) toTop.classList.add("is-visible");
      else toTop.classList.remove("is-visible");
    }
  };
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- nav: menu mobilne ---------- */
  var burger = document.getElementById("navBurger");
  var navLinks = document.getElementById("navLinks");
  var navBackdrop = document.getElementById("navBackdrop");

  var openMenu = function () {
    nav.classList.add("is-open");
    burger.setAttribute("aria-expanded", "true");
    burger.setAttribute("aria-label", "Zamknij menu");
    document.body.style.overflow = "hidden";
  };

  var closeMenu = function (returnFocus) {
    nav.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Otwórz menu");
    document.body.style.overflow = "";
    if (returnFocus) burger.focus();
  };

  if (burger && navLinks) {
    burger.addEventListener("click", function () {
      if (nav.classList.contains("is-open")) closeMenu(false);
      else openMenu();
    });
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        closeMenu(false);
      });
    });
    if (navBackdrop) {
      navBackdrop.addEventListener("click", function () {
        closeMenu(false);
      });
    }
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        closeMenu(true);
      }
    });
  }

  /* ---------- przycisk "do góry" ---------- */
  var toTop = document.getElementById("toTop");
  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------- akordeon FAQ ---------- */
  var faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(function (item) {
    var btn = item.querySelector(".faq-q");
    var answer = item.querySelector(".faq-a");

    var setState = function (open) {
      item.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      answer.style.maxHeight = open ? answer.scrollHeight + "px" : 0;
    };

    setState(item.classList.contains("is-open"));

    btn.addEventListener("click", function () {
      var open = !item.classList.contains("is-open");
      // zamknij pozostałe (opcjonalnie — jeden otwarty naraz)
      faqItems.forEach(function (other) {
        if (other !== item) {
          other.classList.remove("is-open");
          other.querySelector(".faq-q").setAttribute("aria-expanded", "false");
          other.querySelector(".faq-a").style.maxHeight = 0;
        }
      });
      setState(open);
    });
  });

  window.addEventListener("resize", function () {
    document.querySelectorAll(".faq-item.is-open .faq-a").forEach(function (a) {
      a.style.maxHeight = a.scrollHeight + "px";
    });
  });

  /* ---------- formularz kontaktowy ---------- */
  var form = document.getElementById("contactForm");
  var statusBox = document.getElementById("formStatus");

  var showStatus = function (message, ok) {
    statusBox.textContent = message;
    statusBox.className = "form-status is-visible " + (ok ? "ok" : "err");
  };

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // honeypot — jeśli wypełnione, prawdopodobnie bot: ignorujemy cicho
      var hp = form.querySelector("#website");
      if (hp && hp.value) {
        showStatus("Dziękujemy! Wiadomość została wysłana.", true);
        form.reset();
        return;
      }

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = "Wysyłanie…";

      var formData = new FormData(form);

      fetch("php/contact.php", {
        method: "POST",
        body: formData,
        headers: { "X-Requested-With": "XMLHttpRequest" },
      })
        .then(function (res) {
          return res.json().catch(function () {
            throw new Error("Nieprawidłowa odpowiedź serwera.");
          });
        })
        .then(function (data) {
          if (data && data.success) {
            showStatus(
              data.message || "Dziękujemy! Wiadomość została wysłana — odezwiemy się wkrótce.",
              true
            );
            form.reset();
          } else {
            showStatus(
              (data && data.message) ||
                "Nie udało się wysłać wiadomości. Spróbuj ponownie lub zadzwoń.",
              false
            );
          }
        })
        .catch(function () {
          showStatus(
            "Wystąpił błąd połączenia. Spróbuj ponownie lub napisz bezpośrednio na e-mail.",
            false
          );
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = "Wyślij zapytanie";
        });
    });
  }
})();
