import { AppSettings, MediaBlurOptions } from '../../types';

export class SettingsPanel {
  private element!: HTMLElement;
  private isVisible = false;
  private currentSettings!: AppSettings;

  constructor(private onSettingsChange: (settings: Partial<AppSettings>) => void) {
    console.log('SettingsPanel constructor called');

    // Wait for DOM to be ready before setting up
    if (document.readyState === 'loading') {
      console.log('DOM not ready, waiting for load event');
      document.addEventListener('DOMContentLoaded', () => {
        console.log('DOMContentLoaded fired, setting up SettingsPanel');
        this.initialize();
      });
    } else {
      console.log('DOM already ready, setting up SettingsPanel');
      this.initialize();
    }
  }

  private initialize(): void {
    this.element = document.getElementById('settings-panel')!;
    console.log('Settings panel element found:', !!this.element);
    this.currentSettings = this.getDefaultSettings();
    this.setupEventListeners();
    this.loadSettings();
    // Ensure panel starts hidden by setting display to none
    console.log('Ensuring panel starts hidden');
    this.element.style.display = 'none';
    this.isVisible = false;
  }

  private getDefaultSettings(): AppSettings {
    return {
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
  }

  private setupEventListeners(): void {
    console.log('Setting up settings panel event listeners');

    // Close button
    const closeBtn = document.getElementById('close-settings-btn');
    console.log('Close button element:', closeBtn);
    console.log('Close button found:', !!closeBtn);

    if (closeBtn) {
      console.log('Adding click event listener to close button');
      closeBtn.addEventListener('click', (e) => {
        console.log('Close button clicked event fired');
        console.log('Event object:', e);
        e.preventDefault();
        e.stopPropagation();
        console.log('Calling hide() method');
        this.hide();
      });

      // Also try adding a simple click handler for testing
      closeBtn.onclick = () => {
        console.log('Close button onclick fired');
        this.hide();
      };
    } else {
      console.error('Close button not found!');
    }

    // Click outside to close
    this.element.addEventListener('click', (event) => {
      console.log('Settings panel clicked, target:', event.target, 'element:', this.element);
      if (event.target === this.element) {
        console.log('Click outside detected, hiding panel');
        this.hide();
      }
    });

    // ESC key to close
    document.addEventListener('keydown', (event) => {
      console.log('Key pressed:', event.key, 'isVisible:', this.isVisible);
      if (event.key === 'Escape' && this.isVisible) {
        console.log('ESC pressed, hiding panel');
        event.preventDefault();
        this.hide();
      }

      // Add a test key to manually hide the panel
      if (event.key === 'h' && event.ctrlKey) {
        console.log('Ctrl+H pressed, manually hiding panel');
        event.preventDefault();
        this.hide();
      }

      // Add a test key to manually show the panel
      if (event.key === 's' && event.ctrlKey) {
        console.log('Ctrl+S pressed, manually showing panel');
        event.preventDefault();
        this.show();
      }
    });

    // Media blur settings
    const blurImagesToggle = document.getElementById('blur-images-toggle') as HTMLInputElement;
    const blurVideosToggle = document.getElementById('blur-videos-toggle') as HTMLInputElement;
    const blurRadiusSlider = document.getElementById('blur-radius-slider') as HTMLInputElement;
    const blurRadiusValue = document.getElementById('blur-radius-value');

    blurImagesToggle?.addEventListener('change', () => {
      this.updateMediaBlurSettings({ blurImages: blurImagesToggle.checked });
    });

    blurVideosToggle?.addEventListener('change', () => {
      this.updateMediaBlurSettings({ blurVideos: blurVideosToggle.checked });
    });

    blurRadiusSlider?.addEventListener('input', () => {
      const value = parseInt(blurRadiusSlider.value);
      console.log('SettingsPanel: Blur radius slider changed to:', value);
      if (blurRadiusValue) {
        blurRadiusValue.textContent = `${value}px`;
      }
      this.updateMediaBlurSettings({ blurRadiusPx: value });
    });

    // Theme settings
    const themeSelect = document.getElementById('theme-select') as HTMLSelectElement;
    const hoverRevealToggle = document.getElementById('hover-reveal-toggle') as HTMLInputElement;

    themeSelect?.addEventListener('change', () => {
      this.updateSettings({ theme: themeSelect.value as 'light' | 'dark' | 'high-contrast' });
    });

    hoverRevealToggle?.addEventListener('change', () => {
      this.updateSettings({
        ui: { ...this.currentSettings.ui, showHoverReveal: hoverRevealToggle.checked }
      });
    });

    // Accessibility settings
    const largeTextToggle = document.getElementById('large-text-toggle') as HTMLInputElement;
    const reducedMotionToggle = document.getElementById('reduced-motion-toggle') as HTMLInputElement;

    largeTextToggle?.addEventListener('change', () => {
      this.updateSettings({
        accessibility: { ...this.currentSettings.accessibility, largeText: largeTextToggle.checked }
      });
    });

    reducedMotionToggle?.addEventListener('change', () => {
      this.updateSettings({
        accessibility: { ...this.currentSettings.accessibility, reducedMotion: reducedMotionToggle.checked }
      });
    });

    // Developer reset button
    const resetAppBtn = document.getElementById('reset-app-btn');
    resetAppBtn?.addEventListener('click', () => {
      this.handleAppReset();
    });
  }

  private updateMediaBlurSettings(options: Partial<MediaBlurOptions>): void {
    console.log('SettingsPanel: updateMediaBlurSettings called with:', options);
    const newSettings = {
      mediaBlur: { ...this.currentSettings.mediaBlur, ...options }
    };
    console.log('SettingsPanel: Previous settings:', this.currentSettings.mediaBlur);
    console.log('SettingsPanel: New settings:', newSettings.mediaBlur);
    this.currentSettings = { ...this.currentSettings, ...newSettings };
    console.log('SettingsPanel: Calling onSettingsChange callback');
    this.onSettingsChange(newSettings);
  }

  private updateSettings(settings: Partial<AppSettings>): void {
    this.currentSettings = { ...this.currentSettings, ...settings };
    this.onSettingsChange(settings);
  }

  private loadSettings(): void {
    // Load from localStorage or use defaults
    try {
      const stored = localStorage.getItem('noxbox-settings');
      if (stored) {
        this.currentSettings = { ...this.getDefaultSettings(), ...JSON.parse(stored) };
        this.updateUI();
      }
    } catch (error) {
      console.warn('Failed to load settings:', error);
    }
  }

  private updateUI(): void {
    // Update form elements to match current settings
    const blurImagesToggle = document.getElementById('blur-images-toggle') as HTMLInputElement;
    const blurVideosToggle = document.getElementById('blur-videos-toggle') as HTMLInputElement;
    const blurRadiusSlider = document.getElementById('blur-radius-slider') as HTMLInputElement;
    const blurRadiusValue = document.getElementById('blur-radius-value');
    const themeSelect = document.getElementById('theme-select') as HTMLSelectElement;
    const hoverRevealToggle = document.getElementById('hover-reveal-toggle') as HTMLInputElement;
    const largeTextToggle = document.getElementById('large-text-toggle') as HTMLInputElement;
    const reducedMotionToggle = document.getElementById('reduced-motion-toggle') as HTMLInputElement;

    if (blurImagesToggle) blurImagesToggle.checked = this.currentSettings.mediaBlur.blurImages;
    if (blurVideosToggle) blurVideosToggle.checked = this.currentSettings.mediaBlur.blurVideos;
    if (blurRadiusSlider) blurRadiusSlider.value = this.currentSettings.mediaBlur.blurRadiusPx.toString();
    if (blurRadiusValue) blurRadiusValue.textContent = `${this.currentSettings.mediaBlur.blurRadiusPx}px`;
    if (themeSelect) themeSelect.value = this.currentSettings.theme;
    if (hoverRevealToggle) hoverRevealToggle.checked = this.currentSettings.ui.showHoverReveal;
    if (largeTextToggle) largeTextToggle.checked = this.currentSettings.accessibility.largeText;
    if (reducedMotionToggle) reducedMotionToggle.checked = this.currentSettings.accessibility.reducedMotion;
  }

  show(): void {
    console.log('SettingsPanel.show() called, current isVisible:', this.isVisible);
    console.log('Element before showing:', this.element);

    // Use CSS classes for smooth animations
    this.element.style.display = 'flex';
    // Force reflow to ensure display change takes effect before adding visible class
    this.element.offsetHeight;
    this.element.classList.add('visible');
    this.isVisible = true;

    console.log('Element after showing:', this.element);
    console.log('Element classes:', this.element.className);

    // Focus first input after animation starts
    setTimeout(() => {
      const firstInput = this.element.querySelector('input, select') as HTMLElement;
      console.log('Focusing first input:', firstInput);
      firstInput?.focus();
    }, 100);
  }

  hide(): void {
    console.log('SettingsPanel.hide() called, current isVisible:', this.isVisible);
    console.log('Element before hiding:', this.element);

    // Remove visible class for smooth animation
    this.element.classList.remove('visible');
    this.isVisible = false;

    // Hide element completely after animation completes
    setTimeout(() => {
      if (!this.isVisible) { // Double-check in case show() was called during animation
        this.element.style.display = 'none';
      }
    }, 300); // Match the CSS transition duration

    console.log('Element after hiding:', this.element);
    console.log('Element classes:', this.element.className);

    // Return focus to settings button
    const settingsBtn = document.getElementById('settings-btn');
    console.log('Returning focus to settings button:', settingsBtn);
    settingsBtn?.focus();
  }

  toggle(): void {
    console.log('SettingsPanel.toggle() called, current isVisible:', this.isVisible);
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }

  // Debug method to manually test hide functionality
  debugHide(): void {
    console.log('Debug hide called manually');
    this.hide();
  }

  // Debug method to check if panel is visible
  debugCheckVisibility(): boolean {
    console.log('Current visibility state:', this.isVisible);
    console.log('Element style.display:', this.element.style.display);
    console.log('Computed style.display:', window.getComputedStyle(this.element).display);
    return this.isVisible;
  }

  getCurrentSettings(): AppSettings {
    return { ...this.currentSettings };
  }

  updateCurrentSettings(settings: AppSettings): void {
    console.log('SettingsPanel: updateCurrentSettings called with:', settings);
    this.currentSettings = { ...settings };
    this.updateUI();
  }

  private async handleAppReset(): Promise<void> {
    const confirmed = await this.showResetConfirmation();
    if (confirmed) {
      this.performReset();
    }
  }

  private async showResetConfirmation(): Promise<boolean> {
    return new Promise((resolve) => {
      // Create a beautiful confirmation modal
      const modal = document.createElement('div');
      modal.className = 'reset-confirmation-modal';
      modal.innerHTML = `
        <div class="reset-modal-backdrop"></div>
        <div class="reset-modal-content">
          <div class="reset-modal-header">
            <div class="reset-icon">🔄</div>
            <h3>Reset Application</h3>
          </div>
          <div class="reset-modal-body">
            <p>This will reset all application data and restart NoxBox:</p>
            <ul class="reset-items">
              <li>✨ Clear all settings</li>
              <li>🗂️ Remove temporary files</li>
              <li>📱 Reset to first-time experience</li>
              <li>🔄 Restart the application</li>
            </ul>
            <div class="reset-warning">
              <strong>⚠️ Warning:</strong> This action cannot be undone.
            </div>
          </div>
          <div class="reset-modal-actions">
            <button class="reset-cancel-btn" id="reset-cancel">Cancel</button>
            <button class="reset-confirm-btn" id="reset-confirm">Reset & Restart</button>
          </div>
        </div>
      `;

      // Add modal styles
      const styles = document.createElement('style');
      styles.textContent = `
        .reset-confirmation-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 999999;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.2s ease-out;
        }

        .reset-modal-backdrop {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
        }

        .reset-modal-content {
          background: var(--bg-primary);
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          max-width: 400px;
          width: 90%;
          position: relative;
          overflow: hidden;
          animation: slideUp 0.3s ease-out;
        }

        .reset-modal-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 24px;
          text-align: center;
        }

        .reset-icon {
          font-size: 3em;
          margin-bottom: 12px;
          animation: spin 2s linear infinite;
        }

        .reset-modal-header h3 {
          margin: 0;
          font-size: 1.4em;
          font-weight: 600;
        }

        .reset-modal-body {
          padding: 24px;
        }

        .reset-modal-body p {
          margin: 0 0 16px 0;
          color: var(--text-primary);
          font-weight: 500;
        }

        .reset-items {
          list-style: none;
          padding: 0;
          margin: 0 0 20px 0;
        }

        .reset-items li {
          padding: 8px 0;
          color: var(--text-secondary);
          font-size: 0.95em;
        }

        .reset-warning {
          background: rgba(255, 193, 7, 0.1);
          border: 1px solid rgba(255, 193, 7, 0.3);
          border-radius: 8px;
          padding: 12px;
          color: #856404;
          font-size: 0.9em;
        }

        .reset-modal-actions {
          padding: 24px;
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          background: var(--bg-secondary);
        }

        .reset-cancel-btn, .reset-confirm-btn {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .reset-cancel-btn {
          background: var(--bg-tertiary);
          color: var(--text-secondary);
        }

        .reset-cancel-btn:hover {
          background: var(--border-color);
        }

        .reset-confirm-btn {
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%);
          color: white;
        }

        .reset-confirm-btn:hover {
          background: linear-gradient(135deg, #ee5a5a 0%, #dc4444 100%);
          transform: translateY(-1px);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `;

      document.head.appendChild(styles);
      document.body.appendChild(modal);

      // Event listeners
      const cancelBtn = modal.querySelector('#reset-cancel');
      const confirmBtn = modal.querySelector('#reset-confirm');
      const backdrop = modal.querySelector('.reset-modal-backdrop');

      const cleanup = () => {
        document.body.removeChild(modal);
        document.head.removeChild(styles);
      };

      cancelBtn?.addEventListener('click', () => {
        cleanup();
        resolve(false);
      });

      confirmBtn?.addEventListener('click', () => {
        cleanup();
        resolve(true);
      });

      backdrop?.addEventListener('click', () => {
        cleanup();
        resolve(false);
      });

      // ESC key to cancel
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          cleanup();
          document.removeEventListener('keydown', handleEsc);
          resolve(false);
        }
      };
      document.addEventListener('keydown', handleEsc);
    });
  }

  private performReset(): void {
    try {
      // Clear all localStorage (this will also clear onboarding completion flag)
      localStorage.clear();
      
      // Clear sessionStorage
      sessionStorage.clear();
      
      // Show restart message
      this.showRestartMessage();
      
      // Restart the app after a short delay
      setTimeout(() => {
        if ((window as any).appApi && (window as any).appApi.restartApp) {
          (window as any).appApi.restartApp();
        } else {
          // Fallback: reload the page
          window.location.reload();
        }
      }, 2000);
      
    } catch (error) {
      console.error('Failed to reset app:', error);
      alert('Failed to reset application. Please try again.');
    }
  }

  private showRestartMessage(): void {
    // Create restart message overlay
    const overlay = document.createElement('div');
    overlay.className = 'restart-overlay';
    overlay.innerHTML = `
      <div class="restart-content">
        <div class="restart-spinner"></div>
        <h3>Restarting NoxBox...</h3>
        <p>Application data has been reset</p>
      </div>
    `;

    // Add restart styles
    const styles = document.createElement('style');
    styles.textContent = `
      .restart-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999999;
        animation: fadeIn 0.3s ease-out;
      }

      .restart-content {
        text-align: center;
        color: white;
      }

      .restart-spinner {
        width: 60px;
        height: 60px;
        border: 4px solid rgba(255, 255, 255, 0.3);
        border-top: 4px solid white;
        border-radius: 50%;
        margin: 0 auto 24px;
        animation: spin 1s linear infinite;
      }

      .restart-content h3 {
        font-size: 1.8em;
        margin: 0 0 12px 0;
        font-weight: 600;
      }

      .restart-content p {
        font-size: 1.1em;
        margin: 0;
        opacity: 0.9;
      }
    `;

    document.head.appendChild(styles);
    document.body.appendChild(overlay);
  }
}
