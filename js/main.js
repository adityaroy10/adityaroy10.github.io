(function () {
  'use strict';

  // ----- Scroll progress bar -----
  var scrollProgress = document.getElementById('scrollProgress');
  if (scrollProgress) {
    function updateProgress() {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var p = h > 0 ? (window.scrollY / h) * 100 : 0;
      scrollProgress.style.width = p + '%';
    }
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  // ----- Header hide on scroll down, show on scroll up -----
  var header = document.getElementById('siteHeader');
  var lastScroll = 0;
  if (header) {
    function toggleHeader() {
      var y = window.scrollY;
      if (y > 80) {
        if (y > lastScroll) header.classList.add('hidden');
        else header.classList.remove('hidden');
      } else {
        header.classList.remove('hidden');
      }
      lastScroll = y;
    }
    window.addEventListener('scroll', toggleHeader, { passive: true });
  }

  // ----- Scroll reveal (Intersection Observer) -----
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
          }
        });
      },
      { rootMargin: '0px 0px -40px 0px', threshold: 0.05 }
    );
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ----- Mobile nav toggle -----
  var toggle = document.querySelector('.nav__toggle');
  var nav = document.querySelector('.nav');
  var navLinks = document.querySelectorAll('.nav__links a');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('nav--open');
      toggle.setAttribute('aria-expanded', nav.classList.contains('nav--open'));
    });
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('nav--open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ----- Copy email -----
  var copyBtn = document.getElementById('copyEmail');
  var copyFeedback = document.getElementById('copyFeedback');
  var contactEmail = document.getElementById('contactEmail');
  if (copyBtn && copyFeedback && contactEmail) {
    copyBtn.addEventListener('click', function () {
      var email = contactEmail.getAttribute('href').replace('mailto:', '');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(
          function () {
            copyFeedback.textContent = 'Copied!';
            setTimeout(function () {
              copyFeedback.textContent = '';
            }, 2000);
          },
          function () {
            copyFeedback.textContent = 'Copy failed';
          }
        );
      } else {
        copyFeedback.textContent = 'Not supported';
      }
    });
  }

  // ----- Current year in footer -----
  var yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ----- Expandable cards: click to expand/collapse (experience + projects) -----
  function collapseAllExpandables() {
    document.querySelectorAll('.expandable.is-expanded').forEach(function (card) {
      card.classList.remove('is-expanded');
      var hint = card.querySelector('.expandable__hint');
      if (hint) hint.textContent = 'Click to expand';
    });
  }

  document.querySelectorAll('[data-focus-section]').forEach(function (section) {
    var cards = section.querySelectorAll('.expandable');
    cards.forEach(function (card) {
      card.addEventListener('click', function (e) {
        if (e.target.closest('a')) return;
        var isExpanded = card.classList.toggle('is-expanded');
        var hint = card.querySelector('.expandable__hint');
        if (hint) hint.textContent = isExpanded ? 'Click to collapse' : 'Click to expand';
        if (isExpanded) {
          cards.forEach(function (other) {
            if (other !== card) {
              other.classList.remove('is-expanded');
              var otherHint = other.querySelector('.expandable__hint');
              if (otherHint) otherHint.textContent = 'Click to expand';
            }
          });
        }
      });
    });
  });

  // Click outside expanded tile → collapse
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.expandable')) {
      collapseAllExpandables();
    }
  });

  // Scroll past section → collapse expanded tile in that section
  var focusSections = document.querySelectorAll('[data-focus-section]');
  if (focusSections.length && 'IntersectionObserver' in window) {
    var collapseObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            var section = entry.target;
            section.querySelectorAll('.expandable.is-expanded').forEach(function (card) {
              card.classList.remove('is-expanded');
              var hint = card.querySelector('.expandable__hint');
              if (hint) hint.textContent = 'Click to expand';
            });
          }
        });
      },
      { root: null, rootMargin: '0px', threshold: 0 }
    );
    focusSections.forEach(function (section) {
      collapseObserver.observe(section);
    });
  }

  // ----- Smooth scroll for anchor links (polyfill for older browsers) -----
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    var id = a.getAttribute('href');
    if (id === '#') return;
    var target = document.querySelector(id);
    if (target) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  });

  // ----- Easter egg: Konami code -----
  var konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
  var index = 0;
  document.addEventListener('keydown', function (e) {
    if (e.keyCode === konami[index]) {
      index++;
      if (index === konami.length) {
        index = 0;
        document.body.classList.add('easter-egg');
        setTimeout(function () {
          document.body.classList.remove('easter-egg');
        }, 3000);
      }
    } else {
      index = 0;
    }
  });
})();
