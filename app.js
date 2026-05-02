/**
 * @module Main
 * The primary entry point for Electo AI.
 */

import { initNotifications, addNotification } from './js/notifications.js';
import { initSimulation } from './js/simulation.js';
import { initChecklist } from './js/checklist.js';
import { initChat, setGeminiKey } from './js/chat.js';
import { initEducation } from './js/education.js';
import { initQuiz } from './js/quiz.js';
import { initNews } from './js/news.js';
import { initI18n, toggleLanguage } from './js/i18n.js';

document.addEventListener('DOMContentLoaded', () => {
    try {
        initI18n();
        initNavigation();
        initTheme();
        initFeatures();
        registerServiceWorker();
    } catch (error) {
        console.error('Electo Initialization Failed:', error);
    }
});

function initFeatures() {
    const features = [
        { name: 'Notifications', init: initNotifications },
        { name: 'Simulation', init: initSimulation },
        { name: 'Checklist', init: initChecklist },
        { name: 'Chat', init: initChat },
        { name: 'Education', init: initEducation },
        { name: 'Quiz', init: initQuiz },
        { name: 'News', init: initNews },
        { name: 'Language Toggle', init: initLanguageToggle },
        { name: 'Heartbeat', init: startHeartbeat }
    ];

    features.forEach(feature => {
        try {
            feature.init();
        } catch (error) {
            console.error(`Feature [${feature.name}] failed to initialize:`, error);
        }
    });
}

function initTheme() {
    const themeBtn = document.getElementById('theme-toggle');
    if (!themeBtn) return;

    const savedTheme = localStorage.getItem('electo_theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeBtn.addEventListener('click', () => {
        const current = document.body.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', next);
        localStorage.setItem('electo_theme', next);
        updateThemeIcon(next);
        addNotification(`Switched to ${next} mode`);
    });
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('#theme-toggle i');
    if (!icon) return;
    icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}

function initNavigation() {
    const navItems = document.querySelectorAll('.nav-links li');
    const sections = document.querySelectorAll('.view-section');

    function navigateTo(targetId, updateHash = true) {
        // Find if the target section exists
        const targetSection = document.getElementById(targetId);
        if (!targetSection) return;

        navItems.forEach(nav => {
            nav.classList.toggle('active', nav.getAttribute('data-target') === targetId);
        });

        sections.forEach(sec => {
            sec.classList.toggle('hidden', sec.id !== targetId);
            sec.classList.toggle('active', sec.id === targetId);
        });

        const titleEl = document.getElementById('page-title');
        if (titleEl) {
            titleEl.setAttribute('data-i18n', `page-title-${targetId}`);
            initI18n(); // Re-apply translations for the new title
        }
        
        // Scroll content area to top
        document.querySelector('.scrollable-content')?.scrollTo(0, 0);

        // Update URL hash if requested
        if (updateHash) {
            window.location.hash = targetId;
        }
    }

    // Handle clicks on navigation items
    navItems.forEach(item => {
        item.addEventListener('click', () => navigateTo(item.getAttribute('data-target')));
    });

    // Handle initial hash on load
    window.addEventListener('load', () => {
        const hash = window.location.hash.replace('#', '');
        if (hash) {
            navigateTo(hash, false);
        }
    });

    // Handle browser back/forward buttons
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.replace('#', '');
        if (hash) {
            navigateTo(hash, false);
        } else {
            navigateTo('dashboard', false); // Default
        }
    });
}

function initLanguageToggle() {
    const btn = document.getElementById('lang-toggle');
    if (!btn) return;

    // Set initial text
    const savedLang = localStorage.getItem('electo_lang') || 'en';
    btn.textContent = savedLang === 'en' ? 'English' : 'हिंदी';

    btn.addEventListener('click', () => {
        const nextLabel = toggleLanguage();
        btn.textContent = nextLabel;
        addNotification(`Language changed to ${nextLabel}`);
    });
}

function startHeartbeat() {
    const healthText = document.querySelector('.health-text');
    const pulse = document.querySelector('.pulse');

    setInterval(() => {
        const isOnline = navigator.onLine;
        const hasKey = !!localStorage.getItem('gemini_api_key');

        if (isOnline && hasKey) {
            if (healthText) healthText.textContent = 'Electo Online';
            if (pulse) pulse.style.background = 'var(--success)';
        } else if (isOnline) {
            if (healthText) healthText.textContent = 'Lite Mode';
            if (pulse) pulse.style.background = 'var(--warning)';
        } else {
            if (healthText) healthText.textContent = 'Offline';
            if (pulse) pulse.style.background = 'var(--danger)';
        }
    }, 5000);
}

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(() => console.log('PWA Ready'))
            .catch(err => console.error('PWA Error', err));
    }
}
