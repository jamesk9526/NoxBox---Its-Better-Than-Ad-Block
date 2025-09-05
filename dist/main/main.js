"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = __importStar(require("path"));
const utils_1 = require("./utils");
let mainWindow = null;
function createWindow() {
    // Create the browser window
    mainWindow = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        frame: false, // Remove default frame for custom UI
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            webviewTag: true,
            webSecurity: false, // Allow loading content that would normally be blocked
            allowRunningInsecureContent: true,
            preload: path.join(__dirname, '../preload/preload.js'),
        },
        icon: path.join(__dirname, '../../assets/icon.png'), // Add icon later
        show: false, // Don't show until ready
    });
    // Load the app
    const startUrl = (0, utils_1.isDev)()
        ? 'http://localhost:5173'
        : `file://${path.join(__dirname, '../renderer/index.html')}`;
    mainWindow.loadURL(startUrl);
    // Show window when ready to prevent visual flash
    mainWindow.once('ready-to-show', () => {
        if (mainWindow) {
            mainWindow.show();
        }
    });
    // Open DevTools in development (commented out to prevent auto-opening)
    // if (isDev()) {
    //   mainWindow.webContents.openDevTools();
    // }
    // Handle window closed
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}
// App event handlers
electron_1.app.whenReady().then(createWindow);
electron_1.app.on('window-all-closed', () => {
    // On macOS, keep app running even when all windows are closed
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', () => {
    // On macOS, re-create window when dock icon is clicked
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
// IPC handlers for window controls
electron_1.ipcMain.handle('window:minimize', () => {
    if (mainWindow) {
        mainWindow.minimize();
    }
});
electron_1.ipcMain.handle('window:maximize', () => {
    if (mainWindow) {
        mainWindow.maximize();
    }
});
electron_1.ipcMain.handle('window:unmaximize', () => {
    if (mainWindow) {
        mainWindow.unmaximize();
    }
});
electron_1.ipcMain.handle('window:close', () => {
    if (mainWindow) {
        mainWindow.close();
    }
});
electron_1.ipcMain.handle('window:isMaximized', () => {
    return mainWindow?.isMaximized() || false;
});
// Handle opening URLs in system browser
electron_1.ipcMain.handle('open-in-browser', async (event, url) => {
    try {
        console.log('Opening URL in system browser:', url);
        await electron_1.shell.openExternal(url);
        return { success: true };
    }
    catch (error) {
        console.error('Failed to open URL in system browser:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
});
// Security: Prevent navigation to external URLs
electron_1.app.on('web-contents-created', (event, contents) => {
    contents.on('will-navigate', (event, navigationUrl) => {
        const parsedUrl = new URL(navigationUrl);
        // Allow navigation within the app or to http/https
        if (parsedUrl.protocol === 'file:' || parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') {
            return;
        }
        // Block other protocols
        event.preventDefault();
    });
    // Handle webview contents specifically
    if (contents.getType() === 'webview') {
        // Block ad requests before they load
        contents.session.webRequest.onBeforeRequest((details, callback) => {
            const url = details.url.toLowerCase();
            // Common ad and tracking domains to block
            const adDomains = [
                // Google Ads
                'doubleclick.net',
                'googlesyndication.com',
                'googleadservices.com',
                'googletagmanager.com',
                'googletagservices.com',
                'pagead2.googlesyndication.com',
                'tpc.googlesyndication.com',
                'securepubads.g.doubleclick.net',
                'www.googletagservices.com',
                'partner.googleadservices.com',
                'ads.google.com',
                'ads.youtube.com',
                // Facebook/Meta
                'facebook.com/tr',
                'facebook.net',
                'connect.facebook.net',
                'adsystem.facebook',
                'ads.facebook.com',
                // Amazon
                'amazon-adsystem.com',
                'adsystem.amazon',
                // Twitter/X
                'ads.twitter.com',
                'analytics.twitter.com',
                // LinkedIn
                'ads.linkedin.com',
                // Microsoft
                'ads.microsoft.com',
                // Adult/Porn sites
                'trafficjunky.net',
                'pornhub.com/_xa',
                'm.m.oronova.com',
                // General ad networks
                'ads.pubmatic.com',
                'adsystem.simplemachines.org',
                'cdn.adsafeprotected.com',
                'ib.adnxs.com',
                'ads.rubiconproject.com',
                'pixel.rubiconproject.com',
                'fastlane.rubiconproject.com',
                'optimized-by.rubiconproject.com',
                'eus.rubiconproject.com',
                'tap.rubiconproject.com',
                'tap2-cdn.rubiconproject.com',
                // Analytics/Tracking
                'cdn.krxd.net',
                'beacon.krxd.net',
                'ads.scorecardresearch.com',
                'b.scorecardresearch.com',
                'pixel.quantserve.com',
                'secure.quantserve.com',
                'dpm.demdex.net',
                // Additional ad networks
                'serving-sys.com',
                'bs.serving-sys.com',
                'contextweb.com',
                'adroll.com',
                'outbrain.com',
                'taboola.com',
                'criteo.com',
                'criteo.net',
                'smartadserver.com',
                'openx.net',
                'pubmatic.com',
                'thetradedesk.com',
                'media.net',
                'yieldmo.com',
                'appnexus.com',
                'spotxchange.com',
                'districtm.io',
                'sonobi.com',
                'lijit.com',
                'casalemedia.com',
                'gumgum.com',
                'sharethrough.com',
                'triplelift.com',
                'smaato.net',
                'adtechus.com',
                'advertising.com',
                'adnxs.com',
                'mathtag.com',
                'bluekai.com',
                'addthis.com',
                'quantserve.com',
                'scorecardresearch.com',
                'demdex.net',
                'everesttech.net',
                'rlcdn.com',
                'simpli.fi',
                'tidaltv.com',
                'freewheel.tv',
                'brightcove.com',
                'jwplayer.com',
                'vimeo.com',
                'dailymotion.com'
            ];
            // Check if URL contains any ad domain
            const isAdRequest = adDomains.some(domain => url.includes(domain));
            if (isAdRequest) {
                console.log('🚫 Blocked ad request:', details.url);
                callback({ cancel: true });
                return;
            }
            // Allow the request
            callback({});
        });
        // Intercept and modify headers to bypass X-Frame-Options restrictions
        contents.session.webRequest.onHeadersReceived((details, callback) => {
            const responseHeaders = { ...details.responseHeaders };
            // Remove X-Frame-Options header to allow iframe embedding
            if (responseHeaders['X-Frame-Options']) {
                delete responseHeaders['X-Frame-Options'];
            }
            // Remove Content-Security-Policy frame-ancestors restrictions
            if (responseHeaders['Content-Security-Policy']) {
                const csp = responseHeaders['Content-Security-Policy'][0];
                if (csp && csp.includes('frame-ancestors')) {
                    // Remove frame-ancestors directive from CSP
                    const newCsp = csp.replace(/frame-ancestors[^;]+;?/g, '').trim();
                    responseHeaders['Content-Security-Policy'] = [newCsp];
                }
            }
            callback({ responseHeaders });
        });
        // Handle failed loads due to CSP or other security restrictions
        contents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
            console.log('Webview failed to load:', { errorCode, errorDescription, validatedURL });
            // If it's a security-related error, try to load with relaxed security
            if (errorCode === -3 || errorDescription.includes('blocked') || errorDescription.includes('security')) {
                console.log('Attempting to reload with relaxed security settings');
                // The webview will handle this through its own error handling
            }
        });
    }
});
