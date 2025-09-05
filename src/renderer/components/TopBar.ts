import { SettingsPanel } from './SettingsPanel';
import { BookmarkManager } from './BookmarkManager';
import { HistoryPanel } from './HistoryPanel';

export class TopBar {
  private element: HTMLElement;
  private settingsPanel: SettingsPanel;
  private bookmarkManager: BookmarkManager;
  private historyPanel: HistoryPanel | null = null;

  constructor(settingsPanel: SettingsPanel, bookmarkManager: BookmarkManager, historyPanel?: HistoryPanel) {
    console.log('TopBar constructor called with settingsPanel, bookmarkManager, and historyPanel');
    this.element = document.getElementById('top-bar')!;
    this.settingsPanel = settingsPanel;
    this.bookmarkManager = bookmarkManager;
    if (historyPanel) {
      this.historyPanel = historyPanel;
    }
    this.setupEventListeners();
  }

  public setHistoryPanel(historyPanel: HistoryPanel): void {
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

  private setupEventListeners(): void {
    // Window controls
    const minimizeBtn = document.getElementById('minimize-btn');
    const maximizeBtn = document.getElementById('maximize-btn');
    const closeBtn = document.getElementById('close-btn');
    const settingsBtn = document.getElementById('settings-btn');
    const bookmarksBtn = document.getElementById('bookmarks-btn');
    const historyBtn = document.getElementById('history-btn');

    minimizeBtn?.addEventListener('click', () => {
      if (window.appApi) {
        window.appApi.minimizeWindow();
      }
    });

    maximizeBtn?.addEventListener('click', async () => {
      if (window.appApi) {
        const isMaximized = await window.appApi.isWindowMaximized();
        if (isMaximized) {
          window.appApi.unmaximizeWindow();
        } else {
          window.appApi.maximizeWindow();
        }
        this.updateMaximizeButton(!isMaximized);
      }
    });

    closeBtn?.addEventListener('click', () => {
      if (window.appApi) {
        window.appApi.closeWindow();
      }
    });

    settingsBtn?.addEventListener('click', (e) => {
      console.log('Settings button clicked in TopBar - raw event');
      console.log('Event details:', e);
      console.log('Settings button element:', settingsBtn);
      e.preventDefault();
      console.log('About to call toggleSettings');
      this.toggleSettings();
    });

    bookmarksBtn?.addEventListener('click', (e) => {
      console.log('Bookmarks button clicked in TopBar');
      e.preventDefault();
      this.toggleBookmarks();
    });

    historyBtn?.addEventListener('click', (e) => {
      console.log('History button clicked in TopBar');
      e.preventDefault();
      this.toggleHistory();
    });

    // Update maximize button state on window state change
    this.updateMaximizeButtonState();
  }

  private async updateMaximizeButtonState(): Promise<void> {
    if (window.appApi) {
      const isMaximized = await window.appApi.isWindowMaximized();
      this.updateMaximizeButton(isMaximized);
    }
  }

  private updateMaximizeButton(isMaximized: boolean): void {
    const maximizeBtn = document.getElementById('maximize-btn');
    if (maximizeBtn) {
      const icon = maximizeBtn.querySelector('.control-icon');
      if (icon) {
        icon.textContent = isMaximized ? '❐' : '□';
      }
      maximizeBtn.setAttribute('aria-label', isMaximized ? 'Restore' : 'Maximize');
    }
  }

  private toggleSettings(): void {
    console.log('TopBar.toggleSettings() called');
    this.settingsPanel.toggle();
  }

  private toggleBookmarks(): void {
    console.log('TopBar.toggleBookmarks() called');
    this.bookmarkManager.toggle();
  }

  private toggleHistory(): void {
    console.log('TopBar.toggleHistory() called');
    if (this.historyPanel) {
      this.historyPanel.toggle();
    } else {
      console.warn('TopBar: History panel not available');
    }
  }
}
