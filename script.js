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

