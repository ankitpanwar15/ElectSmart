// Core Application Logic

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    checkNetworkStatus();
    registerServiceWorker();
    initSettings();
    
    // Initialize feature modules if they exist
    if(typeof initNotifications === 'function') initNotifications();
    if(typeof initSimulation === 'function') initSimulation();
    if(typeof initChecklist === 'function') initChecklist();
    if(typeof initChat === 'function') initChat();
    if(typeof initEducation === 'function') initEducation();
    if(typeof initQuiz === 'function') initQuiz();
    
    initLanguageToggle();
});

// Settings & API Management
function initSettings() {
    const modal = document.getElementById('settings-modal');
    const openBtn = document.getElementById('settings-btn');
    const closeBtn = document.getElementById('close-settings');
    const saveBtn = document.getElementById('save-settings');
    const clearBtn = document.getElementById('clear-cache');
    const keyInput = document.getElementById('api-key-input');

    if (!modal || !openBtn) return;

    // Load existing key
    keyInput.value = localStorage.getItem('gemini_api_key') || '';

    openBtn.addEventListener('click', () => modal.classList.remove('hidden'));
    closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
    
    saveBtn.addEventListener('click', () => {
        const key = keyInput.value.trim();
        if (window.setGeminiKey) {
            window.setGeminiKey(key);
            modal.classList.add('hidden');
            // Hard refresh to apply new AI logic
            setTimeout(() => window.location.reload(), 500);
        }
    });

    clearBtn.addEventListener('click', () => {
        if (confirm('This will delete all offline data and re-download assets. Proceed?')) {
            if ('serviceWorker' in navigator) {
                caches.keys().then(names => {
                    for (let name of names) caches.delete(name);
                });
                window.location.reload();
            }
        }
    });

    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.add('hidden');
    });
}

// Language Toggle Logic
function initLanguageToggle() {
    const toggleBtn = document.getElementById('lang-toggle');
    if (!toggleBtn) return;

    let currentLang = 'en';

    toggleBtn.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'hi' : 'en';
        toggleBtn.textContent = currentLang === 'en' ? 'हिंदी' : 'English';
        
        // Find the hidden Google Translate dropdown
        const select = document.querySelector('.goog-te-combo');
        if (select) {
            select.value = currentLang;
            select.dispatchEvent(new Event('change'));
        }
        
        if (window.addNotification) {
            window.addNotification(currentLang === 'en' ? 'Language: English' : 'भाषा: हिंदी');
        }
    });
}

// Navigation Logic
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-links li');
    const sections = document.querySelectorAll('.view-section');
    const pageTitle = document.getElementById('page-title');

    const titles = {
        'dashboard': 'Real-Time Dashboard',
        'checklist': 'My Voter Checklist',
        'chat': 'AI Election Assistant',
        'education': 'Learn the System',
        'quiz': 'Knowledge Quiz'
    };

    function navigateTo(targetId) {
        // Update active nav
        navItems.forEach(nav => {
            if (nav.getAttribute('data-target') === targetId) {
                nav.classList.add('active');
            } else {
                nav.classList.remove('active');
            }
        });

        // Update active section
        sections.forEach(sec => {
            if (sec.id === targetId) {
                sec.classList.remove('hidden');
                sec.classList.add('active');
            } else {
                sec.classList.remove('active');
                sec.classList.add('hidden');
            }
        });

        // Update title
        pageTitle.textContent = titles[targetId];
    }

    navItems.forEach(item => {
        item.addEventListener('click', () => navigateTo(item.getAttribute('data-target')));
        
        // Accessibility: Keyboard support
        item.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                navigateTo(item.getAttribute('data-target'));
            }
        });
    });
}

// Network Status Monitoring
function checkNetworkStatus() {
    const statusEl = document.getElementById('network-status');
    if (!statusEl) return;
    
    function updateStatus() {
        if (navigator.onLine) {
            statusEl.className = 'network-status online';
            statusEl.innerHTML = '<i class="fa-solid fa-wifi"></i> <span>Online</span>';
        } else {
            statusEl.className = 'network-status offline';
            statusEl.innerHTML = '<i class="fa-solid fa-wifi"></i> <span>Offline Mode</span>';
        }
    }

    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    updateStatus(); 
}

// Service Worker Registration
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js')
                .then(reg => console.log('SW Registered'))
                .catch(err => console.log('SW Fail'));
        });
    }
}
