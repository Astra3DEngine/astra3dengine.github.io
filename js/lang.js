/**
 * Language Manager - Multi-language support module
 * @description Handles language switching and text translation
 * @author Astra 3D Engine
 */

(function() {
    'use strict';

    /**
     * Language Manager Class
     * @class LanguageManager
     */
    class LanguageManager {
        /**
         * Creates a LanguageManager instance
         * @constructor
         * @param {string} defaultLang - Default language code
         */
        constructor(defaultLang = 'en') {
            this.currentLang = defaultLang;
            this.translations = {};
            this.supportedLangs = ['en', 'zh'];
            this.storageKey = 'astra-lang-preference';
        }

        /**
         * Initialize the language manager
         * @async
         * @function init
         * @returns {Promise<void>}
         */
        async init() {
            const savedLang = localStorage.getItem(this.storageKey);
            const browserLang = navigator.language.split('-')[0];
            
            if (savedLang && this.supportedLangs.includes(savedLang)) {
                this.currentLang = savedLang;
            } else if (this.supportedLangs.includes(browserLang)) {
                this.currentLang = browserLang;
            }

            await this.loadTranslations(this.currentLang);
            this.updatePageContent();
            this.setupLanguageToggle();
        }

        /**
         * Load translations for a specific language
         * @async
         * @function loadTranslations
         * @param {string} lang - Language code to load
         * @returns {Promise<void>}
         */
        async loadTranslations(lang) {
            try {
                const response = await fetch(`lang/${lang}.json`);
                if (!response.ok) {
                    throw new Error(`Failed to load translations for ${lang}`);
                }
                this.translations = await response.json();
            } catch (error) {
                console.error('Error loading translations:', error);
                if (lang !== 'en') {
                    await this.loadTranslations('en');
                }
            }
        }

        /**
         * Get translation by key path
         * @function t
         * @param {string} keyPath - Dot-separated key path (e.g., 'nav.features')
         * @returns {string} Translated text
         */
        t(keyPath) {
            const keys = keyPath.split('.');
            let value = this.translations;
            
            for (const key of keys) {
                if (value && typeof value === 'object' && key in value) {
                    value = value[key];
                } else {
                    return keyPath;
                }
            }
            
            return typeof value === 'string' ? value : keyPath;
        }

        /**
         * Switch to a different language
         * @async
         * @function switchLanguage
         * @param {string} lang - Language code to switch to
         * @returns {Promise<void>}
         */
        async switchLanguage(lang) {
            if (lang === this.currentLang || !this.supportedLangs.includes(lang)) {
                return;
            }

            this.currentLang = lang;
            localStorage.setItem(this.storageKey, lang);
            await this.loadTranslations(lang);
            this.updatePageContent();
            this.updateToggleButton();
        }

        /**
         * Update all page content with current translations
         * @function updatePageContent
         */
        updatePageContent() {
            document.querySelectorAll('[data-i18n]').forEach(element => {
                const key = element.getAttribute('data-i18n');
                const translation = this.t(key);
                
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translation;
                } else {
                    element.textContent = translation;
                }
            });

            document.querySelectorAll('[data-i18n-title]').forEach(element => {
                const key = element.getAttribute('data-i18n-title');
                element.title = this.t(key);
            });

            document.querySelectorAll('[data-i18n-aria]').forEach(element => {
                const key = element.getAttribute('data-i18n-aria');
                element.setAttribute('aria-label', this.t(key));
            });

            document.documentElement.lang = this.currentLang;
        }

        /**
         * Setup language toggle button event listeners
         * @function setupLanguageToggle
         */
        setupLanguageToggle() {
            const toggleBtn = document.querySelector('.lang-toggle');
            const dropdown = document.querySelector('.lang-dropdown');

            if (toggleBtn && dropdown) {
                toggleBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    dropdown.classList.toggle('active');
                });

                document.addEventListener('click', () => {
                    dropdown.classList.remove('active');
                });

                dropdown.querySelectorAll('.lang-option').forEach(option => {
                    option.addEventListener('click', async (e) => {
                        e.preventDefault();
                        const lang = e.currentTarget.getAttribute('data-lang');
                        await this.switchLanguage(lang);
                        dropdown.classList.remove('active');
                    });
                });
            }

            this.updateToggleButton();
        }

        /**
         * Update toggle button to show current language
         * @function updateToggleButton
         */
        updateToggleButton() {
            document.querySelectorAll('.lang-option').forEach(option => {
                const lang = option.getAttribute('data-lang');
                option.classList.toggle('active', lang === this.currentLang);
            });
        }

        /**
         * Get current language code
         * @function getCurrentLang
         * @returns {string} Current language code
         */
        getCurrentLang() {
            return this.currentLang;
        }
    }

    window.LanguageManager = LanguageManager;
})();