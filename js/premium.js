/* ============================================================
   IGNITE — Premium Interaction Engine
   Handles scroll reveals, cursor glow, counter animations,
   parallax, and page load transitions.
   Pure vanilla JS. No dependencies. No jQuery.
   ============================================================ */

(function () {
    'use strict';

    // --- Page Load Transition ---
    function initPageLoad() {
        document.body.classList.add('loaded');
    }

    // Shared observer — created once, reused for dynamic content
    var revealObserver = null;

    function getRevealObserver() {
        if (revealObserver) return revealObserver;
        revealObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.08, rootMargin: '0px 0px -20px 0px' }
        );
        return revealObserver;
    }

    // --- Scroll Reveal (IntersectionObserver) ---
    function initScrollReveal() {
        var obs = getRevealObserver();
        document.querySelectorAll('[data-reveal]').forEach(function (el) {
            obs.observe(el);
        });
    }

    // --- PUBLIC API: observe newly injected dynamic elements ---
    window.premiumObserve = function (container) {
        var obs = getRevealObserver();
        var root = container || document;
        root.querySelectorAll('[data-reveal]').forEach(function (el) {
            obs.observe(el);
        });
        // Wire cursor glow for new elements
        root.querySelectorAll('.cursor-glow').forEach(function (el) {
            if (el._glowBound) return;
            el._glowBound = true;
            el.addEventListener('mousemove', function (e) {
                var rect = el.getBoundingClientRect();
                el.style.setProperty('--glow-x', (e.clientX - rect.left) + 'px');
                el.style.setProperty('--glow-y', (e.clientY - rect.top) + 'px');
            });
        });
    };

    // --- Cursor Glow Tracker ---
    function initCursorGlow() {
        document.querySelectorAll('.cursor-glow').forEach(function (el) {
            if (el._glowBound) return;
            el._glowBound = true;
            el.addEventListener('mousemove', function (e) {
                var rect = el.getBoundingClientRect();
                el.style.setProperty('--glow-x', (e.clientX - rect.left) + 'px');
                el.style.setProperty('--glow-y', (e.clientY - rect.top) + 'px');
            });
        });
    }

    // --- Counter Animation ---
    function initCountUp() {
        var counters = document.querySelectorAll('.count-up');
        if (!counters.length) return;

        var obs = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        obs.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        counters.forEach(function (el) { obs.observe(el); });
    }

    function animateCounter(el) {
        var target = parseInt(el.getAttribute('data-target'), 10);
        var suffix = el.getAttribute('data-suffix') || '';
        var duration = 1800;
        var start = performance.now();

        function tick(now) {
            var elapsed = now - start;
            var progress = Math.min(elapsed / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            var current = Math.round(eased * target);
            el.textContent = current + suffix;
            if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
    }

    // --- Parallax Background ---
    function initParallax() {
        var parallaxElements = document.querySelectorAll('.parallax-bg');
        if (!parallaxElements.length) return;

        var ticking = false;

        window.addEventListener('scroll', function () {
            if (!ticking) {
                requestAnimationFrame(function () {
                    var scrollY = window.scrollY;
                    parallaxElements.forEach(function (el) {
                        var speed = parseFloat(el.getAttribute('data-parallax-speed')) || 0.3;
                        el.style.transform = 'translateY(' + scrollY * speed + 'px) scale(1.1)';
                    });
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // --- Navbar Scroll Shrink ---
    function initNavbarScroll() {
        var header = document.querySelector('header.fixed, header[class*="fixed"]');
        if (!header) return;

        var ticking = false;

        window.addEventListener('scroll', function () {
            if (!ticking) {
                requestAnimationFrame(function () {
                    if (window.scrollY > 60) {
                        header.classList.add('scrolled');
                        header.style.boxShadow = '0 10px 40px rgba(0,0,0,0.5)';
                    } else {
                        header.classList.remove('scrolled');
                        header.style.boxShadow = '';
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // --- Initialize Everything ---
    function init() {
        initPageLoad();
        initScrollReveal();
        initCursorGlow();
        initCountUp();
        initParallax();
        initNavbarScroll();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
