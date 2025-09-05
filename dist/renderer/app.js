"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const MediaBlurController_1 = require("./MediaBlurController");
const TopBar_1 = require("./components/TopBar");
const BottomBar_1 = require("./components/BottomBar");
const SettingsPanel_1 = require("./components/SettingsPanel");
const BookmarkManager_1 = require("./components/BookmarkManager");
const HistoryManager_1 = require("./components/HistoryManager");
const HistoryPanel_1 = require("./components/HistoryPanel");
// Default settings
const DEFAULT_SETTINGS = {
    mediaBlur: {
        blurImages: true,
        blurVideos: true,
        blurRadiusPx: 6,
    },
    theme: 'light',
    accessibility: {
        highContrast: false,
        largeText: false,
        reducedMotion: false,
    },
    ui: {
        showHoverReveal: false,
    },
};
class App {
    constructor() {
        this.settings = this.loadSettings();
        this.mediaBlurController = new MediaBlurController_1.MediaBlurController(this.settings.mediaBlur);
        this.settingsPanel = new SettingsPanel_1.SettingsPanel((settings) => this.handleSettingsChange(settings));
        this.bookmarkManager = new BookmarkManager_1.BookmarkManager((url) => this.navigateToUrl(url));
        this.historyManager = HistoryManager_1.HistoryManager.getInstance();
        this.topBar = new TopBar_1.TopBar(this.settingsPanel, this.bookmarkManager);
        this.bottomBar = new BottomBar_1.BottomBar();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            // Apply theme
            this.applyTheme();
            // Start media blur controller
            this.mediaBlurController.start();
            // Initialize history panel after DOM is ready
            this.historyPanel = new HistoryPanel_1.HistoryPanel(this.historyManager);
            // Set history panel on TopBar
            this.topBar.setHistoryPanel(this.historyPanel);
            // Set up event listeners
            this.setupEventListeners();
            console.log('NoxBox initialized with settings:', this.settings);
        });
    }
    loadSettings() {
        try {
            const stored = localStorage.getItem('noxbox-settings');
            if (stored) {
                const parsed = JSON.parse(stored);
                // Merge with defaults to ensure all properties exist
                return Object.assign(Object.assign({}, DEFAULT_SETTINGS), parsed);
            }
        }
        catch (error) {
            console.warn('Failed to load settings from localStorage:', error);
        }
        return Object.assign({}, DEFAULT_SETTINGS);
    }
    saveSettings() {
        try {
            localStorage.setItem('noxbox-settings', JSON.stringify(this.settings));
        }
        catch (error) {
            console.error('Failed to save settings:', error);
        }
    }
    applyTheme() {
        const root = document.documentElement;
        root.setAttribute('data-theme', this.settings.theme);
        if (this.settings.accessibility.highContrast) {
            root.setAttribute('data-high-contrast', 'true');
        }
        else {
            root.removeAttribute('data-high-contrast');
        }
        if (this.settings.accessibility.largeText) {
            root.setAttribute('data-large-text', 'true');
        }
        else {
            root.removeAttribute('data-large-text');
        }
        if (this.settings.accessibility.reducedMotion) {
            root.setAttribute('data-reduced-motion', 'true');
        }
        else {
            root.removeAttribute('data-reduced-motion');
        }
    }
    setupEventListeners() {
        // Handle settings updates from main process
        if (window.appApi) {
            // Listen for settings updates (future implementation)
        }
        // Handle keyboard shortcuts
        document.addEventListener('keydown', this.handleKeydown.bind(this));
        // Handle bookmark events from BottomBar
        window.addEventListener('bookmark-page', this.handleBookmarkPage.bind(this));
        // Handle history navigation events
        window.addEventListener('navigate-to-history', this.handleNavigateToHistory.bind(this));
    }
    handleSettingsChange(settings) {
        this.updateSettings(settings);
    }
    handleBookmarkPage(event) {
        const { title, url } = event.detail;
        console.log('Handling bookmark page:', title, url);
        this.bookmarkManager.addBookmark(title, url);
    }
    handleNavigateToHistory(event) {
        const { url } = event.detail;
        console.log('Handling navigate to history:', url);
        this.navigateToUrl(url);
    }
    handleKeydown(event) {
        // Ctrl/Cmd+Shift+B: Toggle blur
        if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'B') {
            event.preventDefault();
            this.toggleBlur();
        }
        // Ctrl/Cmd+, : Open settings
        if ((event.ctrlKey || event.metaKey) && event.key === ',') {
            event.preventDefault();
            this.settingsPanel.toggle();
        }
        // Ctrl/Cmd+Shift+K: Toggle bookmarks
        if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'K') {
            event.preventDefault();
            this.bookmarkManager.toggle();
        }
        // Ctrl/Cmd+Y: Toggle history
        if ((event.ctrlKey || event.metaKey) && event.key === 'Y') {
            event.preventDefault();
            this.historyPanel.toggle();
        }
        // Ctrl/Cmd+H: Toggle history (alternative shortcut)
        if ((event.ctrlKey || event.metaKey) && event.key === 'H') {
            event.preventDefault();
            this.historyPanel.toggle();
        }
        // Ctrl/Cmd+D: Quick bookmark current page
        if ((event.ctrlKey || event.metaKey) && event.key === 'D') {
            event.preventDefault();
            this.quickBookmarkCurrentPage();
        }
    }
    toggleBlur() {
        const newOptions = {
            blurImages: !this.settings.mediaBlur.blurImages,
            blurVideos: !this.settings.mediaBlur.blurVideos,
        };
        this.updateMediaBlurOptions(newOptions);
    }
    updateMediaBlurOptions(options) {
        this.settings.mediaBlur = Object.assign(Object.assign({}, this.settings.mediaBlur), options);
        this.mediaBlurController.updateOptions(options);
        this.saveSettings();
    }
    updateSettings(newSettings) {
        this.settings = Object.assign(Object.assign({}, this.settings), newSettings);
        this.applyTheme();
        this.mediaBlurController.updateOptions(this.settings.mediaBlur);
        this.saveSettings();
    }
    getSettings() {
        return Object.assign({}, this.settings);
    }
    navigateToUrl(url) {
        console.log('Navigating to bookmarked URL:', url);
        this.bottomBar.setAddress(url);
        // The BottomBar will handle the actual navigation
    }
    quickBookmarkCurrentPage() {
        var _a;
        console.log('Quick bookmarking current page');
        // Get current URL and title from the webview
        const webview = document.getElementById('browser-webview');
        if (webview) {
            const currentUrl = webview.getAttribute('src') || '';
            const currentTitle = ((_a = webview.getTitle) === null || _a === void 0 ? void 0 : _a.call(webview)) || currentUrl;
            if (currentUrl && currentUrl !== 'about:blank' && !currentUrl.startsWith('data:')) {
                this.bookmarkManager.addBookmark(currentTitle, currentUrl);
                // Show a brief success message
                this.showBookmarkSuccess();
            }
        }
    }
    showBookmarkSuccess() {
        // Create a temporary success message
        const successMsg = document.createElement('div');
        successMsg.textContent = '✓ Bookmarked!';
        successMsg.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--accent-color);
      color: white;
      padding: 8px 16px;
      border-radius: 4px;
      z-index: 10000;
      font-weight: 500;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      animation: fadeInOut 2s ease-in-out;
    `;
        document.body.appendChild(successMsg);
        setTimeout(() => {
            if (successMsg.parentNode) {
                successMsg.parentNode.removeChild(successMsg);
            }
        }, 2000);
    }
    // Debug methods
    debugHideSettings() {
        this.settingsPanel.debugHide();
    }
    debugCheckSettingsVisibility() {
        return this.settingsPanel.debugCheckVisibility();
    }
    debugShowSettings() {
        this.settingsPanel.show();
    }
    debugToggleSettings() {
        this.settingsPanel.toggle();
    }
    debugToggleBookmarks() {
        this.bookmarkManager.toggle();
    }
    debugToggleHistory() {
        var _a;
        console.log('Debug: Toggling history panel');
        console.log('History panel element:', document.getElementById('history-panel'));
        console.log('History panel classes:', (_a = document.getElementById('history-panel')) === null || _a === void 0 ? void 0 : _a.classList);
        this.historyPanel.toggle();
    }
}
// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init().catch(console.error);
    // Expose debug methods to window for testing
    window.debugSettings = {
        hide: () => app.debugHideSettings(),
        checkVisibility: () => app.debugCheckSettingsVisibility(),
        show: () => app.debugShowSettings(),
        toggle: () => app.debugToggleSettings()
    };
});
