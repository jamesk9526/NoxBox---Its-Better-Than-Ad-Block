import { MediaBlurController } from './MediaBlurController';
import { TopBar } from './components/TopBar';
import { BottomBar } from './components/BottomBar';
import { SettingsPanel } from './components/SettingsPanel';
import { BookmarkManager } from './components/BookmarkManager';
import { HistoryManager } from './components/HistoryManager';
import { HistoryPanel } from './components/HistoryPanel';
import { AppSettings, MediaBlurOptions } from '../types';

// Default settings
const DEFAULT_SETTINGS: AppSettings = {
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
  private mediaBlurController: MediaBlurController;
  private settings: AppSettings;
  private topBar: TopBar;
  private bottomBar: BottomBar;
  private settingsPanel: SettingsPanel;
  private bookmarkManager: BookmarkManager;
  private historyManager: HistoryManager;
  private historyPanel!: HistoryPanel;

  constructor() {
    this.settings = this.loadSettings();
    this.mediaBlurController = new MediaBlurController(this.settings.mediaBlur, this.settings.ui.showHoverReveal);
    this.settingsPanel = new SettingsPanel((settings) => this.handleSettingsChange(settings));
    this.bookmarkManager = new BookmarkManager((url) => this.navigateToUrl(url));
    this.historyManager = HistoryManager.getInstance();
        this.topBar = new TopBar(this.settingsPanel, this.bookmarkManager);
    this.bottomBar = new BottomBar();
  }

  async init(): Promise<void> {
    // Apply theme
    this.applyTheme();

    // Start media blur controller
    this.mediaBlurController.start();

    // Initialize history panel after DOM is ready
    this.historyPanel = new HistoryPanel(this.historyManager);

    // Set history panel on TopBar
    this.topBar.setHistoryPanel(this.historyPanel);

    // Set up event listeners
    this.setupEventListeners();

    console.log('NoxBox initialized with settings:', this.settings);
  }

  private loadSettings(): AppSettings {
    try {
      const stored = localStorage.getItem('noxbox-settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with defaults to ensure all properties exist
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch (error) {
      console.warn('Failed to load settings from localStorage:', error);
    }
    return { ...DEFAULT_SETTINGS };
  }

  private saveSettings(): void {
    try {
      localStorage.setItem('noxbox-settings', JSON.stringify(this.settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }

  private applyTheme(): void {
    const root = document.documentElement;
    root.setAttribute('data-theme', this.settings.theme);

    if (this.settings.accessibility.highContrast) {
      root.setAttribute('data-high-contrast', 'true');
    } else {
      root.removeAttribute('data-high-contrast');
    }

    if (this.settings.accessibility.largeText) {
      root.setAttribute('data-large-text', 'true');
    } else {
      root.removeAttribute('data-large-text');
    }

    if (this.settings.accessibility.reducedMotion) {
      root.setAttribute('data-reduced-motion', 'true');
    } else {
      root.removeAttribute('data-reduced-motion');
    }
  }

  private setupEventListeners(): void {
    // Handle settings updates from main process
    if (window.appApi) {
      // Listen for settings updates (future implementation)
    }

    // Handle keyboard shortcuts
    document.addEventListener('keydown', this.handleKeydown.bind(this));

    // Handle bookmark events from BottomBar
    window.addEventListener('bookmark-page', this.handleBookmarkPage.bind(this) as EventListener);

    // Handle history navigation events
    window.addEventListener('navigate-to-history', this.handleNavigateToHistory.bind(this) as EventListener);
  }

  private handleSettingsChange(settings: Partial<AppSettings>): void {
    this.updateSettings(settings);
  }

  private handleBookmarkPage(event: CustomEvent): void {
    const { title, url } = event.detail;
    console.log('Handling bookmark page:', title, url);
    this.bookmarkManager.addBookmark(title, url);
  }

  private handleNavigateToHistory(event: CustomEvent): void {
    const { url } = event.detail;
    console.log('Handling navigate to history:', url);
    this.navigateToUrl(url);
  }

  private handleKeydown(event: KeyboardEvent): void {
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

  private toggleBlur(): void {
    const newOptions: Partial<MediaBlurOptions> = {
      blurImages: !this.settings.mediaBlur.blurImages,
      blurVideos: !this.settings.mediaBlur.blurVideos,
    };

    this.updateMediaBlurOptions(newOptions);
  }

  updateMediaBlurOptions(options: Partial<MediaBlurOptions>): void {
    this.settings.mediaBlur = { ...this.settings.mediaBlur, ...options };
    this.mediaBlurController.updateOptions(options);
    this.saveSettings();
  }

  updateSettings(newSettings: Partial<AppSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.applyTheme();
    this.mediaBlurController.updateOptions(this.settings.mediaBlur);

    // Update hover reveal setting if it changed
    if (newSettings.ui?.showHoverReveal !== undefined) {
      this.mediaBlurController.updateHoverReveal(newSettings.ui.showHoverReveal);
    }

    this.saveSettings();
  }

  getSettings(): AppSettings {
    return { ...this.settings };
  }

  private navigateToUrl(url: string): void {
    console.log('Navigating to bookmarked URL:', url);
    this.bottomBar.setAddress(url);
    // The BottomBar will handle the actual navigation
  }

  private quickBookmarkCurrentPage(): void {
    console.log('Quick bookmarking current page');
    // Get current URL and title from the webview
    const webview = document.getElementById('browser-webview') as any;
    if (webview) {
      const currentUrl = webview.getAttribute('src') || '';
      const currentTitle = webview.getTitle?.() || currentUrl;

      if (currentUrl && currentUrl !== 'about:blank' && !currentUrl.startsWith('data:')) {
        this.bookmarkManager.addBookmark(currentTitle, currentUrl);
        // Show a brief success message
        this.showBookmarkSuccess();
      }
    }
  }

  private showBookmarkSuccess(): void {
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
  debugHideSettings(): void {
    this.settingsPanel.debugHide();
  }

  debugCheckSettingsVisibility(): boolean {
    return this.settingsPanel.debugCheckVisibility();
  }

  debugShowSettings(): void {
    this.settingsPanel.show();
  }

  debugToggleSettings(): void {
    this.settingsPanel.toggle();
  }

  debugToggleBookmarks(): void {
    this.bookmarkManager.toggle();
  }

  debugToggleHistory(): void {
    console.log('Debug: Toggling history panel');
    console.log('History panel element:', document.getElementById('history-panel'));
    console.log('History panel classes:', document.getElementById('history-panel')?.classList);
    this.historyPanel.toggle();
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init().catch(console.error);

  // Expose debug methods to window for testing
  (window as any).debugSettings = {
    hide: () => app.debugHideSettings(),
    checkVisibility: () => app.debugCheckSettingsVisibility(),
    show: () => app.debugShowSettings(),
    toggle: () => app.debugToggleSettings()
  };
});
