// Simple webview script for NoxBox - No Electron APIs
console.log('[Webview] ===== WEBVIEW SCRIPT STARTING =====');

// Global state for unblur mode
let isUnblurModeActive = false;
let currentBlurRadius = 6; // Default blur radius in pixels

// Function to update mode indicator
function updateModeIndicator(enabled) {
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
function setupSelectiveUnblur(enabled) {
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
    console.log('[Webview] Click detected, unblurMode:', isUnblurModeActive, 'target:', event.target?.tagName);

    // Only handle clicks when unblur mode is active
    if (!isUnblurModeActive) {
      console.log('[Webview] Ignoring click - unblur mode not active');
      return;
    }

    const target = event.target;
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
      console.log('[Webview] Media element clicked, toggling blur state...');
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

    unlockedData.forEach((item) => {
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

// Update blur radius and re-inject styles
function updateBlurRadius(radius) {
  console.log('[Webview] Updating blur radius to:', radius + 'px');
  currentBlurRadius = radius;
  injectBlurStyles();
}

// Inject blur styles when DOM changes
const injectBlurStyles = () => {
  // Remove existing blur styles to avoid duplicates
  const existingStyle = document.getElementById('noxbox-blur-styles');
  if (existingStyle) {
    existingStyle.remove();
  }

  console.log('[Webview] Injecting blur styles with radius:', currentBlurRadius + 'px');

  const style = document.createElement('style');
  style.id = 'noxbox-blur-styles';
  style.textContent = `
    /* ===== COMPREHENSIVE MEDIA BLUR SYSTEM WITH SELECTIVE UNBLUR ===== */

    /* Standard media elements */
    img, video, audio, canvas, svg, picture, object, embed {
      filter: blur(${currentBlurRadius}px) !important;
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
      filter: blur(${currentBlurRadius}px) !important;
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
      filter: blur(${currentBlurRadius}px) !important;
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
      filter: blur(${currentBlurRadius}px) !important;
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
      filter: blur(${currentBlurRadius}px) !important;
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
      filter: blur(${currentBlurRadius}px) !important;
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
      filter: blur(${currentBlurRadius}px) !important;
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

// Global function to update blur radius
function updateBlurRadius(radiusPx) {
  console.log('[Webview] updateBlurRadius called with:', radiusPx);
  currentBlurRadius = radiusPx;
  console.log('[Webview] New currentBlurRadius value:', currentBlurRadius);
  // Re-inject the blur styles with new radius
  injectBlurStyles();
}

// Listen for blur radius updates from the main renderer
window.addEventListener('message', (event) => {
  console.log('[Webview] Received message:', event.data);
  if (event.data.type === 'updateBlurRadius') {
    const newRadius = event.data.radius;
    console.log('[Webview] Updating blur radius to:', newRadius + 'px');
    updateBlurRadius(newRadius);
  }
});

// Expose functions globally for the main renderer to call
window.setupSelectiveUnblur = setupSelectiveUnblur;
window.updateBlurRadius = updateBlurRadius;

// Setup selective unblur initially
setupSelectiveUnblur();

console.log('[Webview] ===== WEBVIEW SCRIPT COMPLETE =====');
