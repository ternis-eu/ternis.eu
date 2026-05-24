// Theme Management
const THEME_KEY = 'ternis-theme';
const THEMES = {
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system'
};

class ThemeManager {
    constructor() {
        this.currentTheme = this.getSavedTheme();
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.setupEventListeners();
        this.updateButtons();
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (this.currentTheme === THEMES.SYSTEM) {
                this.applySystemTheme();
            }
        });
    }

    getSavedTheme() {
        const saved = localStorage.getItem(THEME_KEY);
        return saved || THEMES.SYSTEM;
    }

    saveTheme(theme) {
        localStorage.setItem(THEME_KEY, theme);
    }

    applyTheme(theme) {
        this.currentTheme = theme;
        this.saveTheme(theme);

        if (theme === THEMES.SYSTEM) {
            this.applySystemTheme();
        } else {
            document.documentElement.setAttribute('data-theme', theme);
        }

        this.updateButtons();
    }

    applySystemTheme() {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches 
            ? THEMES.DARK 
            : THEMES.LIGHT;
        document.documentElement.setAttribute('data-theme', systemTheme);
    }

    setupEventListeners() {
        document.getElementById('theme-light')?.addEventListener('click', () => {
            this.applyTheme(THEMES.LIGHT);
        });

        document.getElementById('theme-dark')?.addEventListener('click', () => {
            this.applyTheme(THEMES.DARK);
        });

        document.getElementById('theme-system')?.addEventListener('click', () => {
            this.applyTheme(THEMES.SYSTEM);
        });
    }

    updateButtons() {
        const buttons = {
            [THEMES.LIGHT]: document.getElementById('theme-light'),
            [THEMES.DARK]: document.getElementById('theme-dark'),
            [THEMES.SYSTEM]: document.getElementById('theme-system')
        };

        Object.entries(buttons).forEach(([theme, button]) => {
            if (button) {
                if (theme === this.currentTheme) {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
            }
        });
    }
}

// Localization Management
const LANG_KEY = 'ternis-lang';
const LANGS = {
    DE: 'de',
    EN: 'en'
};

const translations = {
    de: {
        subtitle: 'Familie Ternis Portal',
        description: 'Willkommen im digitalen Zuhause der Familie Ternis. Entdecken Sie unsere individuellen Projekte, Portfolios und Kontaktinformationen.',
        email_desc: 'Unsere E-Mail-Infrastruktur ist auf eine neue Domain umgezogen.',
        email_use: 'Bitte nutzen Sie die neue',
        email_future: 'Domain für alle zukünftige Korrespondenz.',
        impressum: 'Impressum',
        impressum_title: 'Impressum',
        impressum_subtitle: 'Angaben gemäß § 5 DDG',
        impressum_operator: 'Verantwortlicher (Betreiber)',
        impressum_contact: 'Kontakt',
        impressum_phone: 'Telefon:',
        impressum_phone_desc: '(nicht öffentlich)'
    },
    en: {
        subtitle: 'Ternis Family Portal',
        description: 'Welcome to the digital home of the Ternis family. Explore our individual projects, portfolios, and contact information.',
        email_desc: 'Our email infrastructure has moved to a new domain.',
        email_use: 'Please use the new',
        email_future: 'domain for all future correspondence.',
        impressum: 'Imprint',
        impressum_title: 'Imprint',
        impressum_subtitle: 'Information pursuant to § 5 DDG (German Telemedia Act)',
        impressum_operator: 'Responsible (Operator)',
        impressum_contact: 'Contact',
        impressum_phone: 'Phone:',
        impressum_phone_desc: '(not public)'
    }
};

class LanguageManager {
    constructor() {
        this.currentLang = this.getSavedLang();
        this.init();
    }

    init() {
        this.applyLang(this.currentLang);
        this.setupEventListeners();
    }

    getSavedLang() {
        return localStorage.getItem(LANG_KEY) || LANGS.DE;
    }

    saveLang(lang) {
        localStorage.setItem(LANG_KEY, lang);
    }

    applyLang(lang) {
        this.currentLang = lang;
        this.saveLang(lang);
        document.documentElement.setAttribute('lang', lang);

        // Update active button state
        document.getElementById('lang-de').classList.toggle('active', lang === LANGS.DE);
        document.getElementById('lang-en').classList.toggle('active', lang === LANGS.EN);

        // Translate elements
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });
    }

    setupEventListeners() {
        document.getElementById('lang-de')?.addEventListener('click', () => {
            this.applyLang(LANGS.DE);
        });

        document.getElementById('lang-en')?.addEventListener('click', () => {
            this.applyLang(LANGS.EN);
        });
    }
}

// Modal Management
class ModalManager {
    constructor() {
        this.modal = document.getElementById('impressum-modal');
        this.openBtn = document.getElementById('open-impressum');
        this.closeBtn = document.getElementById('close-impressum');

        if (this.modal && this.openBtn && this.closeBtn) {
            this.init();
        }
    }

    init() {
        this.openBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.openModal();
        });

        this.closeBtn.addEventListener('click', () => {
            this.closeModal();
        });

        // Close when clicking outside content
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('open')) {
                this.closeModal();
            }
        });
    }

    openModal() {
        this.modal.classList.add('open');
        this.modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    closeModal() {
        this.modal.classList.remove('open');
        this.modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme, language, and modal
    new ThemeManager();
    new LanguageManager();
    new ModalManager();
    
    // Initialize Lucide icons with a small delay to ensure library is loaded
    setTimeout(() => {
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        } else {
            console.error('Lucide library not loaded');
        }
    }, 100);
});

// Also try to initialize icons when window loads (fallback)
window.addEventListener('load', () => {
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
});

// Handle card clicks to make the whole card clickable if it has a primary link
document.querySelectorAll('.person-card').forEach(card => {
    // If the click is not on a link or button, try to navigate to the primary link
    card.addEventListener('click', (e) => {
        // Find closest anchor tag
        if (e.target.closest('a') || e.target.closest('button')) {
            return; // let it behave normally
        }

        // Find the first link-item or fallback to any a tag in person-links
        const primaryLink = card.querySelector('.person-links a:not([href^="mailto:"])');

        if (primaryLink && primaryLink.href) {
            window.open(primaryLink.href, '_blank', 'noopener');
        }
    });

    // Add cursor pointer if there's a primary link
    const primaryLink = card.querySelector('.person-links a:not([href^="mailto:"])');
    if (primaryLink) {
        card.style.cursor = 'pointer';
    }
});
