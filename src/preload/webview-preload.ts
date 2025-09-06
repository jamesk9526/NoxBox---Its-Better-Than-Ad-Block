import { contextBridge, ipcRenderer } from 'electron';

// Webview preload for NoxBox
console.log('[Webview] ===== WEBVIEW PRELOAD STARTING =====');
console.log('[Webview] Preload script loaded successfully');

// Expose minimal API for the webview
contextBridge.exposeInMainWorld('noxboxWebview', {
  // Log that we're in the webview
  log: (message: string) => {
    console.log('[Webview]', message);
  },

  // Get document ready state
  getReadyState: () => {
    return document.readyState;
  },

  // Check if images exist and are blurred
  checkImages: () => {
    const images = document.querySelectorAll('img');
    console.log('[Webview] Found images:', images.length);
    images.forEach((img, i) => {
      console.log(`[Webview] Image ${i}:`, img.src, img.style.filter);
    });
    return images.length;
  },

  // Toggle unblur mode
  toggleUnblurMode: (enabled: boolean) => {
    setupSelectiveUnblur(enabled);
  }
});

// Log when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('[Webview] DOMContentLoaded');
});

// Log when page is fully loaded
window.addEventListener('load', () => {
  console.log('[Webview] Window load event');
});

// Log any errors
window.addEventListener('error', (e) => {
  console.log('[Webview] Error:', e.message);
});

// Inject blur styles when DOM changes
const injectBlurStyles = () => {
  // Remove existing blur styles to avoid duplicates
  const existingStyle = document.getElementById('noxbox-blur-styles');
  if (existingStyle) {
    existingStyle.remove();
  }

  const style = document.createElement('style');
  style.id = 'noxbox-blur-styles';
  style.textContent = `
    /* ===== COMPREHENSIVE MEDIA BLUR SYSTEM WITH SELECTIVE UNBLUR ===== */

    /* Standard media elements */
    img, video, audio, canvas, svg, picture, object, embed {
      filter: blur(10px) !important;
      transition: filter 180ms ease;
      cursor: pointer;
      position: relative;
    }

    /* Don't blur unlocked media */
    img.media-unlocked, video.media-unlocked, audio.media-unlocked,
    canvas.media-unlocked, svg.media-unlocked, picture.media-unlocked,
    object.media-unlocked, embed.media-unlocked {
      filter: none !important;
      cursor: default;
    }

    /* Hover effects for blurred media */
    img:hover:not(.media-unlocked), video:hover:not(.media-unlocked),
    audio:hover:not(.media-unlocked), canvas:hover:not(.media-unlocked),
    svg:hover:not(.media-unlocked), picture:hover:not(.media-unlocked),
    object:hover:not(.media-unlocked), embed:hover:not(.media-unlocked) {
      filter: none !important;
    }

    /* Unlock indicator - only show when unblur mode is active */
    body.noxbox-unblur-mode img:not(.media-unlocked)::after,
    body.noxbox-unblur-mode video:not(.media-unlocked)::after,
    body.noxbox-unblur-mode audio:not(.media-unlocked)::after,
    body.noxbox-unblur-mode canvas:not(.media-unlocked)::after,
    body.noxbox-unblur-mode svg:not(.media-unlocked)::after,
    body.noxbox-unblur-mode picture:not(.media-unlocked)::after,
    body.noxbox-unblur-mode object:not(.media-unlocked)::after,
    body.noxbox-unblur-mode embed:not(.media-unlocked)::after {
      content: "🔓 Click to unlock";
      position: absolute;
      top: 8px;
      right: 8px;
      background: rgba(0,0,0,0.8);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      opacity: 0;
      transition: opacity 0.2s ease;
      pointer-events: none;
      z-index: 10000;
      white-space: nowrap;
    }

    body.noxbox-unblur-mode img:hover:not(.media-unlocked)::after,
    body.noxbox-unblur-mode video:hover:not(.media-unlocked)::after,
    body.noxbox-unblur-mode audio:hover:not(.media-unlocked)::after,
    body.noxbox-unblur-mode canvas:hover:not(.media-unlocked)::after,
    body.noxbox-unblur-mode svg:hover:not(.media-unlocked)::after,
    body.noxbox-unblur-mode picture:hover:not(.media-unlocked)::after,
    body.noxbox-unblur-mode object:hover:not(.media-unlocked)::after,
    body.noxbox-unblur-mode embed:hover:not(.media-unlocked)::after {
      opacity: 1;
    }

    /* Unlocked indicator - show when unblur mode is active */
    body.noxbox-unblur-mode img.media-unlocked::after,
    body.noxbox-unblur-mode video.media-unlocked::after,
    body.noxbox-unblur-mode audio.media-unlocked::after,
    body.noxbox-unblur-mode canvas.media-unlocked::after,
    body.noxbox-unblur-mode svg.media-unlocked::after,
    body.noxbox-unblur-mode picture.media-unlocked::after,
    body.noxbox-unblur-mode object.media-unlocked::after,
    body.noxbox-unblur-mode embed.media-unlocked::after {
      content: "🔒 Click to lock";
      position: absolute;
      top: 8px;
      right: 8px;
      background: rgba(0,123,255,0.9);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      opacity: 0;
      transition: opacity 0.2s ease;
      pointer-events: none;
      z-index: 10000;
      white-space: nowrap;
    }

    body.noxbox-unblur-mode img.media-unlocked:hover::after,
    body.noxbox-unblur-mode video.media-unlocked:hover::after,
    body.noxbox-unblur-mode audio.media-unlocked:hover::after,
    body.noxbox-unblur-mode canvas.media-unlocked:hover::after,
    body.noxbox-unblur-mode svg.media-unlocked:hover::after,
    body.noxbox-unblur-mode picture.media-unlocked:hover::after,
    body.noxbox-unblur-mode object.media-unlocked:hover::after,
    body.noxbox-unblur-mode embed.media-unlocked:hover::after {
      opacity: 1;
    }

    /* Elements with media-related attributes */
    [src], [data-src], [data-original], [data-lazy-src], [data-srcset] {
      filter: blur(10px) !important;
    }
    [src]:hover, [data-src]:hover, [data-original]:hover, [data-lazy-src]:hover, [data-srcset]:hover {
      filter: none !important;
    }

    /* Don't blur unlocked elements with media attributes */
    [src].media-unlocked, [data-src].media-unlocked, [data-original].media-unlocked,
    [data-lazy-src].media-unlocked, [data-srcset].media-unlocked {
      filter: none !important;
    }

    /* Background images */
    [style*="background-image"], [style*="background"] {
      filter: blur(10px) !important;
    }
    [style*="background-image"]:hover, [style*="background"]:hover {
      filter: none !important;
    }

    /* Don't blur unlocked background images */
    [style*="background-image"].media-unlocked, [style*="background"].media-unlocked {
      filter: none !important;
    }

    /* Media containers and players */
    .media-element, .video-player, .audio-player, .image-container,
    [data-testid*="video"], [data-testid*="media"], [data-testid*="image"],
    [class*="video"], [class*="media"], [class*="image"], [class*="player"] {
      filter: blur(10px) !important;
    }
    .media-element:hover, .video-player:hover, .audio-player:hover, .image-container:hover,
    [data-testid*="video"]:hover, [data-testid*="media"]:hover, [data-testid*="image"]:hover,
    [class*="video"]:hover, [class*="media"]:hover, [class*="image"]:hover, [class*="player"]:hover {
      filter: none !important;
    }

    /* Don't blur unlocked media containers */
    .media-element.media-unlocked, .video-player.media-unlocked, .audio-player.media-unlocked,
    .image-container.media-unlocked, [data-testid*="video"].media-unlocked,
    [data-testid*="media"].media-unlocked, [data-testid*="image"].media-unlocked,
    [class*="video"].media-unlocked, [class*="media"].media-unlocked,
    [class*="image"].media-unlocked, [class*="player"].media-unlocked {
      filter: none !important;
    }

    /* Reddit specific */
    video[aria-label="video player"], video[src*="redd.it"], video[poster*="redd.it"],
    video[playsinline][preload][tabindex] {
      filter: blur(10px) !important;
    }
    video[aria-label="video player"]:hover, video[src*="redd.it"]:hover, video[poster*="redd.it"]:hover,
    video[playsinline][preload][tabindex]:hover {
      filter: none !important;
    }

    /* Don't blur unlocked Reddit videos */
    video[aria-label="video player"].media-unlocked, video[src*="redd.it"].media-unlocked,
    video[poster*="redd.it"].media-unlocked, video[playsinline][preload][tabindex].media-unlocked {
      filter: none !important;
    }

    /* Social media platforms */
    [class*="instagram"], [class*="twitter"], [class*="facebook"], [class*="tiktok"],
    [class*="youtube"], [class*="vimeo"], [class*="twitch"] {
      filter: blur(10px) !important;
    }
    [class*="instagram"]:hover, [class*="twitter"]:hover, [class*="facebook"]:hover, [class*="tiktok"]:hover,
    [class*="youtube"]:hover, [class*="vimeo"]:hover, [class*="twitch"]:hover {
      filter: none !important;
    }

    /* Don't blur unlocked social media */
    [class*="instagram"].media-unlocked, [class*="twitter"].media-unlocked,
    [class*="facebook"].media-unlocked, [class*="tiktok"].media-unlocked,
    [class*="youtube"].media-unlocked, [class*="vimeo"].media-unlocked,
    [class*="twitch"].media-unlocked {
      filter: none !important;
    }

    /* Generic media detection - catch all elements that might contain media */
    [role="img"], .media-blur-target, [data-media], [data-image], [data-video] {
      filter: blur(10px) !important;
    }
    [role="img"]:hover, .media-blur-target:hover, [data-media]:hover, [data-image]:hover, [data-video]:hover {
      filter: none !important;
    }

    /* Don't blur unlocked generic media */
    [role="img"].media-unlocked, .media-blur-target.media-unlocked,
    [data-media].media-unlocked, [data-image].media-unlocked, [data-video].media-unlocked {
      filter: none !important;
    }
  `;
  document.head.appendChild(style);
  console.log('[Webview] Comprehensive blur styles injected');
};

// Inject styles on load
injectBlurStyles();

// Global state for unblur mode
let isUnblurModeActive = false;

// Function to update mode indicator
function updateModeIndicator(enabled: boolean) {
  // Remove existing indicator
  const existingIndicator = document.getElementById('noxbox-unblur-indicator');
  if (existingIndicator) {
    existingIndicator.remove();
  }

  // Toggle body class for CSS styling
  document.body.classList.toggle('noxbox-unblur-mode', enabled);

  if (enabled) {
    // Create unblur mode indicator
    const indicator = document.createElement('div');
    indicator.id = 'noxbox-unblur-indicator';
    indicator.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(0, 123, 255, 0.9);
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 14px;
      font-weight: 500;
      z-index: 999999;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      pointer-events: none;
      animation: slideIn 0.3s ease-out;
    `;
    indicator.innerHTML = '👁️ Unblur Mode Active<br><small>Click on media to toggle blur</small>';
    
    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(indicator);
    
    console.log('[Webview] Unblur mode indicator shown');
  } else {
    console.log('[Webview] Unblur mode indicator hidden');
  }
}

// Setup selective unblur functionality
function setupSelectiveUnblur(enabled?: boolean) {
  console.log('[Webview] ===== SETUP SELECTIVE UNBLUR CALLED =====');
  
  if (typeof enabled === 'boolean') {
    isUnblurModeActive = enabled;
    console.log('[Webview] Setting unblur mode to:', enabled);
    updateModeIndicator(enabled);
    return;
  }
  
  console.log('[Webview] Setting up button-based selective unblur');

  // Debug: Check if media elements exist
  setTimeout(() => {
    const images = document.querySelectorAll('img');
    const videos = document.querySelectorAll('video');
    console.log('[Webview] Found images:', images.length, 'videos:', videos.length);

    images.forEach((img, i) => {
      console.log(`[Webview] Image ${i}:`, img.src, 'blurred:', img.style.filter);
    });
  }, 2000);

  // Click handler for media elements
  document.addEventListener('click', (event) => {
    console.log('[Webview] Click detected, unblurMode:', isUnblurModeActive, 'target:', (event.target as Element)?.tagName);

    // Test: Log all clicks
    console.log('[Webview] Click event details:', {
      unblurMode: isUnblurModeActive,
      target: (event.target as Element)?.tagName,
      targetClass: (event.target as Element)?.className,
      targetSrc: (event.target as Element)?.getAttribute('src')
    });

    // Only handle clicks when unblur mode is active
    if (!isUnblurModeActive) {
      console.log('[Webview] Ignoring click - unblur mode not active');
      return;
    }

    const target = event.target as Element;
    console.log('[Webview] Unblur mode click detected on:', target.tagName, target.className, target.getAttribute('src'));

    // Check if clicked element is media or contains media
    const mediaSelectors = `
      img, video, audio, canvas, svg, picture, object, embed,
      [src], [data-src], [data-original], [data-lazy-src], [data-srcset],
      [style*="background-image"], [style*="background"],
      [role="img"], .media-element, .video-player, .audio-player, .image-container,
      [data-testid*="video"], [data-testid*="media"], [data-testid*="image"],
      [class*="video"], [class*="media"], [class*="image"], [class*="player"],
      [class*="instagram"], [class*="twitter"], [class*="facebook"], [class*="tiktok"],
      [class*="youtube"], [class*="vimeo"], [class*="twitch"],
      video[aria-label="video player"], video[src*="redd.it"], video[poster*="redd.it"]
    `;

    if (target.matches(mediaSelectors)) {
      console.log('[Webview] Media element Ctrl+clicked, toggling blur state...');
      event.preventDefault();
      event.stopPropagation();

      // Toggle the unlocked state
      if (target.classList.contains('media-unlocked')) {
        target.classList.remove('media-unlocked');
        console.log('[Webview] Media locked:', target.tagName, target.getAttribute('src') || target.getAttribute('data-src'));
      } else {
        target.classList.add('media-unlocked');
        console.log('[Webview] Media unlocked:', target.tagName, target.getAttribute('src') || target.getAttribute('data-src'));
      }

      // Save unlocked media to session storage
      saveUnlockedMedia();
    } else {
      console.log('[Webview] Click target does not match media selectors');
    }
  });

  // Load previously unlocked media from session storage
  loadUnlockedMedia();
}

// Save unlocked media to session storage
function saveUnlockedMedia() {
  const unlockedElements = document.querySelectorAll('.media-unlocked');
  const unlockedData = Array.from(unlockedElements).map(element => {
    return {
      tagName: element.tagName,
      src: element.getAttribute('src') || element.getAttribute('data-src') || element.getAttribute('data-original'),
      className: element.className.replace('media-unlocked', '').trim(),
      id: element.id,
      textContent: element.textContent?.substring(0, 100) // First 100 chars for identification
    };
  });

  sessionStorage.setItem('noxbox-unlocked-media', JSON.stringify(unlockedData));
  console.log('[Webview] Saved', unlockedData.length, 'unlocked media items');
}

// Load unlocked media from session storage
function loadUnlockedMedia() {
  const savedData = sessionStorage.getItem('noxbox-unlocked-media');
  if (!savedData) return;

  try {
    const unlockedData = JSON.parse(savedData);
    console.log('[Webview] Loading', unlockedData.length, 'previously unlocked media items');

    unlockedData.forEach((item: any) => {
      // Find matching elements
      let selector = item.tagName.toLowerCase();
      if (item.src) selector += `[src="${item.src}"]`;
      if (item.id) selector += `#${item.id}`;
      if (item.className) selector += `.${item.className.split(' ').join('.')}`;

      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        if (!element.classList.contains('media-unlocked')) {
          element.classList.add('media-unlocked');
          console.log('[Webview] Restored unlocked state for:', item.tagName, item.src);
        }
      });
    });
  } catch (error) {
    console.warn('[Webview] Failed to load unlocked media:', error);
  }
}

// Expose setupSelectiveUnblur globally for the main renderer to call
(window as any).setupSelectiveUnblur = setupSelectiveUnblur;

// Setup selective unblur initially
setupSelectiveUnblur();

// Watch for new images/videos
const observer = new MutationObserver((mutations) => {
  let hasNewMedia = false;
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;

        // Comprehensive media detection
        const isMediaElement = (
          // Standard media elements
          element.tagName === 'IMG' || element.tagName === 'VIDEO' || element.tagName === 'AUDIO' ||
          element.tagName === 'CANVAS' || element.tagName === 'SVG' || element.tagName === 'PICTURE' ||
          element.tagName === 'OBJECT' || element.tagName === 'EMBED' ||

          // Elements with media attributes
          element.hasAttribute('src') || element.hasAttribute('data-src') ||
          element.hasAttribute('data-original') || element.hasAttribute('data-lazy-src') ||
          element.hasAttribute('data-srcset') ||

          // Background images
          (element.hasAttribute('style') && (
            element.getAttribute('style')?.includes('background-image') ||
            element.getAttribute('style')?.includes('background')
          )) ||

          // Media-related classes/attributes
          element.matches('[role="img"]') ||
          element.matches('.media-element') || element.matches('.video-player') ||
          element.matches('.audio-player') || element.matches('.image-container') ||
          element.matches('[data-testid*="video"]') || element.matches('[data-testid*="media"]') ||
          element.matches('[data-testid*="image"]') ||
          element.matches('[class*="video"]') || element.matches('[class*="media"]') ||
          element.matches('[class*="image"]') || element.matches('[class*="player"]') ||
          element.matches('[class*="instagram"]') || element.matches('[class*="twitter"]') ||
          element.matches('[class*="facebook"]') || element.matches('[class*="tiktok"]') ||
          element.matches('[class*="youtube"]') || element.matches('[class*="vimeo"]') ||
          element.matches('[class*="twitch"]') ||

          // Reddit specific
          element.matches('video[aria-label="video player"]') ||
          element.matches('video[src*="redd.it"]') ||
          element.matches('video[poster*="redd.it"]')
        );

        if (isMediaElement) {
          hasNewMedia = true;
          console.log('[Webview] Detected new media element:', element.tagName, element.className, element.getAttribute('src') || element.getAttribute('data-src'));
        }

        // Check descendants too
        const mediaSelectors = `
          img, video, audio, canvas, svg, picture, object, embed,
          [src], [data-src], [data-original], [data-lazy-src], [data-srcset],
          [style*="background-image"], [style*="background"],
          [role="img"], .media-element, .video-player, .audio-player, .image-container,
          [data-testid*="video"], [data-testid*="media"], [data-testid*="image"],
          [class*="video"], [class*="media"], [class*="image"], [class*="player"],
          [class*="instagram"], [class*="twitter"], [class*="facebook"], [class*="tiktok"],
          [class*="youtube"], [class*="vimeo"], [class*="twitch"],
          video[aria-label="video player"], video[src*="redd.it"], video[poster*="redd.it"]
        `;
        const media = element.querySelectorAll(mediaSelectors);
        if (media.length > 0) {
          hasNewMedia = true;
          console.log('[Webview] Detected new media descendants:', media.length);
        }
      }
    });

    // Also check for attribute changes that might indicate new media
    if (mutation.type === 'attributes' && mutation.target instanceof Element) {
      const target = mutation.target as Element;
      const relevantAttributes = ['src', 'data-src', 'data-original', 'data-lazy-src', 'data-srcset', 'style', 'class'];
      if (relevantAttributes.includes(mutation.attributeName || '') &&
          (target.tagName === 'IMG' || target.tagName === 'VIDEO' || target.tagName === 'AUDIO' ||
           target.tagName === 'CANVAS' || target.tagName === 'DIV' || target.tagName === 'SPAN')) {
        hasNewMedia = true;
        console.log('[Webview] Media attribute changed:', mutation.attributeName, 'on', target.tagName);
      }
    }
  });

  if (hasNewMedia) {
    console.log('[Webview] New media elements detected, re-applying blur');
    // Small delay to ensure the element is fully loaded
    setTimeout(() => injectBlurStyles(), 100);
  }
});

observer.observe(document.body || document.documentElement, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ['src', 'data-src', 'data-original', 'data-lazy-src', 'data-srcset', 'style', 'class', 'poster']
});

// Periodic check for dynamically loaded media (comprehensive)
setInterval(() => {
  const mediaSelectors = `
    img:not([data-blurred]):not(.media-unlocked), video:not([data-blurred]):not(.media-unlocked), audio:not([data-blurred]):not(.media-unlocked),
    canvas:not([data-blurred]):not(.media-unlocked), svg:not([data-blurred]):not(.media-unlocked), picture:not([data-blurred]):not(.media-unlocked),
    object:not([data-blurred]):not(.media-unlocked), embed:not([data-blurred]):not(.media-unlocked),
    [src]:not([data-blurred]):not(.media-unlocked), [data-src]:not([data-blurred]):not(.media-unlocked),
    [data-original]:not([data-blurred]):not(.media-unlocked), [data-lazy-src]:not([data-blurred]):not(.media-unlocked),
    [data-srcset]:not([data-blurred]):not(.media-unlocked),
    [style*="background-image"]:not([data-blurred]):not(.media-unlocked), [style*="background"]:not([data-blurred]):not(.media-unlocked),
    [role="img"]:not([data-blurred]):not(.media-unlocked), .media-element:not([data-blurred]):not(.media-unlocked),
    .video-player:not([data-blurred]):not(.media-unlocked), .audio-player:not([data-blurred]):not(.media-unlocked),
    .image-container:not([data-blurred]):not(.media-unlocked),
    [data-testid*="video"]:not([data-blurred]):not(.media-unlocked), [data-testid*="media"]:not([data-blurred]):not(.media-unlocked),
    [data-testid*="image"]:not([data-blurred]):not(.media-unlocked),
    [class*="video"]:not([data-blurred]):not(.media-unlocked), [class*="media"]:not([data-blurred]):not(.media-unlocked),
    [class*="image"]:not([data-blurred]):not(.media-unlocked), [class*="player"]:not([data-blurred]):not(.media-unlocked),
    [class*="instagram"]:not([data-blurred]):not(.media-unlocked), [class*="twitter"]:not([data-blurred]):not(.media-unlocked),
    [class*="facebook"]:not([data-blurred]):not(.media-unlocked), [class*="tiktok"]:not([data-blurred]):not(.media-unlocked),
    [class*="youtube"]:not([data-blurred]):not(.media-unlocked), [class*="vimeo"]:not([data-blurred]):not(.media-unlocked),
    [class*="twitch"]:not([data-blurred]):not(.media-unlocked),
    video[aria-label="video player"]:not([data-blurred]):not(.media-unlocked),
    video[src*="redd.it"]:not([data-blurred]):not(.media-unlocked),
    video[poster*="redd.it"]:not([data-blurred]):not(.media-unlocked)
  `;

  const mediaElements = document.querySelectorAll(mediaSelectors);

  if (mediaElements.length > 0) {
    console.log('[Webview] Found new media during periodic check:', mediaElements.length);
    mediaElements.forEach(element => {
      element.setAttribute('data-blurred', 'true');
      console.log('[Webview] Marked media for blurring:', element.tagName, element.className || element.getAttribute('src') || element.getAttribute('data-src'));
    });
    injectBlurStyles();
  }

  // Check for media in shadow DOM
  checkShadowDOM();
}, 500); // Check every 0.5 seconds for faster detection

// Function to check shadow DOM for media
function checkShadowDOM() {
  const allElements = document.querySelectorAll('*');
  allElements.forEach(element => {
    if (element.shadowRoot) {
      const shadowMedia = element.shadowRoot.querySelectorAll('img, video, audio, canvas, svg, [src], [data-src]');
      if (shadowMedia.length > 0) {
        console.log('[Webview] Found media in shadow DOM:', shadowMedia.length);
        shadowMedia.forEach(media => {
          if (!media.hasAttribute('data-blurred')) {
            media.setAttribute('data-blurred', 'true');
            injectBlurStyles();
          }
        });
      }
    }
  });
}

// Aggressive media detection - override common media loading functions
function setupMediaInterception() {
  // Intercept Image constructor
  const originalImage = window.Image;
  const newImage = function(width?: number, height?: number) {
    const img = new originalImage(width, height);
    console.log('[Webview] New Image created');
    setTimeout(() => injectBlurStyles(), 10);
    return img;
  };
  window.Image = newImage as any;

  // Intercept fetch for media URLs
  const originalFetch = window.fetch;
  window.fetch = function(input: RequestInfo | URL, init?: RequestInit) {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    if (url && (url.includes('.jpg') || url.includes('.png') || url.includes('.gif') || url.includes('.webp') ||
                url.includes('.mp4') || url.includes('.webm') || url.includes('.ogg'))) {
      console.log('[Webview] Media fetch detected:', url);
      setTimeout(() => injectBlurStyles(), 100);
    }
    return originalFetch.call(this, input, init);
  };

  // Watch for XMLHttpRequest
  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method: string, url: string | URL, async: boolean = true, user?: string | null, password?: string | null) {
    const urlStr = typeof url === 'string' ? url : url.href;
    if (urlStr && (urlStr.includes('.jpg') || urlStr.includes('.png') || urlStr.includes('.gif') || urlStr.includes('.webp') ||
                   urlStr.includes('.mp4') || urlStr.includes('.webm') || urlStr.includes('.ogg'))) {
      console.log('[Webview] Media XMLHttpRequest detected:', urlStr);
      setTimeout(() => injectBlurStyles(), 100);
    }
    return originalOpen.call(this, method, url, async, user, password);
  };
}

// Setup comprehensive media detection
setupMediaInterception();

console.log('[Webview] ===== WEBVIEW PRELOAD COMPLETE =====');
console.log('[Webview] Preload setup complete');
