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

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    new ThemeManager();
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});
