"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// Webview preload for NoxBox
console.log('Webview preload loaded');
// Expose minimal API for the webview
electron_1.contextBridge.exposeInMainWorld('noxboxWebview', {
    // Log that we're in the webview
    log: (message) => {
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
    const style = document.createElement('style');
    style.textContent = `
    img, video {
      filter: blur(6px) !important;
      transition: filter 180ms ease;
    }
    img:hover, video:hover {
      filter: none !important;
    }
  `;
    document.head.appendChild(style);
    console.log('[Webview] Blur styles injected');
};
// Delay image loading by 1 second to allow blur to take effect
const delayImageLoading = (img) => {
    if (img.src && !img.src.startsWith('data:') && !img.hasAttribute('data-delayed')) {
        img.setAttribute('data-delayed', 'true');
        const originalSrc = img.src;
        img.src = ''; // Clear src to prevent loading
        setTimeout(() => {
            img.src = originalSrc;
            console.log('[Webview] Delayed image loaded:', originalSrc);
        }, 1000);
    }
};
// Apply delay to existing images
const delayExistingImages = () => {
    document.querySelectorAll('img').forEach(delayImageLoading);
};
// Inject styles on load
injectBlurStyles();
delayExistingImages();
// Watch for new images/videos
const observer = new MutationObserver((mutations) => {
    let hasNewMedia = false;
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node;
                if (element.tagName === 'IMG') {
                    delayImageLoading(element);
                    hasNewMedia = true;
                }
                else if (element.tagName === 'VIDEO') {
                    hasNewMedia = true;
                }
                // Check descendants too
                const images = element.querySelectorAll('img');
                images.forEach(delayImageLoading);
                const videos = element.querySelectorAll('video');
                if (videos.length > 0) {
                    hasNewMedia = true;
                }
            }
        });
    });
    if (hasNewMedia) {
        console.log('[Webview] New media elements detected, re-applying blur');
        injectBlurStyles();
    }
});
observer.observe(document.body || document.documentElement, {
    childList: true,
    subtree: true
});
console.log('[Webview] Preload setup complete');
