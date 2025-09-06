// Simple webview script for NoxBox - No Electron APIs
console.log('[Webview] ===== WEBVIEW SCRIPT STARTING =====');

// Global state for unblur mode
let isUnblurModeActive = false;
let currentBlurRadius = 25; // Default blur radius in pixels
let isPageLoading = true;
let blurApplied = false;
let loadingScreenActive = false;
let loadingScreenStartTime = 0;

// ===== FUN LOADING SCREEN =====
// Create and show animated loading screen
function showLoadingScreen() {
  if (loadingScreenActive) return;
  loadingScreenActive = true;
  loadingScreenStartTime = Date.now();

  console.log('[Webview] 🎭 Showing fun loading screen');

  // Remove existing loading screen
  const existingScreen = document.getElementById('noxbox-loading-screen');
  if (existingScreen) {
    existingScreen.remove();
  }

  // Fun loading messages
  const loadingMessages = [
    "🧽 Scrubbing the filth off the web...",
    "🎭 Applying privacy protection...",
    "🔒 Locking down sensitive content...",
    "✨ Making the web family-friendly...",
    "🛡️ Deploying content filters...",
    "🎪 Setting up the privacy circus...",
    "🌟 Polishing your browsing experience...",
    "🎨 Adding some blur magic...",
    "🔍 Scanning for inappropriate content...",
    "✨ Sprinkling some privacy dust..."
  ];

  const randomMessage = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];

  // Create loading screen
  const loadingScreen = document.createElement('div');
  loadingScreen.id = 'noxbox-loading-screen';
  loadingScreen.innerHTML = `
    <div class="loading-backdrop"></div>
    <div class="loading-content">
      <div class="loading-spinner">
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-center">
          <div class="privacy-icon">🛡️</div>
        </div>
      </div>
      <div class="loading-text">
        <h2>NoxBox Privacy Shield</h2>
        <p class="loading-message">${randomMessage}</p>
        <div class="loading-progress">
          <div class="progress-bar"></div>
        </div>
      </div>
      <div class="loading-effects">
        <div class="floating-shield">🛡️</div>
        <div class="floating-lock">🔒</div>
        <div class="floating-star">✨</div>
      </div>
    </div>
  `;

  // Add styles
  const loadingStyles = document.createElement('style');
  loadingStyles.textContent = `
    #noxbox-loading-screen {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 9999999;
      pointer-events: none;
      animation: fadeIn 0.3s ease-out;
    }

    .loading-backdrop {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      backdrop-filter: blur(8px);
      animation: backdropPulse 2s ease-in-out infinite;
    }

    .loading-content {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      text-align: center;
      color: white;
    }

    .loading-spinner {
      position: relative;
      width: 120px;
      height: 120px;
      margin-bottom: 30px;
    }

    .spinner-ring {
      position: absolute;
      width: 100%;
      height: 100%;
      border: 4px solid rgba(255, 255, 255, 0.1);
      border-top: 4px solid white;
      border-radius: 50%;
      animation: spin 1.5s linear infinite;
    }

    .spinner-ring:nth-child(2) {
      animation-delay: 0.2s;
      width: 90%;
      height: 90%;
      top: 5%;
      left: 5%;
    }

    .spinner-ring:nth-child(3) {
      animation-delay: 0.4s;
      width: 70%;
      height: 70%;
      top: 15%;
      left: 15%;
    }

    .spinner-center {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 40px;
      height: 40px;
      background: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: bounce 1s ease-in-out infinite;
    }

    .privacy-icon {
      font-size: 20px;
      animation: rotate 2s linear infinite;
    }

    .loading-text h2 {
      font-size: 2.2em;
      font-weight: 700;
      margin: 0 0 15px 0;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      animation: textGlow 2s ease-in-out infinite alternate;
    }

    .loading-message {
      font-size: 1.1em;
      margin: 0 0 25px 0;
      opacity: 0.9;
      max-width: 400px;
      line-height: 1.4;
      animation: fadeInUp 0.5s ease-out;
    }

    .loading-progress {
      width: 200px;
      height: 4px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 2px;
      overflow: hidden;
      margin: 0 auto;
    }

    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, #4CAF50, #45a049);
      border-radius: 2px;
      animation: progressFill 2.5s ease-out;
    }

    .loading-effects {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      overflow: hidden;
    }

    .floating-shield, .floating-lock, .floating-star {
      position: absolute;
      font-size: 24px;
      animation: float 3s ease-in-out infinite;
      opacity: 0.6;
    }

    .floating-shield {
      top: 20%;
      left: 20%;
      animation-delay: 0s;
    }

    .floating-lock {
      top: 30%;
      right: 25%;
      animation-delay: 1s;
    }

    .floating-star {
      bottom: 25%;
      left: 25%;
      animation-delay: 2s;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes backdropPulse {
      0%, 100% { opacity: 0.9; }
      50% { opacity: 1; }
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes bounce {
      0%, 100% { transform: translate(-50%, -50%) scale(1); }
      50% { transform: translate(-50%, -50%) scale(1.1); }
    }

    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes textGlow {
      from { text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3); }
      to { text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 255, 255, 0.5); }
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes progressFill {
      from { width: 0%; }
      to { width: 100%; }
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0px) rotate(0deg);
        opacity: 0.6;
      }
      50% {
        transform: translateY(-20px) rotate(180deg);
        opacity: 0.9;
      }
    }

    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `;

  document.head.appendChild(loadingStyles);
  document.body.appendChild(loadingScreen);

  console.log('[Webview] 🎭 Loading screen displayed with message:', randomMessage);

  // Auto-hide after 2.5-4 seconds (but can be overridden by page load events)
  const hideDelay = 2500 + Math.random() * 1500; // 2.5-4 seconds
  setTimeout(() => {
    hideLoadingScreen();
  }, hideDelay);
}

// Hide loading screen
function hideLoadingScreen() {
  if (!loadingScreenActive) return;

  const elapsedTime = Date.now() - loadingScreenStartTime;
  const minDisplayTime = 500; // Minimum 500ms display time

  if (elapsedTime < minDisplayTime) {
    // Wait for minimum display time
    setTimeout(() => hideLoadingScreen(), minDisplayTime - elapsedTime);
    return;
  }

  console.log('[Webview] 🎭 Hiding loading screen');

  const loadingScreen = document.getElementById('noxbox-loading-screen');
  if (loadingScreen) {
    loadingScreen.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => {
      if (loadingScreen.parentNode) {
        loadingScreen.parentNode.removeChild(loadingScreen);
      }
      loadingScreenActive = false;
      console.log('[Webview] 🎭 Loading screen removed');
    }, 300);
  } else {
    loadingScreenActive = false;
  }
}

// ===== PRIORITY BLUR APPLICATION =====
// Apply blur styles IMMEDIATELY before any content loads
function applyPriorityBlur() {
  if (blurApplied) return;
  blurApplied = true;

  console.log('[Webview] 🚀 Applying priority blur styles immediately');

  const priorityStyle = document.createElement('style');
  priorityStyle.id = 'noxbox-priority-blur';
  priorityStyle.textContent = `
    /* ===== PRIORITY BLUR - APPLIED BEFORE CONTENT LOADS ===== */

    /* Immediate blur for all media elements */
    img, video, audio, canvas, svg, picture, object, embed,
    [src], [data-src], [data-original], [data-lazy-src], [data-srcset],
    [style*="background-image"], [style*="background"],
    [role="img"], .media-element, .video-player, .audio-player, .image-container,
    [data-testid*="video"], [data-testid*="media"], [data-testid*="image"],
    [class*="video"], [class*="media"], [class*="image"], [class*="player"],
    [class*="instagram"], [class*="twitter"], [class*="facebook"], [class*="tiktok"],
    [class*="youtube"], [class*="vimeo"], [class*="twitch"],
    video[aria-label="video player"], video[src*="redd.it"], video[poster*="redd.it"] {
      filter: blur(${currentBlurRadius}px) !important;
      transition: filter 180ms ease !important;
      cursor: pointer !important;
      position: relative !important;
    }

    /* Don't blur unlocked media */
    img.media-unlocked, video.media-unlocked, audio.media-unlocked,
    canvas.media-unlocked, svg.media-unlocked, picture.media-unlocked,
    object.media-unlocked, embed.media-unlocked {
      filter: none !important;
      cursor: default !important;
    }
  `;

  // Insert at the very beginning of head to ensure priority
  if (document.head) {
    document.head.insertBefore(priorityStyle, document.head.firstChild);
  } else {
    // If head doesn't exist yet, wait for it
    const observer = new MutationObserver(() => {
      if (document.head) {
        document.head.insertBefore(priorityStyle, document.head.firstChild);
        observer.disconnect();
      }
    });
    observer.observe(document, { childList: true, subtree: true });
  }

  console.log('[Webview] ✅ Priority blur applied with radius:', currentBlurRadius + 'px');
}

// Apply priority blur immediately
applyPriorityBlur();

// ===== NAVIGATION THROTTLING =====
// Throttle page loading to prioritize blur application
function throttlePageLoad() {
  console.log('[Webview] 🕐 Throttling page load to prioritize blur');

  // Intercept and delay resource loading for a brief moment
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    if (isPageLoading && !blurApplied) {
      // Delay fetch requests by 50ms to ensure blur is applied first
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          originalFetch.apply(this, args).then(resolve).catch(reject);
        }, 50);
      });
    }
    return originalFetch.apply(this, args);
  };

  // Intercept XMLHttpRequest
  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url, ...args) {
    if (isPageLoading && !blurApplied) {
      setTimeout(() => {
        originalOpen.call(this, method, url, ...args);
      }, 30);
    } else {
      originalOpen.call(this, method, url, ...args);
    }
  };

  // Mark page as loaded after a short delay
  setTimeout(() => {
    isPageLoading = false;
    console.log('[Webview] 📄 Page loading phase complete, blur prioritized');
  }, 200);
}

// ===== NAVIGATION EVENT HANDLING =====
// Re-apply priority blur on navigation
function setupNavigationHandlers() {
  console.log('[Webview] Setting up navigation handlers for priority blur');

  // Listen for navigation start - only show loading for actual page loads
  window.addEventListener('beforeunload', () => {
    console.log('[Webview] Navigation detected, preparing priority blur');
    isPageLoading = true;
    blurApplied = false;
    // Don't show loading screen on unload - wait for actual load
  });

  // Listen for page show (back/forward navigation) - only for non-cached pages
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      console.log('[Webview] Page restored from cache, re-applying priority blur');
      applyPriorityBlur();
      throttlePageLoad();
      // Don't show loading screen for cached pages
    } else {
      console.log('[Webview] Fresh page load detected, showing loading screen');
      showLoadingScreen();
    }
  });

  // Intercept link clicks to apply blur before navigation
  document.addEventListener('click', (event) => {
    const target = event.target;
    const link = target.closest('a');

    if (link && link.href && !link.href.startsWith('javascript:')) {
      console.log('[Webview] Link clicked, preparing priority blur for navigation');
      isPageLoading = true;
      blurApplied = false;

      // Apply priority blur immediately
      setTimeout(() => applyPriorityBlur(), 10);
      // Show loading screen for link navigation
      showLoadingScreen();
    }
  }, true); // Use capture phase to catch clicks early

  // Listen for popstate (browser back/forward) - show loading for history navigation
  window.addEventListener('popstate', () => {
    console.log('[Webview] Popstate detected, re-applying priority blur');
    isPageLoading = true;
    blurApplied = false;
    setTimeout(() => applyPriorityBlur(), 10);
    // Show loading screen for history navigation
    showLoadingScreen();
  });

  // Listen for DOM ready to hide loading screen
  document.addEventListener('DOMContentLoaded', () => {
    console.log('[Webview] DOM ready, hiding loading screen');
    setTimeout(() => hideLoadingScreen(), 500);
  });

  // Listen for load event to ensure loading screen hides
  window.addEventListener('load', () => {
    console.log('[Webview] Page loaded, hiding loading screen');
    setTimeout(() => hideLoadingScreen(), 1000);
  });

  // Listen for pagehide to clean up loading state
  window.addEventListener('pagehide', () => {
    console.log('[Webview] Page hiding, cleaning up loading state');
    hideLoadingScreen();
    isPageLoading = false;
    blurApplied = false;
  });
}

// Setup navigation handlers
setupNavigationHandlers();

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

  // Update priority blur immediately
  const priorityStyle = document.getElementById('noxbox-priority-blur');
  if (priorityStyle) {
    priorityStyle.textContent = `
      /* ===== PRIORITY BLUR - UPDATED ===== */

      /* Immediate blur for all media elements */
      img, video, audio, canvas, svg, picture, object, embed,
      [src], [data-src], [data-original], [data-lazy-src], [data-srcset],
      [style*="background-image"], [style*="background"],
      [role="img"], .media-element, .video-player, .audio-player, .image-container,
      [data-testid*="video"], [data-testid*="media"], [data-testid*="image"],
      [class*="video"], [class*="media"], [class*="image"], [class*="player"],
      [class*="instagram"], [class*="twitter"], [class*="facebook"], [class*="tiktok"],
      [class*="youtube"], [class*="vimeo"], [class*="twitch"],
      video[aria-label="video player"], video[src*="redd.it"], video[poster*="redd.it"] {
        filter: blur(${currentBlurRadius}px) !important;
        transition: filter 180ms ease !important;
        cursor: pointer !important;
        position: relative !important;
      }

      /* Don't blur unlocked media */
      img.media-unlocked, video.media-unlocked, audio.media-unlocked,
      canvas.media-unlocked, svg.media-unlocked, picture.media-unlocked,
      object.media-unlocked, embed.media-unlocked {
        filter: none !important;
        cursor: default !important;
      }
    `;
    console.log('[Webview] ✅ Priority blur updated immediately');
  }

  // Also update comprehensive styles if they exist
  injectBlurStyles();
}

// Inject comprehensive blur styles when DOM changes
const injectBlurStyles = () => {
  // Remove existing comprehensive blur styles to avoid duplicates
  const existingStyle = document.getElementById('noxbox-blur-styles');
  if (existingStyle) {
    existingStyle.remove();
  }

  console.log('[Webview] Injecting comprehensive blur styles with radius:', currentBlurRadius + 'px');

  const style = document.createElement('style');
  style.id = 'noxbox-blur-styles';
  style.textContent = `
    /* ===== COMPREHENSIVE MEDIA BLUR SYSTEM WITH SELECTIVE UNBLUR ===== */

    /* Hover effects for blurred media (enhances priority blur) */
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

    /* Elements with media-related attributes - enhance priority blur */
    [src]:hover, [data-src]:hover, [data-original]:hover, [data-lazy-src]:hover, [data-srcset]:hover {
      filter: none !important;
    }

    /* Background images hover - enhance priority blur */
    [style*="background-image"]:hover, [style*="background"]:hover {
      filter: none !important;
    }

    /* Media containers and players hover - enhance priority blur */
    .media-element:hover, .video-player:hover, .audio-player:hover, .image-container:hover,
    [data-testid*="video"]:hover, [data-testid*="media"]:hover, [data-testid*="image"]:hover,
    [class*="video"]:hover, [class*="media"]:hover, [class*="image"]:hover, [class*="player"]:hover {
      filter: none !important;
    }

    /* Reddit specific hover - enhance priority blur */
    video[aria-label="video player"]:hover, video[src*="redd.it"]:hover, video[poster*="redd.it"]:hover,
    video[playsinline][preload][tabindex]:hover {
      filter: none !important;
    }

    /* Social media platforms hover - enhance priority blur */
    [class*="instagram"]:hover, [class*="twitter"]:hover, [class*="facebook"]:hover, [class*="tiktok"]:hover,
    [class*="youtube"]:hover, [class*="vimeo"]:hover, [class*="twitch"]:hover {
      filter: none !important;
    }

    /* Generic media detection hover - enhance priority blur */
    [role="img"]:hover, .media-blur-target:hover, [data-media]:hover, [data-image]:hover, [data-video]:hover {
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
