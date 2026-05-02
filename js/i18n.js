/**
 * @module i18n
 * Manages native site-wide translations for core UI elements.
 * Provides instant language switching without external API dependency.
 */

const translations = {
    en: {
        "brand-name": "Electo AI",
        "nav-dashboard": "Home",
        "nav-checklist": "Prep",
        "nav-chat": "Ask Electo",
        "nav-education": "Learn",
        "nav-quiz": "Quiz",
        "page-title-dashboard": "Information Center",
        "page-title-checklist": "Voting Preparation",
        "page-title-chat": "AI Assistant",
        "page-title-education": "Voter Academy",
        "page-title-quiz": "Test Your Knowledge",
        "booth-btn": "Locate Me",
        "booth-title": "Smart Booth Locator",
        "news-title": "Latest Updates",
        "system-optimal": "AI Online",
        "limited-mode": "Lite Mode",
        "offline-mode": "Offline",
        "phase-1": "Announcement",
        "phase-1-desc": "Election dates and phases are declared by the ECI.",
        "phase-2": "Notification",
        "phase-2-desc": "Official process begins for a specific constituency.",
        "phase-3": "Nominations",
        "phase-3-desc": "Candidates file their papers to contest the election.",
        "phase-4": "Scrutiny",
        "phase-4-desc": "Verification of candidate documents by RO.",
        "phase-5": "Polling",
        "phase-5-desc": "Citizens visit booths to cast their secret ballots.",
        "phase-6": "Counting",
        "phase-6-desc": "Votes are counted and results are certified."
    },
    hi: {
        "brand-name": "इलेक्टो AI",
        "nav-dashboard": "होम",
        "nav-checklist": "तैयारी",
        "nav-chat": "इलेक्टो से पूछें",
        "nav-education": "सीखें",
        "nav-quiz": "क्विज",
        "page-title-dashboard": "सूचना केंद्र",
        "page-title-checklist": "वोटिंग की तैयारी",
        "page-title-chat": "एआई मददगार",
        "page-title-education": "वोटर एकेडमी",
        "page-title-quiz": "अपनी जानकारी जांचें",
        "booth-btn": "खोजें",
        "booth-title": "स्मार्ट बूथ लोकेटर",
        "news-title": "ताजा खबरें",
        "system-optimal": "एआई ऑनलाइन",
        "limited-mode": "लाइट मोड",
        "offline-mode": "ऑफलाइन",
        "phase-1": "घोषणा",
        "phase-1-desc": "ECI द्वारा चुनाव की तारीखों की घोषणा।",
        "phase-2": "अधिसूचना",
        "phase-2-desc": "चुनाव की आधिकारिक प्रक्रिया शुरू होती है।",
        "phase-3": "नामांकन",
        "phase-3-desc": "उम्मीदवार चुनाव लड़ने के लिए पर्चा भरते हैं।",
        "phase-4": "जांच",
        "phase-4-desc": "उम्मीदवारों के दस्तावेजों की जांच होती है।",
        "phase-5": "मतदान",
        "phase-5-desc": "नागरिक बूथ पर जाकर अपना वोट डालते हैं।",
        "phase-6": "गणना",
        "phase-6-desc": "वोटों की गिनती और परिणाम की घोषणा।"
    }
};

let currentLang = localStorage.getItem('electo_lang') || 'en';

export function initI18n() {
    applyTranslations(currentLang);
}

export function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'hi' : 'en';
    localStorage.setItem('electo_lang', currentLang);
    applyTranslations(currentLang);
    return currentLang === 'en' ? 'English' : 'हिंदी';
}

function applyTranslations(lang) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            if (el.tagName === 'INPUT' && el.placeholder) {
                el.placeholder = translations[lang][key];
            } else {
                el.textContent = translations[lang][key];
            }
        }
    });
    
    document.documentElement.lang = lang;
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));
}

export function t(key) {
    return translations[currentLang][key] || key;
}
