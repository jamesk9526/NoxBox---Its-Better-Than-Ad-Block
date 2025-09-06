import { MediaBlurOptions } from '../types';

export class MediaBlurController {
  private options: MediaBlurOptions;
  private mutationObserver: MutationObserver;
  private isActive = false;
  private showHoverReveal = false;

  constructor(initialOptions: MediaBlurOptions, showHoverReveal = false) {
    this.options = { ...initialOptions };
    this.showHoverReveal = showHoverReveal;
    this.mutationObserver = new MutationObserver(this.handleMutations.bind(this));
  }

  /**
   * Start observing DOM changes and apply blur to existing media
   */
  start(): void {
    if (this.isActive) return;

    this.isActive = true;
    this.applyToExistingMedia();
    this.observeDOMChanges();
    this.updateCSSVariables();
  }

  /**
   * Stop observing DOM changes
   */
  stop(): void {
    if (!this.isActive) return;

    this.isActive = false;
    this.mutationObserver.disconnect();
  }

  /**
   * Update blur options and reapply to all media
   */
  updateOptions(newOptions: Partial<MediaBlurOptions>): void {
    this.options = { ...this.options, ...newOptions };
    this.updateCSSVariables();
    this.applyToExistingMedia();
  }

  /**
   * Update hover reveal setting
   */
  updateHoverReveal(showHoverReveal: boolean): void {
    if (this.showHoverReveal !== showHoverReveal) {
      this.showHoverReveal = showHoverReveal;
      this.applyToExistingMedia();
    }
  }

  /**
   * Get current options
   */
  getOptions(): MediaBlurOptions {
    return { ...this.options };
  }

  /**
   * Apply blur to all existing media elements
   */
  private applyToExistingMedia(): void {
    if (this.options.blurImages) {
      document.querySelectorAll('img').forEach(this.blurElement.bind(this));
    }
    if (this.options.blurVideos) {
      document.querySelectorAll('video').forEach(this.blurElement.bind(this));
    }
  }

  /**
   * Set up MutationObserver to watch for new media elements
   */
  private observeDOMChanges(): void {
    this.mutationObserver.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['src', 'srcset', 'poster'],
    });
  }

  /**
   * Handle DOM mutations
   */
  private handleMutations(records: MutationRecord[]): void {
    for (const record of records) {
      // Handle newly added nodes
      for (const node of Array.from(record.addedNodes)) {
        if (!(node instanceof Element)) continue;

        this.processElement(node);
      }

      // Handle attribute changes (e.g., src changes)
      if (record.type === 'attributes' && record.target instanceof Element) {
        this.processElement(record.target);
      }
    }
  }

  /**
   * Process a single element and its children for media blurring
   */
  private processElement(element: Element): void {
    // Check if this element itself is media
    if (element instanceof HTMLImageElement && this.options.blurImages) {
      this.blurElement(element);
    } else if (element instanceof HTMLVideoElement && this.options.blurVideos) {
      this.blurElement(element);
    }

    // Check child elements
    const mediaElements = element.querySelectorAll('img, video');
    mediaElements.forEach(mediaEl => {
      if (mediaEl instanceof HTMLImageElement && this.options.blurImages) {
        this.blurElement(mediaEl);
      } else if (mediaEl instanceof HTMLVideoElement && this.options.blurVideos) {
        this.blurElement(mediaEl);
      }
    });
  }

  /**
   * Apply blur class to a media element
   */
  private blurElement(element: Element): void {
    if (!element.classList.contains('media-blurred')) {
      element.classList.add('media-blurred');
      element.setAttribute('data-blurred', 'true');
    }

    // Conditionally apply hover-reveal class
    if (this.showHoverReveal) {
      if (!element.classList.contains('hover-reveal')) {
        element.classList.add('hover-reveal');
      }
    } else {
      if (element.classList.contains('hover-reveal')) {
        element.classList.remove('hover-reveal');
      }
    }
  }

  /**
   * Update CSS variables for blur radius
   */
  private updateCSSVariables(): void {
    const root = document.documentElement;
    console.log('MediaBlurController: Setting --blur-radius to:', `${this.options.blurRadiusPx}px`);
    root.style.setProperty('--blur-radius', `${this.options.blurRadiusPx}px`);
    
    // Verify it was set
    const setRadius = getComputedStyle(root).getPropertyValue('--blur-radius');
    console.log('MediaBlurController: Verified --blur-radius is now:', setRadius);
  }
}
