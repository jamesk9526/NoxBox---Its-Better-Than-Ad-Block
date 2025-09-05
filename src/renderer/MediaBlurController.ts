import { MediaBlurOptions } from '../types';

export class MediaBlurController {
  private options: MediaBlurOptions;
  private mutationObserver: MutationObserver;
  private isActive = false;
  private showHoverReveal = false;
  private periodicCheckInterval: number | null = null;

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

    console.log('🎭 MediaBlurController: Starting with enhanced ad/image detection');
    console.log('🎭 Blur options:', this.options);
    console.log('🎭 Hover reveal:', this.showHoverReveal);

    this.isActive = true;
    this.applyToExistingMedia();
    this.observeDOMChanges();
    this.updateCSSVariables();

    // Set up periodic check for dynamically loaded content (ads, lazy-loaded images)
    this.startPeriodicCheck();
  }

  /**
   * Stop observing DOM changes
   */
  stop(): void {
    if (!this.isActive) return;

    this.isActive = false;
    this.mutationObserver.disconnect();
    this.stopPeriodicCheck();
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
      // Target all images including those in ads
      const imageSelectors = [
        'img',
        'img[data-src]',
        'img[data-lazy-src]',
        'img[data-original]',
        'img[loading="lazy"]',
        // Common ad selectors
        '[id*="ad"] img', '[class*="ad"] img',
        '[id*="banner"] img', '[class*="banner"] img',
        '[id*="sponsor"] img', '[class*="sponsor"] img',
        '[id*="promo"] img', '[class*="promo"] img',
        '[id*="google"] img', '[class*="google"] img',
        // Video ad containers
        'a video', 'div video', 'span video',
        'video[autoplay]', 'video[loop]', 'video[muted]',
        'video[playsinline]', 'video[webkit-playsinline]'
      ];

      let totalImagesFound = 0;
      imageSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          console.log(`📸 Found ${elements.length} images with selector: "${selector}"`);
          totalImagesFound += elements.length;
        }
        elements.forEach(this.blurElement.bind(this));
      });
      console.log(`🎯 Total images processed: ${totalImagesFound}`);
    }
    if (this.options.blurVideos) {
      const videoElements = document.querySelectorAll('video');
      if (videoElements.length > 0) {
        console.log(`🎬 Found ${videoElements.length} videos`);
      }
      videoElements.forEach(this.blurElement.bind(this));
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
    let imagesProcessed = 0;

    // Check if this element itself is media
    if (element instanceof HTMLImageElement && this.options.blurImages) {
      this.blurElement(element);
      imagesProcessed++;
    } else if (element instanceof HTMLVideoElement && this.options.blurVideos) {
      this.blurElement(element);
    }

    // Check child elements with enhanced selectors
    if (this.options.blurImages) {
      const imageSelectors = [
        'img', 'img[data-src]', 'img[data-lazy-src]', 'img[data-original]', 'img[loading="lazy"]',
        '[id*="ad"] img', '[class*="ad"] img',
        '[id*="banner"] img', '[class*="banner"] img',
        '[id*="sponsor"] img', '[class*="sponsor"] img',
        '[id*="promo"] img', '[class*="promo"] img',
        '[id*="google"] img', '[class*="google"] img',
        // Video ad containers
        'a video', 'div video', 'span video',
        'video[autoplay]', 'video[loop]', 'video[muted]',
        'video[playsinline]', 'video[webkit-playsinline]'
      ];

      imageSelectors.forEach(selector => {
        const mediaElements = element.querySelectorAll(selector);
        if (mediaElements.length > 0) {
          console.log(`🔄 Dynamic content: Found ${mediaElements.length} media with selector "${selector}" in element:`, element.tagName + (element.className ? '.' + element.className : ''));
          imagesProcessed += mediaElements.length;
        }
        mediaElements.forEach(mediaEl => {
          if (mediaEl instanceof HTMLImageElement && this.options.blurImages) {
            this.blurElement(mediaEl);
          } else if (mediaEl instanceof HTMLVideoElement && this.options.blurVideos) {
            this.blurElement(mediaEl);
          }
        });
      });
    }

    if (this.options.blurVideos) {
      const videoSelectors = [
        'video', 'a video', 'div video', 'span video',
        'video[autoplay]', 'video[loop]', 'video[muted]',
        'video[playsinline]', 'video[webkit-playsinline]'
      ];

      videoSelectors.forEach(selector => {
        const videoElements = element.querySelectorAll(selector);
        if (videoElements.length > 0) {
          console.log(`🎬 Dynamic content: Found ${videoElements.length} videos with selector "${selector}"`);
        }
        videoElements.forEach(videoEl => {
          if (videoEl instanceof HTMLVideoElement) {
            this.blurElement(videoEl);
          }
        });
      });
    }

    if (imagesProcessed > 0) {
      console.log(`✨ Processed ${imagesProcessed} images in dynamic content`);
    }
  }

  /**
   * Apply blur class to a media element
   */
  private blurElement(element: Element): void {
    if (!element.classList.contains('media-blurred')) {
      element.classList.add('media-blurred');
      element.setAttribute('data-blurred', 'true');

      // Debug logging for images
      if (element instanceof HTMLImageElement) {
        console.log('🔍 Blurred image:', {
          src: element.src || element.getAttribute('data-src') || 'no-src',
          alt: element.alt || 'no-alt',
          className: element.className,
          id: element.id,
          width: element.width,
          height: element.height,
          naturalWidth: element.naturalWidth,
          naturalHeight: element.naturalHeight,
          complete: element.complete,
          parentElement: element.parentElement?.tagName + (element.parentElement?.className ? '.' + element.parentElement.className : ''),
          dataset: { ...element.dataset }
        });
      } else if (element instanceof HTMLVideoElement) {
        console.log('🎬 Blurred video:', {
          src: element.src || 'no-src',
          autoplay: element.autoplay,
          loop: element.loop,
          muted: element.muted,
          playsInline: element.playsInline,
          className: element.className,
          id: element.id,
          parentElement: element.parentElement?.tagName + (element.parentElement?.className ? '.' + element.parentElement.className : ''),
          dataset: { ...element.dataset }
        });
      }
    } else {
      // Log if element is already blurred
      console.log('⚠️ Image already blurred:', element instanceof HTMLImageElement ? element.src : 'video');
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
    root.style.setProperty('--blur-radius', `${this.options.blurRadiusPx}px`);
  }

  /**
   * Start periodic check for dynamically loaded content
   */
  private startPeriodicCheck(): void {
    if (this.periodicCheckInterval) return;

    console.log('🔄 Starting periodic blur check every 2 seconds');
    this.periodicCheckInterval = window.setInterval(() => {
      const beforeCount = document.querySelectorAll('.media-blurred').length;
      this.applyToExistingMedia();
      const afterCount = document.querySelectorAll('.media-blurred').length;

      if (afterCount > beforeCount) {
        console.log(`📈 Periodic check found ${afterCount - beforeCount} new images to blur`);
      }
    }, 2000); // Check every 2 seconds
  }

  /**
   * Stop periodic check
   */
  private stopPeriodicCheck(): void {
    if (this.periodicCheckInterval) {
      clearInterval(this.periodicCheckInterval);
      this.periodicCheckInterval = null;
    }
  }
}
