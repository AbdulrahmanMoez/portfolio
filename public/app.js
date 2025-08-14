// Theme toggle with localStorage persistence
(function () {
    const themeToggleButton = document.getElementById('theme-toggle');
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)');

    function applyTheme(theme) {
        if (theme === 'light') {
            document.documentElement.classList.add('theme-light');
        } else {
            document.documentElement.classList.remove('theme-light');
        }
    }

    const storedTheme = localStorage.getItem('theme');
    applyTheme(storedTheme || (prefersLight.matches ? 'light' : 'dark'));

    themeToggleButton?.addEventListener('click', () => {
        const isLight = document.documentElement.classList.toggle('theme-light');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
})();

// Mobile nav toggle
(function () {
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu');
    const overlay = document.getElementById('nav-overlay');
    const closeBtn = document.getElementById('nav-close');
    let lastFocused;
    let isAnimating = false;
    let scrollLockY = 0;

    function firstFocusable(container) {
        return container.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    }
    function trapFocus(e) {
        if (!menu?.classList.contains('show')) return;
        const focusables = menu.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
    }
    function openMenu() {
        if (isAnimating || menu?.classList.contains('show')) return;
        isAnimating = true;
        lastFocused = document.activeElement;
        toggle?.setAttribute('aria-expanded', 'true');
        if (menu) {
            menu.setAttribute('aria-hidden', 'false');
            // force reflow to ensure transition triggers
            void menu.offsetWidth;
            menu.classList.add('show');
        }
        if (overlay) {
            overlay.hidden = false;
            overlay.classList.add('show');
            overlay.style.pointerEvents = 'auto';
            // Body scroll lock without jump
            scrollLockY = window.scrollY || window.pageYOffset;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollLockY}px`;
            document.body.style.left = '0';
            document.body.style.right = '0';
            document.body.style.width = '100%';
        }
        const focusTarget = firstFocusable(menu) || closeBtn || toggle;
        focusTarget?.focus();
        document.addEventListener('keydown', trapFocus);
        menu?.addEventListener('transitionend', () => { isAnimating = false; }, { once: true });
    }

    function closeMenu() {
        if (isAnimating || !menu?.classList.contains('show')) return;
        isAnimating = true;
        toggle?.setAttribute('aria-expanded', 'false');
        if (menu) {
            menu.classList.remove('show');
            menu.setAttribute('aria-hidden', 'true');
        }
        if (overlay) {
            overlay.classList.remove('show');
            overlay.style.pointerEvents = 'none';
            // Restore body scroll position
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.left = '';
            document.body.style.right = '';
            document.body.style.width = '';
            window.scrollTo(0, scrollLockY);
            overlay.hidden = true;
        }
        document.removeEventListener('keydown', trapFocus);
        if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
        menu?.addEventListener('transitionend', () => { isAnimating = false; }, { once: true });
    }

    toggle?.addEventListener('click', () => {
        const expanded = toggle.getAttribute('aria-expanded') === 'true';
        if (!expanded) openMenu(); else closeMenu();
    });
    closeBtn?.addEventListener('click', closeMenu);
    // Close drawer when clicking a link (for anchors within the page)
    menu?.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener('click', () => {
            if (menu.classList.contains('show')) closeMenu();
        });
    });
    overlay?.addEventListener('click', () => {
        closeMenu();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu?.classList.contains('show')) { closeMenu(); }
    });
})();

// Copy email to clipboard and toast
(function () {
    const copyBtn = document.getElementById('copy-email');
    const emailLink = document.getElementById('email-link');
    copyBtn?.addEventListener('click', async () => {
        const email = emailLink?.textContent?.trim() || '';
        try {
            await navigator.clipboard.writeText(email);
            showToast('Email copied');
        } catch {
            showToast('Unable to copy');
        }
    });

    function showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        Object.assign(toast.style, {
            position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(2,6,23,0.9)', color: 'white', padding: '8px 12px', borderRadius: '10px',
            border: '1px solid rgba(56,189,248,0.4)', zIndex: 2000, boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        });
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 1500);
    }
})();

// Year update
document.getElementById('year').textContent = String(new Date().getFullYear());

// Section reveal on scroll
(function () {
    const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                entry.target.setAttribute('data-reveal', '');
                observer.unobserve(entry.target);
            }
        }
    }, { threshold: 0.12 });

    document.querySelectorAll('.section .container').forEach((el) => observer.observe(el));
})();

// Scrollspy: highlight active section link in mobile drawer
(function () {
    const links = Array.from(document.querySelectorAll('.nav-list a[href^="#"]'));
    const sections = links
        .map((a) => document.querySelector(a.getAttribute('href')))
        .filter(Boolean);
    if (!links.length || !sections.length) return;

    const spy = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const id = '#' + entry.target.id;
            const link = links.find((a) => a.getAttribute('href') === id);
            if (!link) return;
            if (entry.isIntersecting) {
                links.forEach((l) => l.classList.remove('is-active'));
                link.classList.add('is-active');
                links.forEach((l) => l.removeAttribute('aria-current'));
                link.setAttribute('aria-current', 'true');
            }
        });
    }, { rootMargin: '-50% 0px -45% 0px', threshold: [0, 1] });

    sections.forEach((sec) => spy.observe(sec));
    // Initial state in case first section is already in view on load
    const current = sections.find((sec) => {
        const rect = sec.getBoundingClientRect();
        return rect.top <= window.innerHeight * 0.55 && rect.bottom >= window.innerHeight * 0.45;
    });
    if (current) {
        const link = links.find((a) => a.getAttribute('href') === '#' + current.id);
        if (link) {
            links.forEach((l) => l.classList.remove('is-active'));
            link.classList.add('is-active');
            links.forEach((l) => l.removeAttribute('aria-current'));
            link.setAttribute('aria-current', 'true');
        }
    }
})();

// Floating back-to-top behavior
(function () {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    const onScroll = () => {
        if (window.scrollY > 400) btn.classList.add('show'); else btn.classList.remove('show');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

// Contact form progressive enhancement: custom feedback without redirect
(function () {
    const form = document.getElementById('contact-form');
    const statusEl = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');
    if (!form || !statusEl || !submitBtn) return;

    function setSubmitting(isSubmitting) {
        const label = submitBtn.querySelector('.btn-label');
        if (isSubmitting) {
            submitBtn.disabled = true;
            submitBtn.setAttribute('aria-busy', 'true');
            statusEl.className = 'form-status show';
            statusEl.textContent = 'Sending your message...';
            if (label) {
                const spinner = document.createElement('span');
                spinner.className = 'spinner';
                spinner.setAttribute('aria-hidden', 'true');
                label.before(spinner);
                label.textContent = 'Sending';
            }
        } else {
            submitBtn.disabled = false;
            submitBtn.removeAttribute('aria-busy');
            const spinner = submitBtn.querySelector('.spinner');
            if (spinner) spinner.remove();
            const label = submitBtn.querySelector('.btn-label');
            if (label) label.textContent = 'Send';
        }
    }

    // Basic client-side validation and live feedback
    const fields = {
        name: document.getElementById('name'),
        email: document.getElementById('email'),
        message: document.getElementById('message'),
    };
    const touched = { name: false, email: false, message: false };
    let submitAttempted = false;

    function validateField(input, show) {
        if (!input) return true;
        const wrapper = input.closest('.field');
        const valid = input.checkValidity();
        if (wrapper && show) {
            wrapper.classList.toggle('invalid', !valid);
            wrapper.classList.toggle('valid', valid);
        }
        return valid;
    }
    function updateSubmitState() {
        const ok = fields.name.checkValidity() && fields.email.checkValidity() && fields.message.checkValidity();
        submitBtn.disabled = !ok;
        submitBtn.style.opacity = ok ? '1' : '.7';
        return ok;
    }
    function showValidationIfNeeded(input) {
        const id = input.id;
        const show = submitAttempted || touched[id];
        validateField(input, show);
    }
    form.addEventListener('input', (e) => {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
            const id = e.target.id;
            if (e.target.value && id in touched) touched[id] = true;
            showValidationIfNeeded(e.target);
            updateSubmitState();
        }
    });
    ['name','email','message'].forEach((id) => {
        const el = fields[id];
        el?.addEventListener('blur', () => {
            touched[id] = true;
            showValidationIfNeeded(el);
            updateSubmitState();
        });
    });
    // Initial: disable submit if invalid, but do not show warnings yet
    updateSubmitState();

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        submitAttempted = true;
        // Show all validation messages on submit attempt
        validateField(fields.name, true);
        validateField(fields.email, true);
        validateField(fields.message, true);
        if (!updateSubmitState()) return;
        setSubmitting(true);
        const formData = new FormData(form);
        try {
            const res = await fetch(form.action, {
                method: form.method,
                body: formData,
                headers: { 'Accept': 'application/json' }
            });
            if (res.ok) {
                statusEl.textContent = 'Thanks — your message was sent successfully. I\'ll get back to you soon.';
                statusEl.className = 'form-status show success';
                form.reset();
                showToast('Thanks! Your message has been sent.', 'success');
            } else {
                const data = await res.json().catch(() => ({}));
                const msg = data?.errors?.[0]?.message || 'Sorry, something went wrong. Please try again.';
                statusEl.textContent = msg;
                statusEl.className = 'form-status show error';
                showToast(msg, 'error');
            }
        } catch {
            const msg = 'Network error. Please try again.';
            statusEl.textContent = msg;
            statusEl.className = 'form-status show error';
            showToast(msg, 'error');
        } finally {
            setSubmitting(false);
        }
    });

    function showToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast ${type || ''}`.trim();
        toast.innerHTML = `
            <span class="icon">${type === 'success' ? successIcon() : errorIcon()}</span>
            <span>${message}</span>
        `;
        document.body.appendChild(toast);
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
        });
        setTimeout(() => {
            toast.style.transition = 'opacity .4s ease, transform .4s ease';
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(10px)';
            setTimeout(() => toast.remove(), 450);
        }, 2200);
    }

    function successIcon() {
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="#22c55e"><path d="M9 16.2l-3.5-3.5L4 14.2l5 5 11-11-1.5-1.5z"/></svg>';
    }
    function errorIcon() {
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="#ef4444"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>';
    }
})();


