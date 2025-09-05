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
exports.TopBar = void 0;
class TopBar {
    constructor(settingsPanel, bookmarkManager, historyPanel) {
        this.historyPanel = null;
        console.log('TopBar constructor called with settingsPanel, bookmarkManager, and historyPanel');
        this.element = document.getElementById('top-bar');
        this.settingsPanel = settingsPanel;
        this.bookmarkManager = bookmarkManager;
        if (historyPanel) {
            this.historyPanel = historyPanel;
        }
        this.setupEventListeners();
    }
    setHistoryPanel(historyPanel) {
        this.historyPanel = historyPanel;
        // Re-setup event listeners for the history button
        const historyBtn = document.getElementById('history-btn');
        if (historyBtn) {
            historyBtn.addEventListener('click', (e) => {
                console.log('History button clicked in TopBar');
                e.preventDefault();
                this.toggleHistory();
            });
        }
    }
    setupEventListeners() {
        // Window controls
        const minimizeBtn = document.getElementById('minimize-btn');
        const maximizeBtn = document.getElementById('maximize-btn');
        const closeBtn = document.getElementById('close-btn');
        const settingsBtn = document.getElementById('settings-btn');
        const bookmarksBtn = document.getElementById('bookmarks-btn');
        const historyBtn = document.getElementById('history-btn');
        minimizeBtn === null || minimizeBtn === void 0 ? void 0 : minimizeBtn.addEventListener('click', () => {
            if (window.appApi) {
                window.appApi.minimizeWindow();
            }
        });
        maximizeBtn === null || maximizeBtn === void 0 ? void 0 : maximizeBtn.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            if (window.appApi) {
                const isMaximized = yield window.appApi.isWindowMaximized();
                if (isMaximized) {
                    window.appApi.unmaximizeWindow();
                }
                else {
                    window.appApi.maximizeWindow();
                }
                this.updateMaximizeButton(!isMaximized);
            }
        }));
        closeBtn === null || closeBtn === void 0 ? void 0 : closeBtn.addEventListener('click', () => {
            if (window.appApi) {
                window.appApi.closeWindow();
            }
        });
        settingsBtn === null || settingsBtn === void 0 ? void 0 : settingsBtn.addEventListener('click', (e) => {
            console.log('Settings button clicked in TopBar - raw event');
            console.log('Event details:', e);
            console.log('Settings button element:', settingsBtn);
            e.preventDefault();
            console.log('About to call toggleSettings');
            this.toggleSettings();
        });
        bookmarksBtn === null || bookmarksBtn === void 0 ? void 0 : bookmarksBtn.addEventListener('click', (e) => {
            console.log('Bookmarks button clicked in TopBar');
            e.preventDefault();
            this.toggleBookmarks();
        });
        historyBtn === null || historyBtn === void 0 ? void 0 : historyBtn.addEventListener('click', (e) => {
            console.log('History button clicked in TopBar');
            e.preventDefault();
            this.toggleHistory();
        });
        // Update maximize button state on window state change
        this.updateMaximizeButtonState();
    }
    updateMaximizeButtonState() {
        return __awaiter(this, void 0, void 0, function* () {
            if (window.appApi) {
                const isMaximized = yield window.appApi.isWindowMaximized();
                this.updateMaximizeButton(isMaximized);
            }
        });
    }
    updateMaximizeButton(isMaximized) {
        const maximizeBtn = document.getElementById('maximize-btn');
        if (maximizeBtn) {
            const icon = maximizeBtn.querySelector('.control-icon');
            if (icon) {
                icon.textContent = isMaximized ? '❐' : '□';
            }
            maximizeBtn.setAttribute('aria-label', isMaximized ? 'Restore' : 'Maximize');
        }
    }
    toggleSettings() {
        console.log('TopBar.toggleSettings() called');
        this.settingsPanel.toggle();
    }
    toggleBookmarks() {
        console.log('TopBar.toggleBookmarks() called');
        this.bookmarkManager.toggle();
    }
    toggleHistory() {
        console.log('TopBar.toggleHistory() called');
        if (this.historyPanel) {
            this.historyPanel.toggle();
        }
        else {
            console.warn('TopBar: History panel not available');
        }
    }
}
exports.TopBar = TopBar;
