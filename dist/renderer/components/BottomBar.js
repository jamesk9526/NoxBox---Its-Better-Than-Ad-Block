"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BottomBar = void 0;
const HistoryManager_js_1 = require("./HistoryManager.js");
class BottomBar {
    constructor() {
        this.currentUrl = '';
        console.log('BottomBar constructor called');
        this.element = document.getElementById('bottom-bar');
        this.addressInput = document.getElementById('address-input');
        this.webview = document.getElementById('browser-webview');
        this.historyManager = HistoryManager_js_1.HistoryManager.getInstance();
        console.log('Browser webview found:', !!this.webview);
        this.setupEventListeners();
        this.initializeNavigation();
    }
    setupEventListeners() {
        console.log('Setting up BottomBar event listeners');
        // Navigation controls
        const backBtn = document.getElementById('back-btn');
        const forwardBtn = document.getElementById('forward-btn');
        const refreshBtn = document.getElementById('refresh-btn');
        const bookmarkBtn = document.getElementById('bookmark-btn');
        console.log('Navigation buttons found:', {
            back: !!backBtn,
            forward: !!forwardBtn,
            refresh: !!refreshBtn,
            bookmark: !!bookmarkBtn
        });
        backBtn === null || backBtn === void 0 ? void 0 : backBtn.addEventListener('click', (e) => {
            console.log('Back button clicked');
            e.preventDefault();
            this.goBack();
        });
        forwardBtn === null || forwardBtn === void 0 ? void 0 : forwardBtn.addEventListener('click', (e) => {
            console.log('Forward button clicked');
            e.preventDefault();
            this.goForward();
        });
        refreshBtn === null || refreshBtn === void 0 ? void 0 : refreshBtn.addEventListener('click', (e) => {
            console.log('Refresh button clicked');
            e.preventDefault();
            this.refresh();
        });
        bookmarkBtn === null || bookmarkBtn === void 0 ? void 0 : bookmarkBtn.addEventListener('click', (e) => {
            console.log('Bookmark button clicked');
            e.preventDefault();
            this.bookmarkCurrentPage();
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
            const rect = this.webview.getBoundingClientRect();
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
                mo.observe(this.webview, { attributes: true, attributeFilter: ['src', 'partition', 'preload'] });
            }
            catch (e) {
                console.warn('Failed to attach MutationObserver to webview:', e);
            }
            this.webview.addEventListener('dom-ready', () => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                console.log('Webview dom-ready');
                try {
                    const sess = (_c = (_b = (_a = this.webview).getWebContents) === null || _b === void 0 ? void 0 : _b.call(_a)) === null || _c === void 0 ? void 0 : _c.session;
                    if (sess && sess.webRequest) {
                        sess.webRequest.onBeforeRequest((details, cb) => {
                            console.log('Webview request:', details.url);
                            cb({});
                        });
                    }
                }
                catch (_k) { }
                this.injectBlurStyles();
                this.updateAddressBar();
                this.updateNavigationButtons();
                // Log from inside the webview context
                try {
                    (_e = (_d = this.webview).executeJavaScript) === null || _e === void 0 ? void 0 : _e.call(_d, 'console.log("[WV] ready:", document.readyState, location.href);');
                    (_g = (_f = this.webview).executeJavaScript) === null || _g === void 0 ? void 0 : _g.call(_f, 'console.log("[WV] body content:", document.body ? document.body.innerHTML.substring(0, 200) : "no body");');
                    (_j = (_h = this.webview).executeJavaScript) === null || _j === void 0 ? void 0 : _j.call(_h, 'console.log("[WV] images found:", document.querySelectorAll("img").length);');
                }
                catch (e) {
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
                var _a, _b, _c, _d;
                console.log('Webview did-finish-load');
                this.updateStatus('Ready');
                this.updateAddressBar();
                this.updateNavigationButtons();
                // Additional diagnostics
                try {
                    (_b = (_a = this.webview).executeJavaScript) === null || _b === void 0 ? void 0 : _b.call(_a, 'console.log("[WV] finished loading:", location.href, document.title);');
                    (_d = (_c = this.webview).executeJavaScript) === null || _d === void 0 ? void 0 : _d.call(_c, 'console.log("[WV] viewport:", window.innerWidth, "x", window.innerHeight);');
                }
                catch (e) {
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
            this.webview.addEventListener('console-message', (e) => {
                try {
                    console.log('Webview console:', e === null || e === void 0 ? void 0 : e.message);
                }
                catch (_a) { }
            });
            // Listen for messages from the webview
            window.addEventListener('message', (event) => {
                if (event.data && typeof event.data === 'object') {
                    if (event.data.type === 'retry-navigation') {
                        console.log('Received retry navigation request for:', event.data.url);
                        this.navigateTo(event.data.url);
                    }
                    else if (event.data.type === 'open-in-browser') {
                        console.log('Received open in browser request for:', event.data.url);
                        // Use Electron's shell to open in system browser
                        if (window.appApi) {
                            window.appApi.openInBrowser(event.data.url).then((result) => {
                                if (result.success) {
                                    console.log('Successfully opened URL in system browser');
                                }
                                else {
                                    console.error('Failed to open URL in system browser:', result.error);
                                }
                            }).catch((error) => {
                                console.error('Error opening URL in system browser:', error);
                            });
                        }
                        else {
                            console.warn('appApi not available for opening in system browser');
                        }
                    }
                }
            });
            this.webview.addEventListener('did-fail-load', (e) => {
                console.warn('Webview did-fail-load:', e === null || e === void 0 ? void 0 : e.errorCode, e === null || e === void 0 ? void 0 : e.validatedURL);
                if ((e === null || e === void 0 ? void 0 : e.validatedURL) && (e === null || e === void 0 ? void 0 : e.validatedURL) !== 'about:blank') {
                    this.handleLoadFailure(e.validatedURL, e === null || e === void 0 ? void 0 : e.errorCode, e === null || e === void 0 ? void 0 : e.errorDescription);
                }
            });
            // Additional navigation-related events for diagnostics
            this.webview.addEventListener('load-commit', (e) => {
                console.log('Webview load-commit:', { url: e === null || e === void 0 ? void 0 : e.url, isMainFrame: e === null || e === void 0 ? void 0 : e.isMainFrame });
            });
            this.webview.addEventListener('will-navigate', (e) => {
                console.log('Webview will-navigate:', e === null || e === void 0 ? void 0 : e.url);
            });
            this.webview.addEventListener('did-redirect-navigation', (e) => {
                console.log('Webview did-redirect-navigation:', e === null || e === void 0 ? void 0 : e.url);
            });
            this.webview.addEventListener('page-title-updated', (e) => {
                console.log('Webview page-title-updated:', e === null || e === void 0 ? void 0 : e.title);
            });
            this.webview.addEventListener('update-target-url', (e) => {
                console.log('Webview update-target-url:', e === null || e === void 0 ? void 0 : e.url);
            });
            // Additional debugging events
            this.webview.addEventListener('new-window', (e) => {
                console.log('Webview new-window:', e === null || e === void 0 ? void 0 : e.url);
            });
            this.webview.addEventListener('crashed', () => {
                console.error('Webview crashed');
            });
            this.webview.addEventListener('gpu-crashed', () => {
                console.error('Webview GPU crashed');
            });
        }
    }
    initializeNavigation() {
        console.log('Initializing navigation');
        // Set initial src to Google
        const initialUrl = 'https://www.google.com';
        try {
            if (this.webview) {
                const current = this.webview.getAttribute('src');
                console.log('Current webview src before setting:', current);
                console.log('Webview element visibility:', {
                    offsetWidth: this.webview.offsetWidth,
                    offsetHeight: this.webview.offsetHeight,
                    clientWidth: this.webview.clientWidth,
                    clientHeight: this.webview.clientHeight,
                    style: {
                        display: this.webview.style.display,
                        visibility: this.webview.style.visibility,
                        width: this.webview.style.width,
                        height: this.webview.style.height
                    }
                });
                if (current !== initialUrl) {
                    console.log('Setting initial webview src to:', initialUrl);
                    this.webview.setAttribute('src', initialUrl);
                }
                else {
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
                    resizeObserver.observe(this.webview);
                }
                catch (e) {
                    console.warn('Failed to set up resize observer:', e);
                }
                // Check if webview is actually loading after a short delay
                setTimeout(() => {
                    var _a, _b, _c, _d, _e, _f;
                    console.log('Webview status check after 1s:', {
                        src: this.webview.getAttribute('src'),
                        isLoading: (_b = (_a = this.webview).isLoading) === null || _b === void 0 ? void 0 : _b.call(_a),
                        canGoBack: (_d = (_c = this.webview).canGoBack) === null || _d === void 0 ? void 0 : _d.call(_c),
                        canGoForward: (_f = (_e = this.webview).canGoForward) === null || _f === void 0 ? void 0 : _f.call(_e)
                    });
                }, 1000);
            }
            else {
                console.error('Webview element not found during initialization!');
            }
        }
        catch (e) {
            console.warn('Failed to set initial webview src:', e);
        }
        this.addToHistory(initialUrl);
        this.currentUrl = initialUrl;
        this.updateAddressBar();
        this.updateNavigationButtons();
    }
    handleAddressSubmit() {
        const url = this.addressInput.value.trim();
        console.log('Handling address submit:', url);
        if (url) {
            let fullUrl = url;
            // Add protocol if missing
            if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/')) {
                // If it looks like a domain (contains a dot and no spaces), add https
                if (url.includes('.') && !url.includes(' ')) {
                    fullUrl = 'https://' + url;
                }
                else if (url.includes(' ') || (!url.includes('.') && url.length > 0)) {
                    // For search terms or invalid URLs, try to handle them better
                    console.log('Treating as search term or invalid URL:', url);
                    // For now, show an error for search terms since we don't have search functionality
                    this.showNavigationError(url, -1, 'Invalid URL format. Please enter a valid URL or domain name.');
                    return;
                }
                else {
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
    navigateTo(url) {
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
        }
        catch (error) {
            console.error('Navigation error:', error);
            this.updateStatus('Navigation failed');
            this.showNavigationError(url);
        }
    }
    handleLoadFailure(url, errorCode, errorDescription) {
        console.log('Handling load failure for:', url, 'Error:', errorCode, errorDescription);
        // Check if this is a security-related blocking error
        const isSecurityError = errorCode === -3 ||
            (errorDescription && (errorDescription.includes('blocked') ||
                errorDescription.includes('security') ||
                errorDescription.includes('X-Frame-Options') ||
                errorDescription.includes('Content Security Policy')));
        if (isSecurityError) {
            console.log('Security error detected, attempting alternative loading method');
            this.attemptAlternativeLoad(url);
        }
        else {
            this.showNavigationError(url, errorCode, errorDescription);
        }
    }
    attemptAlternativeLoad(url) {
        return __awaiter(this, void 0, void 0, function* () {
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
            }
            catch (error) {
                console.error('Failed to attempt alternative load:', error);
                this.showNavigationError(url, -1, 'Alternative loading method failed');
            }
        });
    }
    showNavigationError(url, errorCode, errorDescription) {
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
    goBack() {
        var _a, _b;
        console.log('Going back in history');
        if ((_b = (_a = this.webview) === null || _a === void 0 ? void 0 : _a.canGoBack) === null || _b === void 0 ? void 0 : _b.call(_a)) {
            this.webview.goBack();
        }
        else {
            console.log('Cannot go back - no webview history available');
        }
    }
    goForward() {
        var _a, _b;
        console.log('Going forward in history');
        if ((_b = (_a = this.webview) === null || _a === void 0 ? void 0 : _a.canGoForward) === null || _b === void 0 ? void 0 : _b.call(_a)) {
            this.webview.goForward();
        }
        else {
            console.log('Cannot go forward - no webview history available');
        }
    }
    refresh() {
        var _a;
        console.log('Refreshing page');
        if ((_a = this.webview) === null || _a === void 0 ? void 0 : _a.reload) {
            this.webview.reload();
        }
    }
    bookmarkCurrentPage() {
        var _a, _b;
        console.log('Bookmarking current page');
        // Get current URL and title
        const currentUrl = this.getCurrentUrl();
        const currentTitle = ((_b = (_a = this.webview) === null || _a === void 0 ? void 0 : _a.getTitle) === null || _b === void 0 ? void 0 : _b.call(_a)) || currentUrl;
        if (currentUrl && currentUrl !== 'about:blank' && !currentUrl.startsWith('data:')) {
            // Dispatch custom event to notify the main app about the bookmark
            const bookmarkEvent = new CustomEvent('bookmark-page', {
                detail: { title: currentTitle, url: currentUrl }
            });
            window.dispatchEvent(bookmarkEvent);
            console.log('Bookmark event dispatched for:', currentTitle, currentUrl);
        }
        else {
            console.warn('Cannot bookmark this page - invalid URL or data URL');
        }
    }
    addToHistory(url) {
        var _a, _b;
        console.log('Adding to history:', url);
        if (url && url !== 'about:blank' && !url.startsWith('data:')) {
            try {
                const title = ((_b = (_a = this.webview) === null || _a === void 0 ? void 0 : _a.getTitle) === null || _b === void 0 ? void 0 : _b.call(_a)) || url;
                this.historyManager.addEntry(url, title);
                this.currentUrl = url;
                console.log('History entry added for:', title, url);
            }
            catch (error) {
                console.warn('Failed to add history entry:', error);
            }
        }
    }
    updateAddressBar() {
        try {
            const currentUrl = this.getCurrentUrl();
            console.log('Updating address bar with URL:', currentUrl);
            if (currentUrl && currentUrl !== 'about:blank') {
                this.addressInput.value = currentUrl;
            }
        }
        catch (error) {
            console.warn('Could not update address bar:', error);
        }
    }
    updateNavigationButtons() {
        var _a, _b;
        console.log('Updating navigation buttons');
        const backBtn = document.getElementById('back-btn');
        const forwardBtn = document.getElementById('forward-btn');
        const canGoBack = ((_a = this.webview) === null || _a === void 0 ? void 0 : _a.canGoBack) ? this.webview.canGoBack() : false;
        const canGoForward = ((_b = this.webview) === null || _b === void 0 ? void 0 : _b.canGoForward) ? this.webview.canGoForward() : false;
        console.log('Navigation state:', { canGoBack, canGoForward });
        if (backBtn) {
            backBtn.disabled = !canGoBack;
        }
        if (forwardBtn) {
            forwardBtn.disabled = !canGoForward;
        }
    }
    getCurrentUrl() {
        var _a;
        try {
            // Prefer src attribute; getURL is not available on the DOM element directly in all contexts
            const url = ((_a = this.webview) === null || _a === void 0 ? void 0 : _a.getAttribute('src')) || '';
            return url;
        }
        catch (e) {
            return '';
        }
    }
    isDataUrl(url) {
        return url.startsWith('data:');
    }
    injectBlurStyles() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const blurRadius = getComputedStyle(document.documentElement).getPropertyValue('--blur-radius') || '6px';
                const css = `img,video{filter: blur(${blurRadius.trim()}) !important; transition: filter 180ms ease;} img:hover,video:hover{filter:none !important;}`;
                yield ((_b = (_a = this.webview).insertCSS) === null || _b === void 0 ? void 0 : _b.call(_a, css));
                console.log('Injected blur CSS into webview');
            }
            catch (e) {
                console.warn('Failed to inject blur CSS:', e);
            }
        });
    }
    updateStatus(message) {
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
    setAddress(url) {
        console.log('Setting address to:', url);
        this.addressInput.value = url;
    }
    getAddress() {
        return this.addressInput.value;
    }
    enableBackButton(enabled) {
        console.log('Setting back button enabled:', enabled);
        const backBtn = document.getElementById('back-btn');
        if (backBtn) {
            backBtn.disabled = !enabled;
        }
    }
    enableForwardButton(enabled) {
        console.log('Setting forward button enabled:', enabled);
        const forwardBtn = document.getElementById('forward-btn');
        if (forwardBtn) {
            forwardBtn.disabled = !enabled;
        }
    }
}
exports.BottomBar = BottomBar;
