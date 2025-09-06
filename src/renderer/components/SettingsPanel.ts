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
  }

  private updateMediaBlurSettings(options: Partial<MediaBlurOptions>): void {
    const newSettings = {
      mediaBlur: { ...this.currentSettings.mediaBlur, ...options }
    };
    this.currentSettings = { ...this.currentSettings, ...newSettings };
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
    console.log('Element style.display before:', this.element.style.display);

    // Use style.display instead of hidden attribute for more reliable control
    this.element.style.display = 'flex';
    this.isVisible = true;

    console.log('Element after showing:', this.element);
    console.log('Element style.display after:', this.element.style.display);

    // Focus first input
    const firstInput = this.element.querySelector('input, select') as HTMLElement;
    console.log('Focusing first input:', firstInput);
    firstInput?.focus();
  }

  hide(): void {
    console.log('SettingsPanel.hide() called, current isVisible:', this.isVisible);
    console.log('Element before hiding:', this.element);
    console.log('Element style.display before:', this.element.style.display);

    // Use style.display instead of hidden attribute for more reliable control
    this.element.style.display = 'none';
    this.isVisible = false;

    console.log('Element after hiding:', this.element);
    console.log('Element style.display after:', this.element.style.display);

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
}
