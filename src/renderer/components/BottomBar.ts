import { HistoryManager } from './HistoryManager.js';

export class BottomBar {
  private element: HTMLElement;
  private addressInput: HTMLInputElement;
  private webview: any; // Electron webview element
  private historyManager: HistoryManager;
  private currentUrl: string = '';
  private findModal: HTMLElement;
  private findInput: HTMLInputElement;
  private findResultsText: HTMLElement;
  private currentFindRequestId: number | null = null;

  constructor() {
    console.log('BottomBar constructor called');
    this.element = document.getElementById('bottom-bar')!;
    this.addressInput = document.getElementById('address-input') as HTMLInputElement;
    this.webview = document.getElementById('browser-webview') as any;
    this.historyManager = HistoryManager.getInstance();
    this.findModal = document.getElementById('find-modal')!;
    this.findInput = document.getElementById('find-input') as HTMLInputElement;
    this.findResultsText = document.getElementById('find-results-text') as HTMLElement;
    console.log('Browser webview found:', !!this.webview);
    this.setupEventListeners();
    this.initializeNavigation();
  }

  private setupEventListeners(): void {
    console.log('Setting up BottomBar event listeners');

    // Navigation controls
    const backBtn = document.getElementById('back-btn');
    const forwardBtn = document.getElementById('forward-btn');
    const refreshBtn = document.getElementById('refresh-btn');
    const homeBtn = document.getElementById('home-btn');
    const bookmarkBtn = document.getElementById('bookmark-btn');
    const findBtn = document.getElementById('find-btn');

    console.log('Navigation buttons found:', {
      back: !!backBtn,
      forward: !!forwardBtn,
      refresh: !!refreshBtn,
      home: !!homeBtn,
      bookmark: !!bookmarkBtn,
      find: !!findBtn
    });

    backBtn?.addEventListener('click', (e) => {
      console.log('Back button clicked');
      e.preventDefault();
      this.goBack();
    });

    forwardBtn?.addEventListener('click', (e) => {
      console.log('Forward button clicked');
      e.preventDefault();
      this.goForward();
    });

    refreshBtn?.addEventListener('click', (e) => {
      console.log('Refresh button clicked');
      e.preventDefault();
      this.refresh();
    });

    homeBtn?.addEventListener('click', (e) => {
      console.log('Home button clicked');
      e.preventDefault();
      this.goHome();
    });

    bookmarkBtn?.addEventListener('click', (e) => {
      console.log('Bookmark button clicked');
      e.preventDefault();
      this.bookmarkCurrentPage();
    });

    findBtn?.addEventListener('click', (e) => {
      console.log('Find button clicked');
      e.preventDefault();
      this.showFindModal();
    });

    // Zoom controls
    const zoomInBtn = document.getElementById('zoom-in-btn');
    const zoomOutBtn = document.getElementById('zoom-out-btn');
    const fullscreenBtn = document.getElementById('fullscreen-btn');

    zoomInBtn?.addEventListener('click', (e) => {
      console.log('Zoom in button clicked');
      e.preventDefault();
      this.zoomIn();
    });

    zoomOutBtn?.addEventListener('click', (e) => {
      console.log('Zoom out button clicked');
      e.preventDefault();
      this.zoomOut();
    });

    fullscreenBtn?.addEventListener('click', (e) => {
      console.log('Fullscreen button clicked');
      e.preventDefault();
      this.toggleFullscreen();
    });

    // Find modal events
    this.findInput.addEventListener('input', () => {
      this.performFind();
    });

    this.findInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.findNext();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        this.hideFindModal();
      }
    });

    document.getElementById('find-prev-btn')?.addEventListener('click', () => {
      this.findPrevious();
    });

    document.getElementById('find-next-btn')?.addEventListener('click', () => {
      this.findNext();
    });

    document.getElementById('find-close-btn')?.addEventListener('click', () => {
      this.hideFindModal();
    });

    // Address bar
    this.addressInput.addEventListener('keydown', (event) => {
      console.log('Address input keydown:', event.key);
      if (event.key === 'Enter') {
        console.log('Enter pressed in address bar');
        this.handleAddressSubmit();
      }
    });

    this.addressInput.addEventListener('focus', () => {
      console.log('Address input focused');
      this.addressInput.select();
    });

    // Webview lifecycle (guarded in case element is missing)
    if (this.webview) {
  // Debug sizing
  const rect = (this.webview as HTMLElement).getBoundingClientRect();
  console.log('Webview initial bounding rect:', rect);
  console.log('Webview initial src:', this.webview.getAttribute('src'));

      // Observe attribute changes (e.g., src updates)
      try {
        const mo = new MutationObserver((records) => {
          records.forEach((r) => {
            if (r.type === 'attributes') {
              console.log('Webview attribute changed:', r.attributeName, '=>', this.webview.getAttribute(r.attributeName || ''));
            }
          });
        });
        mo.observe(this.webview as HTMLElement, { attributes: true, attributeFilter: ['src', 'partition', 'preload'] });
      } catch (e) {
        console.warn('Failed to attach MutationObserver to webview:', e);
      }

      this.webview.addEventListener('dom-ready', () => {
        console.log('Webview dom-ready');
        try {
          const sess = this.webview.getWebContents?.()?.session;
          if (sess && sess.webRequest) {
            sess.webRequest.onBeforeRequest((details: any, cb: any) => {
              console.log('Webview request:', details.url);
              cb({});
            });
          }
        } catch {}
        this.injectBlurStyles();
        this.updateAddressBar();
        this.updateNavigationButtons();

        // Log from inside the webview context
        try {
          this.webview.executeJavaScript?.('console.log("[WV] ready:", document.readyState, location.href);');
          this.webview.executeJavaScript?.('console.log("[WV] body content:", document.body ? document.body.innerHTML.substring(0, 200) : "no body");');
          this.webview.executeJavaScript?.('console.log("[WV] images found:", document.querySelectorAll("img").length);');
        } catch (e) {
          console.warn('executeJavaScript failed:', e);
        }
      });

      this.webview.addEventListener('did-start-loading', () => {
        console.log('Webview did-start-loading');
        this.updateStatus('Loading...');
      });

      this.webview.addEventListener('did-stop-loading', () => {
        console.log('Webview did-stop-loading');
        this.updateStatus('Ready');
        this.updateAddressBar();
        this.updateNavigationButtons();
      });

      this.webview.addEventListener('did-finish-load', () => {
        console.log('Webview did-finish-load');
        this.updateStatus('Ready');
        this.updateAddressBar();
        this.updateNavigationButtons();

        // Additional diagnostics
        try {
          this.webview.executeJavaScript?.('console.log("[WV] finished loading:", location.href, document.title);');
          this.webview.executeJavaScript?.('console.log("[WV] viewport:", window.innerWidth, "x", window.innerHeight);');
        } catch (e) {
          console.warn('executeJavaScript failed in did-finish-load:', e);
        }
      });

      this.webview.addEventListener('did-navigate', () => {
        console.log('Webview did-navigate');
        this.updateAddressBar();
        this.updateNavigationButtons();
      });

      this.webview.addEventListener('did-navigate-in-page', () => {
        console.log('Webview did-navigate-in-page');
        this.updateAddressBar();
        this.updateNavigationButtons();
      });

      this.webview.addEventListener('console-message', (e: any) => {
        try {
          console.log('Webview console:', e?.message);
        } catch {}
      });

      this.webview.addEventListener('found-in-page', (e: any) => {
        console.log('Found in page result:', e.result);
        if (e.result && e.result.requestId === this.currentFindRequestId) {
          const activeMatchOrdinal = e.result.activeMatchOrdinal || 0;
          const matches = e.result.matches || 0;
          this.findResultsText.textContent = `${activeMatchOrdinal} of ${matches}`;
        }
      });

      // Listen for messages from the webview
      window.addEventListener('message', (event) => {
        if (event.data && typeof event.data === 'object') {
          if (event.data.type === 'retry-navigation') {
            console.log('Received retry navigation request for:', event.data.url);
            this.navigateTo(event.data.url);
          } else if (event.data.type === 'open-in-browser') {
            console.log('Received open in browser request for:', event.data.url);
            // Use Electron's shell to open in system browser
            if ((window as any).appApi) {
              (window as any).appApi.openInBrowser(event.data.url).then((result: any) => {
                if (result.success) {
                  console.log('Successfully opened URL in system browser');
                } else {
                  console.error('Failed to open URL in system browser:', result.error);
                }
              }).catch((error: any) => {
                console.error('Error opening URL in system browser:', error);
              });
            } else {
              console.warn('appApi not available for opening in system browser');
            }
          }
        }
      });

      this.webview.addEventListener('did-fail-load', (e: any) => {
        console.warn('Webview did-fail-load:', e?.errorCode, e?.validatedURL);
        if (e?.validatedURL && e?.validatedURL !== 'about:blank') {
          this.handleLoadFailure(e.validatedURL, e?.errorCode, e?.errorDescription);
        }
      });

      // Additional navigation-related events for diagnostics
      this.webview.addEventListener('load-commit', (e: any) => {
        console.log('Webview load-commit:', { url: e?.url, isMainFrame: e?.isMainFrame });
      });
      this.webview.addEventListener('will-navigate', (e: any) => {
        console.log('Webview will-navigate:', e?.url);
      });
      this.webview.addEventListener('did-redirect-navigation', (e: any) => {
        console.log('Webview did-redirect-navigation:', e?.url);
      });
      this.webview.addEventListener('page-title-updated', (e: any) => {
        console.log('Webview page-title-updated:', e?.title);
      });
      this.webview.addEventListener('update-target-url', (e: any) => {
        console.log('Webview update-target-url:', e?.url);
      });

      // Additional debugging events
      this.webview.addEventListener('new-window', (e: any) => {
        console.log('Webview new-window:', e?.url);
      });

      this.webview.addEventListener('crashed', () => {
        console.error('Webview crashed');
      });

      this.webview.addEventListener('gpu-crashed', () => {
        console.error('Webview GPU crashed');
      });
    }
  }

  private initializeNavigation(): void {
    console.log('Initializing navigation');
    // Set initial src to Google
    const initialUrl = 'https://www.google.com';
    try {
      if (this.webview) {
        const current = this.webview.getAttribute('src');
        console.log('Current webview src before setting:', current);
        console.log('Webview element visibility:', {
          offsetWidth: (this.webview as HTMLElement).offsetWidth,
          offsetHeight: (this.webview as HTMLElement).offsetHeight,
          clientWidth: (this.webview as HTMLElement).clientWidth,
          clientHeight: (this.webview as HTMLElement).clientHeight,
          style: {
            display: (this.webview as HTMLElement).style.display,
            visibility: (this.webview as HTMLElement).style.visibility,
            width: (this.webview as HTMLElement).style.width,
            height: (this.webview as HTMLElement).style.height
          }
        });

        if (current !== initialUrl) {
          console.log('Setting initial webview src to:', initialUrl);
          this.webview.setAttribute('src', initialUrl);
        } else {
          console.log('Initial webview src already set to:', current);
        }

        // Add resize observer to watch for size changes
        try {
          const resizeObserver = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
              console.log('Webview resized:', {
                width: entry.contentRect.width,
                height: entry.contentRect.height,
                target: entry.target
              });
            });
          });
          resizeObserver.observe(this.webview as HTMLElement);
        } catch (e) {
          console.warn('Failed to set up resize observer:', e);
        }

        // Check if webview is actually loading after a short delay
        setTimeout(() => {
          console.log('Webview status check after 1s:', {
            src: this.webview.getAttribute('src'),
            isLoading: this.webview.isLoading?.(),
            canGoBack: this.webview.canGoBack?.(),
            canGoForward: this.webview.canGoForward?.()
          });
        }, 1000);

      } else {
        console.error('Webview element not found during initialization!');
      }
    } catch (e) {
      console.warn('Failed to set initial webview src:', e);
    }

    this.addToHistory(initialUrl);
    this.currentUrl = initialUrl;
    this.updateAddressBar();
    this.updateNavigationButtons();
    this.updateZoomDisplay();
  }

  private handleAddressSubmit(): void {
    const url = this.addressInput.value.trim();
    console.log('Handling address submit:', url);
    if (url) {
      let fullUrl = url;

      // Add protocol if missing
      if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/')) {
        // If it looks like a domain (contains a dot and no spaces), add https
        if (url.includes('.') && !url.includes(' ')) {
          fullUrl = 'https://' + url;
        } else if (url.includes(' ') || (!url.includes('.') && url.length > 0)) {
          // For search terms, redirect to Google search
          console.log('Treating as search term:', url);
          const searchQuery = encodeURIComponent(url);
          fullUrl = `https://www.google.com/search?q=${searchQuery}`;
        } else {
          // This shouldn't happen, but handle gracefully
          console.log('Unexpected URL format:', url);
          this.showNavigationError(url, -1, 'Invalid URL format');
          return;
        }
      }

      console.log('Navigating to:', fullUrl);
      this.navigateTo(fullUrl);
    }
  }

  private navigateTo(url: string): void {
    console.log('Navigating to URL:', url);
    this.updateStatus('Loading...');
    try {
      // For full URLs (http/https), use as-is
      // For relative URLs, resolve them
      const target = url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')
        ? url
        : `${window.location.origin}${url.startsWith('/') ? '' : '/'}${url}`;
      console.log('Resolved navigation target:', target);
      // Use src attribute for webview navigation
      if (this.webview) {
        this.webview.setAttribute('src', target);
      }
      this.addToHistory(target);
      this.currentUrl = target;
    } catch (error) {
      console.error('Navigation error:', error);
      this.updateStatus('Navigation failed');
      this.showNavigationError(url);
    }
  }

  private handleLoadFailure(url: string, errorCode?: number, errorDescription?: string): void {
    console.log('Handling load failure for:', url, 'Error:', errorCode, errorDescription);

    // Check if this is a security-related blocking error
    const isSecurityError = errorCode === -3 ||
                           (errorDescription && (
                             errorDescription.includes('blocked') ||
                             errorDescription.includes('security') ||
                             errorDescription.includes('X-Frame-Options') ||
                             errorDescription.includes('Content Security Policy')
                           ));

    if (isSecurityError) {
      console.log('Security error detected, attempting alternative loading method');
      this.attemptAlternativeLoad(url);
    } else {
      this.showNavigationError(url, errorCode, errorDescription);
    }
  }

  private async attemptAlternativeLoad(url: string): Promise<void> {
    try {
      console.log('Attempting alternative load for:', url);

      // Try loading with a different user agent that might bypass restrictions
      const alternativeHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Loading ${url}...</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              text-align: center;
              padding: 50px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              margin: 0;
              min-height: 100vh;
            }
            .loading-container {
              background: rgba(255,255,255,0.1);
              border-radius: 12px;
              padding: 40px;
              max-width: 600px;
              margin: 0 auto;
              backdrop-filter: blur(10px);
            }
            h1 { font-size: 2em; margin-bottom: 20px; }
            p { font-size: 1.1em; margin-bottom: 30px; opacity: 0.9; }
            .spinner {
              border: 4px solid rgba(255,255,255,0.3);
              border-top: 4px solid white;
              border-radius: 50%;
              width: 40px;
              height: 40px;
              animation: spin 1s linear infinite;
              margin: 20px auto;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            .retry-btn {
              background: #4CAF50;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 6px;
              cursor: pointer;
              font-size: 16px;
              margin: 10px;
            }
            .retry-btn:hover { background: #45a049; }
          </style>
        </head>
        <body>
          <div class="loading-container">
            <h1>� Loading Site...</h1>
            <p>Attempting to load <strong>${url}</strong> with enhanced compatibility.</p>
            <div class="spinner"></div>
            <p style="font-size: 0.9em; opacity: 0.7;">If this takes too long, the site may have additional security restrictions.</p>
            <button class="retry-btn" onclick="retryOriginalLoad()">Try Original Method</button>
            <button class="retry-btn" onclick="openInSystemBrowser()" style="background: #FF9800;">Open in System Browser</button>
          </div>
          <script>
            let retryTimeout = setTimeout(() => {
              // If still loading after 10 seconds, show error
              document.querySelector('.loading-container').innerHTML = \`
                <h1>⚠️ Loading Issue</h1>
                <p>The site <strong>${url}</strong> is taking longer than expected to load.</p>
                <p>This might be due to security restrictions or network issues.</p>
                <button class="retry-btn" onclick="retryOriginalLoad()">Retry</button>
                <button class="retry-btn" onclick="openInSystemBrowser()" style="background: #FF9800;">Open in Browser</button>
              \`;
            }, 10000);

            function retryOriginalLoad() {
              clearTimeout(retryTimeout);
              // Use postMessage to communicate with the main renderer
              window.postMessage({ type: 'retry-navigation', url: '${url}' }, '*');
            }

            function openInSystemBrowser() {
              clearTimeout(retryTimeout);
              // Use postMessage to communicate with the main renderer
              window.postMessage({ type: 'open-in-browser', url: '${url}' }, '*');
            }
          </script>
        </body>
        </html>
      `;

      const dataUrl = 'data:text/html,' + alternativeHtml;
      if (this.webview) {
        this.webview.setAttribute('src', dataUrl);
      }

      // Don't automatically retry - let the user decide

    } catch (error) {
      console.error('Failed to attempt alternative load:', error);
      this.showNavigationError(url, -1, 'Alternative loading method failed');
    }
  }

  private showNavigationError(url: string, errorCode?: number, errorDescription?: string): void {
    console.log('Showing navigation error for:', url, 'Error:', errorCode, errorDescription);
    this.updateStatus('Site blocked iframe embedding');

    const errorDetails = errorCode || errorDescription ?
      `<strong>Error Code:</strong> ${errorCode || 'Unknown'}<br>
       <strong>Description:</strong> ${errorDescription || 'Unknown error'}` :
      `<strong>Reason:</strong> This website blocks iframe embedding for security reasons.<br>
       <strong>Technical:</strong> X-Frame-Options header prevents embedding.`;

    // Create a simple error page
    const errorHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Navigation Error</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            text-align: center;
            padding: 50px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
            margin: 0;
          }
          .error-container {
            background: rgba(255,255,255,0.1);
            border-radius: 12px;
            padding: 40px;
            max-width: 600px;
            margin: 0 auto;
            backdrop-filter: blur(10px);
          }
          h1 { font-size: 2.5em; margin-bottom: 20px; }
          p { font-size: 1.2em; margin-bottom: 30px; opacity: 0.9; }
          .error-details {
            background: rgba(0,0,0,0.2);
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: left;
          }
          .suggestions {
            text-align: left;
            margin-top: 30px;
          }
          .suggestions h3 {
            color: #ffd700;
            margin-bottom: 15px;
          }
          .suggestions ul {
            list-style: none;
            padding: 0;
          }
          .suggestions li {
            margin-bottom: 10px;
            padding-left: 20px;
            position: relative;
          }
          .suggestions li:before {
            content: "💡";
            position: absolute;
            left: 0;
          }
          .retry-btn {
            background: #2196F3;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            margin: 10px;
            text-decoration: none;
            display: inline-block;
          }
          .retry-btn:hover { background: #1976D2; }
        </style>
      </head>
      <body>
        <div class="error-container">
          <h1>🚫 Navigation Blocked</h1>
          <p>The website <strong>${url}</strong> cannot be displayed in NoxBox.</p>

          <div class="error-details">
            ${errorDetails}
          </div>

          <div class="suggestions">
            <h3>Try these alternatives:</h3>
            <ul>
              <li><a href="#" onclick="retryLoad()" class="retry-btn" style="color: white;">Retry Loading</a></li>
              <li><button onclick="openInSystemBrowser()" class="retry-btn" style="background: #FF9800;">Use your system browser</button></li>
              <li>Try a different website that allows embedding</li>
              <li><a href="#" onclick="loadDemo()" class="retry-btn" style="background: #9C27B0; color: white;">Use the demo page</a></li>
              <li><button onclick="goBack()" class="retry-btn" style="background: #607D8B;">Navigate back</button></li>
            </ul>
          </div>
        </div>
        <script>
          function retryLoad() {
            // Use postMessage to communicate with the main renderer
            window.postMessage({ type: 'retry-navigation', url: '${url}' }, '*');
          }

          function openInSystemBrowser() {
            // Use postMessage to communicate with the main renderer
            window.postMessage({ type: 'open-in-browser', url: '${url}' }, '*');
          }

          function loadDemo() {
            // Navigate to the demo page
            window.postMessage({ type: 'retry-navigation', url: 'https://www.google.com' }, '*');
          }

          function goBack() {
            // Go back in history
            if (window.history.length > 1) {
              window.history.back();
            } else {
              // If no history, load Google
              window.postMessage({ type: 'retry-navigation', url: 'https://www.google.com' }, '*');
            }
          }
        </script>
      </body>
      </html>
    `;

    // Load the error page
    const dataUrl = 'data:text/html,' + errorHtml;
    if (this.webview) {
      this.webview.setAttribute('src', dataUrl);
    }
    this.addToHistory(dataUrl);
  }

  private goBack(): void {
    console.log('Going back in history');
    if (this.webview?.canGoBack?.()) {
      this.webview.goBack();
    } else {
      console.log('Cannot go back - no webview history available');
    }
  }

  private goForward(): void {
    console.log('Going forward in history');
    if (this.webview?.canGoForward?.()) {
      this.webview.goForward();
    } else {
      console.log('Cannot go forward - no webview history available');
    }
  }

  private refresh(): void {
    console.log('Refreshing page');
    if (this.webview?.reload) {
      this.webview.reload();
    }
  }

  private goHome(): void {
    console.log('Going home');
    this.navigateTo('https://www.google.com');
  }

  private bookmarkCurrentPage(): void {
    console.log('Bookmarking current page');
    // Get current URL and title
    const currentUrl = this.getCurrentUrl();
    const currentTitle = this.webview?.getTitle?.() || currentUrl;

    if (currentUrl && currentUrl !== 'about:blank' && !currentUrl.startsWith('data:')) {
      // Dispatch custom event to notify the main app about the bookmark
      const bookmarkEvent = new CustomEvent('bookmark-page', {
        detail: { title: currentTitle, url: currentUrl }
      });
      window.dispatchEvent(bookmarkEvent);
      console.log('Bookmark event dispatched for:', currentTitle, currentUrl);
    } else {
      console.warn('Cannot bookmark this page - invalid URL or data URL');
    }
  }

  private addToHistory(url: string): void {
    console.log('Adding to history:', url);
    if (url && url !== 'about:blank' && !url.startsWith('data:')) {
      try {
        const title = this.webview?.getTitle?.() || url;
        this.historyManager.addEntry(url, title);
        this.currentUrl = url;
        console.log('History entry added for:', title, url);
      } catch (error) {
        console.warn('Failed to add history entry:', error);
      }
    }
  }

  private updateAddressBar(): void {
    try {
  const currentUrl = this.getCurrentUrl();
      console.log('Updating address bar with URL:', currentUrl);
      if (currentUrl && currentUrl !== 'about:blank') {
        this.addressInput.value = currentUrl;
      }
    } catch (error) {
      console.warn('Could not update address bar:', error);
    }
  }

  private updateNavigationButtons(): void {
    console.log('Updating navigation buttons');
    const backBtn = document.getElementById('back-btn') as HTMLButtonElement;
    const forwardBtn = document.getElementById('forward-btn') as HTMLButtonElement;

    const canGoBack = this.webview?.canGoBack ? this.webview.canGoBack() : false;
    const canGoForward = this.webview?.canGoForward ? this.webview.canGoForward() : false;

    console.log('Navigation state:', { canGoBack, canGoForward });

    if (backBtn) {
      backBtn.disabled = !canGoBack;
    }
    if (forwardBtn) {
      forwardBtn.disabled = !canGoForward;
    }
  }

  private getCurrentUrl(): string {
    try {
      // Prefer src attribute; getURL is not available on the DOM element directly in all contexts
      const url = this.webview?.getAttribute('src') || '';
      return url;
    } catch (e) {
      return '';
    }
  }

  private isDataUrl(url: string): boolean {
    return url.startsWith('data:');
  }

  private async injectBlurStyles(): Promise<void> {
    try {
      const blurRadius = getComputedStyle(document.documentElement).getPropertyValue('--blur-radius') || '6px';
      const css = `
        img, video {
          filter: blur(${blurRadius.trim()}) !important;
          transition: filter 180ms ease;
        }
        img:hover, video:hover {
          filter: none !important;
        }
        /* Target common ad selectors */
        [id*="ad"], [class*="ad"], [id*="banner"], [class*="banner"],
        [id*="sponsor"], [class*="sponsor"], [id*="promo"], [class*="promo"] img,
        [id*="google"], [class*="google"] img,
        iframe[src*="ads"], iframe[src*="doubleclick"], iframe[src*="googlesyndication"] {
          filter: blur(${blurRadius.trim()}) !important;
        }
        /* Target images within ad containers */
        div[id*="ad"] img, div[class*="ad"] img,
        div[id*="banner"] img, div[class*="banner"] img {
          filter: blur(${blurRadius.trim()}) !important;
        }
        /* Target video ads specifically */
        video[autoplay], video[loop], video[muted], video[playsinline], video[webkit-playsinline] {
          filter: blur(${blurRadius.trim()}) !important;
        }
        /* Target videos inside links (common ad pattern) */
        a video {
          filter: blur(${blurRadius.trim()}) !important;
        }
      `;
      await this.webview.insertCSS?.(css);
      console.log('Injected enhanced blur CSS into webview');
    } catch (e) {
      console.warn('Failed to inject blur CSS:', e);
    }
  }

  private updateStatus(message: string): void {
    const statusText = document.getElementById('status-text');
    if (statusText) {
      statusText.textContent = message;
      // Clear status after 3 seconds for non-error messages
      if (message !== 'Site blocked iframe embedding') {
        setTimeout(() => {
          if (statusText.textContent === message) {
            statusText.textContent = 'Ready';
          }
        }, 3000);
      }
    }
  }

  setAddress(url: string): void {
    console.log('Setting address to:', url);
    this.addressInput.value = url;
  }

  getAddress(): string {
    return this.addressInput.value;
  }

  enableBackButton(enabled: boolean): void {
    console.log('Setting back button enabled:', enabled);
    const backBtn = document.getElementById('back-btn') as HTMLButtonElement;
    if (backBtn) {
      backBtn.disabled = !enabled;
    }
  }

  enableForwardButton(enabled: boolean): void {
    console.log('Setting forward button enabled:', enabled);
    const forwardBtn = document.getElementById('forward-btn') as HTMLButtonElement;
    if (forwardBtn) {
      forwardBtn.disabled = !enabled;
    }
  }

  private findInPage(): void {
    console.log('Find in page triggered');
    if (this.webview) {
      this.webview.findInPage?.('', { matchCase: false });
    }
  }

  zoomIn(): void {
    console.log('Zoom in triggered');
    if (this.webview) {
      const currentZoom = this.webview.getZoomLevel?.() || 0;
      this.webview.setZoomLevel?.(currentZoom + 1);
      this.updateZoomDisplay();
    }
  }

  zoomOut(): void {
    console.log('Zoom out triggered');
    if (this.webview) {
      const currentZoom = this.webview.getZoomLevel?.() || 0;
      this.webview.setZoomLevel?.(currentZoom - 1);
      this.updateZoomDisplay();
    }
  }

  resetZoom(): void {
    console.log('Reset zoom triggered');
    if (this.webview) {
      this.webview.setZoomLevel?.(0);
      this.updateZoomDisplay();
    }
  }

  private toggleFullscreen(): void {
    console.log('Toggle fullscreen triggered');
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }

  private updateZoomDisplay(): void {
    if (this.webview) {
      const zoomLevel = this.webview.getZoomLevel?.() || 0;
      const zoomPercent = Math.round(Math.pow(1.2, zoomLevel) * 100);
      const zoomDisplay = document.getElementById('zoom-level');
      if (zoomDisplay) {
        zoomDisplay.textContent = `${zoomPercent}%`;
      }
    }
  }

  private showFindModal(): void {
    this.findModal.classList.add('active');
    this.findInput.focus();
    this.findInput.select();
  }

  private hideFindModal(): void {
    this.findModal.classList.remove('active');
    this.findInput.value = '';
    this.findResultsText.textContent = '0 of 0';
    if (this.currentFindRequestId !== null) {
      this.webview?.stopFindInPage?.('clearSelection');
      this.currentFindRequestId = null;
    }
  }

  private performFind(): void {
    const searchText = this.findInput.value.trim();
    if (searchText && this.webview) {
      if (this.currentFindRequestId !== null) {
        this.webview.stopFindInPage('clearSelection', { requestId: this.currentFindRequestId });
      }

      this.currentFindRequestId = Math.floor(Math.random() * 1000000);
      this.webview.findInPage(searchText, {
        matchCase: false,
        requestId: this.currentFindRequestId
      });
    } else {
      this.findResultsText.textContent = '0 of 0';
    }
  }

  private findNext(): void {
    if (this.webview && this.currentFindRequestId !== null) {
      this.webview.findInPage('', {
        findNext: true,
        matchCase: false,
        requestId: this.currentFindRequestId
      });
    }
  }

  private findPrevious(): void {
    if (this.webview && this.currentFindRequestId !== null) {
      this.webview.findInPage('', {
        forward: false,
        findNext: true,
        matchCase: false,
        requestId: this.currentFindRequestId
      });
    }
  }
}
