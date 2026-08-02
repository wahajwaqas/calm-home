/* ============================================================
   The Connected Parent — Landing Page Interactions
   NOTE: The registration form is a demo. Connect it to
   Natasha's GoHighLevel registration form before publishing.
   ============================================================ */

(function () {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- Footer year ---------- */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- Scroll reveal ---------- */
    const revealEls = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        revealEls.forEach((el) => observer.observe(el));
    } else {
        revealEls.forEach((el) => el.classList.add('in-view'));
    }

    // Staggered delays for card grids
    document.querySelectorAll('.learn-card, .testimonial').forEach((el, i) => {
        el.classList.add('reveal');
        el.style.setProperty('--delay', (i * 0.1) + 's');
    });

    // Re-watch the newly marked elements
    if ('IntersectionObserver' in window) {
        const observer2 = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        document.querySelectorAll('.learn-card:not(.in-view), .testimonial:not(.in-view)').forEach((el) => {
            observer2.observe(el);
        });
    }

    /* ---------- FAQ accordion ---------- */
    document.querySelectorAll('.faq-item').forEach((item) => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            document.querySelectorAll('.faq-item.open').forEach((openItem) => {
                openItem.classList.remove('open');
                openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                openItem.querySelector('.faq-answer').style.maxHeight = null;
            });

            if (!isOpen) {
                item.classList.add('open');
                question.setAttribute('aria-expanded', 'true');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    /* ---------- Smooth scroll (respect reduced motion) ---------- */
    if (!prefersReducedMotion && 'scrollBehavior' in document.documentElement.style) {
        document.querySelectorAll('a[href^="#"]').forEach((link) => {
            link.addEventListener('click', (e) => {
                const id = link.getAttribute('href');
                if (id.length > 1) {
                    const target = document.querySelector(id);
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            });
        });
    }

    /* ---------- Registration form (demo) ----------
       Replace this handler with a real submit to Natasha's
       GoHighLevel form (e.g. form action / custom code).     */
    const form = document.getElementById('reg-form');
    const success = document.getElementById('reg-success');
    const resetBtn = document.getElementById('reset-form');

    function setFieldState(field, message) {
        const wrapper = field.closest('.form-field');
        const errorEl = wrapper.querySelector('.form-error');
        if (message) {
            wrapper.classList.add('invalid');
            errorEl.textContent = message;
        } else {
            wrapper.classList.remove('invalid');
            errorEl.textContent = '';
        }
    }

    function validateField(field) {
        const name = field.getAttribute('name');
        if (name === 'name') {
            return field.value.trim().length >= 2
                ? '' : 'Please enter your name.';
        }
        if (name === 'email') {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(field.value.trim())
                ? '' : 'Please enter a valid email address.';
        }
        return '';
    }

    function clearErrors() {
        form.querySelectorAll('.form-field').forEach((field) => setFieldState(field.querySelector('input'), ''));
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            clearErrors();

            let firstInvalid = null;
            form.querySelectorAll('input').forEach((input) => {
                const message = validateField(input);
                setFieldState(input, message);
                if (message && !firstInvalid) firstInvalid = input;
            });

            if (firstInvalid) {
                firstInvalid.focus();
                return;
            }

            // Demo success state — in production this posts to the GHL form
            form.hidden = true;
            success.hidden = false;
            success.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'center' });
        });

        // Live re-validate on input
        form.querySelectorAll('input').forEach((input) => {
            input.addEventListener('input', () => {
                if (input.closest('.form-field').classList.contains('invalid')) {
                    setFieldState(input, validateField(input));
                }
            });
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            form.reset();
            success.hidden = true;
            form.hidden = false;
        });
    }
})();
