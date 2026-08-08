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
});

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

