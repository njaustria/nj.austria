const progressIndicator = document.querySelector('.progress-indicator');
const backToTopButton = document.querySelector('.back-to-top');
const themeToggles = document.querySelectorAll('.theme-toggle');
const revealItems = document.querySelectorAll('.reveal');
const typedText = document.querySelector('.typed-text');
const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
const mobileLinks = document.querySelectorAll('.mobile-nav a');
const sectionLinks = [...sidebarLinks, ...mobileLinks];
let activeLinkLockUntil = 0;

const updateScrollProgress = () => {
    const scrollTop = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const progress = height > 0 ? (scrollTop / height) * 100 : 0;
    progressIndicator.style.width = `${Math.min(progress, 100)}%`;

    backToTopButton.style.display = scrollTop > 600 ? 'inline-flex' : 'none';
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15
})

revealItems.forEach((item) => observer.observe(item));

const animateCounters = () => {
    const counters = document.querySelectorAll('[data-counter]');

    counters.forEach((counter) => {
        const target = Number(counter.dataset.counter);
        const duration = 1400;
        const start = performance.now();

        const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const value = Math.floor(progress * target);
            counter.textContent = value;

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                counter.textContent = target;
            }
        };

        const counterObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    requestAnimationFrame(step);
                    obs.disconnect();
                }
            });
        }, { threshold: 0.7 });

        counterObserver.observe(counter);
    });
};

const typeWords = JSON.parse(typedText.dataset.typed);
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

const typeLoop = () => {
    const currentWord = typeWords[wordIndex];

    if (!currentWord) {
        return;
    }

    typedText.textContent = currentWord.slice(0, charIndex);

    if (!isDeleting && charIndex < currentWord.length) {
        charIndex += 1;
    } else if (isDeleting && charIndex > 0) {
        charIndex -= 1;
    } else {
        isDeleting = !isDeleting;

        if (!isDeleting) {
            wordIndex = (wordIndex + 1) % typeWords.length;
        }
    }

    const typingSpeed = isDeleting ? 60 : 100;
    setTimeout(typeLoop, typingSpeed);
};

const setActiveLink = (activeLink) => {
    sectionLinks.forEach((link) => {
        link.classList.toggle('active', link === activeLink);
    });
    activeLinkLockUntil = performance.now() + 800;
};

const updateActiveLink = () => {
    if (performance.now() < activeLinkLockUntil) {
        return;
    }

    const scrollPosition = window.scrollY + 140;

    document.querySelectorAll('main section[id]').forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            sectionLinks.forEach((link) => {
                const targetId = link.getAttribute('href');
                link.classList.toggle('active', targetId === `#${section.id}`);
            });
        }
    });
};

const syncThemeIcons = () => {
    const isDark = document.body.classList.contains('dark-mode');
    themeToggles.forEach((btn) => {
        const icon = btn.querySelector('i');
        if (icon) icon.className = isDark ? 'bi bi-sun' : 'bi bi-moon-stars';
    });
};

themeToggles.forEach((btn) => {
    btn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        syncThemeIcons();
    });
});

syncThemeIcons();

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
        const targetId = anchor.getAttribute('href');
        if (!targetId || targetId === '#') {
            return;
        }

        const target = document.querySelector(targetId);
        if (!target) {
            return;
        }

        event.preventDefault();
        setActiveLink(anchor);
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

backToTopButton?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('scroll', () => {
    updateScrollProgress();
    updateActiveLink();
});

window.addEventListener('load', () => {
    updateScrollProgress();
    updateActiveLink();
    animateCounters();
    typeLoop();
});
