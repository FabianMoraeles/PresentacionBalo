/* ==========================================================================
   OSWALDO VASSAUX — interacciones
   Progresivas: sin JS la página queda completa y legible.
   ========================================================================== */

(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------------------------------------------------------------
     1. Año actual en el footer
     --------------------------------------------------------------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------------------------------------------------------------
     2. Navegación móvil
     --------------------------------------------------------------- */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('primaryNav');
  var desktop = window.matchMedia('(min-width: 1080px)');

  function setNav(open) {
    if (!toggle || !nav) return;
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setNav(toggle.getAttribute('aria-expanded') !== 'true');
    });

    // Cerrar al elegir un destino
    nav.addEventListener('click', function (event) {
      if (event.target.closest('a') && !desktop.matches) setNav(false);
    });

    // Escape cierra y devuelve el foco al botón
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setNav(false);
        toggle.focus();
      }
    });

    // Al pasar a escritorio, limpiar el estado móvil
    desktop.addEventListener('change', function (event) {
      if (event.matches) setNav(false);
    });
  }

  /* ---------------------------------------------------------------
     3. Header con fondo al hacer scroll
     --------------------------------------------------------------- */
  var header = document.getElementById('header');

  if (header) {
    var ticking = false;

    var updateHeader = function () {
      header.classList.toggle('is-stuck', window.scrollY > 12);
      ticking = false;
    };

    window.addEventListener('scroll', function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateHeader);
      }
    }, { passive: true });

    updateHeader();
  }

  /* ---------------------------------------------------------------
     4. Revelado al hacer scroll
     Si no hay IntersectionObserver o el usuario pidió menos
     movimiento, todo se muestra de inmediato.
     --------------------------------------------------------------- */
  var revealables = document.querySelectorAll('.reveal');

  function showAll() {
    Array.prototype.forEach.call(revealables, function (el) {
      el.classList.add('is-visible');
    });
  }

  if (!('IntersectionObserver' in window) || prefersReducedMotion.matches) {
    showAll();
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    Array.prototype.forEach.call(revealables, function (el) {
      revealObserver.observe(el);
    });

    // Si el usuario activa "reducir movimiento" durante la visita
    prefersReducedMotion.addEventListener('change', function (event) {
      if (event.matches) {
        revealObserver.disconnect();
        showAll();
      }
    });
  }

  /* ---------------------------------------------------------------
     5. Página activa en la navegación (sitio multi-página)
     --------------------------------------------------------------- */
  var here = location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav__link').forEach(function (link) {
    var target = link.getAttribute('href').split('/').pop();
    if (target === here) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });

})();
