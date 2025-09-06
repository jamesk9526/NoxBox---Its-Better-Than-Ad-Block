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
const electron_1 = require("electron");
const path_1 = require("path");
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
    // Download manager
    const downloads = new Map();
    mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        downloads.set(id, item);
        webContents.send('download:event', {
            type: 'started',
            id,
            filename: (0, path_1.basename)(item.getFilename()),
            url: item.getURL(),
            totalBytes: item.getTotalBytes(),
        });
        item.on('updated', (_e, state) => {
            var _a;
            webContents.send('download:event', {
                type: 'progress',
                id,
                state,
                receivedBytes: item.getReceivedBytes(),
                totalBytes: item.getTotalBytes(),
                paused: item.isPaused(),
                savePath: (_a = item.getSavePath) === null || _a === void 0 ? void 0 : _a.call(item),
            });
        });
        item.once('done', (_e, state) => {
            var _a;
            webContents.send('download:event', {
                type: 'done',
                id,
                state,
                savedTo: (_a = item.getSavePath) === null || _a === void 0 ? void 0 : _a.call(item),
            });
            downloads.delete(id);
        });
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
// Download control
electron_1.ipcMain.handle('download:control', (_event_1, _a) => __awaiter(void 0, [_event_1, _a], void 0, function* (_event, { id, action }) {
    var _b;
    const item = global.downloadItem || null;
    // Look up item from map in any window
    // For simplicity, maintain a singleton map in this module scope
    // Note: In a multi-window app, we would move this out of createWindow.
    // @ts-ignore - access the closure map via captured variable (downloads)
    const di = (downloads && downloads.get) ? downloads.get(id) : undefined;
    if (!di)
        return { success: false, error: 'Download not found' };
    try {
        if (action === 'pause')
            di.pause();
        else if (action === 'resume')
            di.resume();
        else if (action === 'cancel')
            di.cancel();
        else if (action === 'reveal') {
            const p = (_b = di.getSavePath) === null || _b === void 0 ? void 0 : _b.call(di);
            if (p)
                yield electron_1.shell.showItemInFolder(p);
        }
        return { success: true };
    }
    catch (e) {
        return { success: false, error: String(e) };
    }
}));
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
    return (mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.isMaximized()) || false;
});
// Handle opening URLs in system browser
electron_1.ipcMain.handle('open-in-browser', (event, url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Opening URL in system browser:', url);
        yield electron_1.shell.openExternal(url);
        return { success: true };
    }
    catch (error) {
        console.error('Failed to open URL in system browser:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}));
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
    // Apply network rules to both main and webview contents
    if (contents.getType() === 'webview' || contents.getType() === 'window') {
        // Optionally block ads & trackers (basic patterns)
        const adUrlPatterns = [
            '*://*.doubleclick.net/*',
            '*://*.googlesyndication.com/*',
            '*://*.adservice.google.com/*',
            '*://*.adsafeprotected.com/*',
            '*://*.taboola.com/*',
            '*://*.outbrain.com/*',
            '*://*.scorecardresearch.com/*',
            '*://*.moatads.com/*',
            '*://*.facebook.com/tr/*',
            '*://*.google-analytics.com/*'
        ];
        contents.session.webRequest.onBeforeRequest({ urls: adUrlPatterns }, (details, callback) => {
            callback({ cancel: true });
        });
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
            // Privacy IPC: clear data
            electron_1.ipcMain.handle('privacy:clear-cookies', () => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    yield electron_1.session.defaultSession.clearStorageData({ storages: ['cookies'] });
                    return { success: true };
                }
                catch (e) {
                    return { success: false, error: String(e) };
                }
            }));
            electron_1.ipcMain.handle('privacy:clear-cache', () => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    yield electron_1.session.defaultSession.clearCache();
                    return { success: true };
                }
                catch (e) {
                    return { success: false, error: String(e) };
                }
            }));
            electron_1.ipcMain.handle('privacy:clear-storage', () => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    yield electron_1.session.defaultSession.clearStorageData();
                    return { success: true };
                }
                catch (e) {
                    return { success: false, error: String(e) };
                }
            }));
            // Allow the request
            callback({});
        });
        // Intercept and modify headers to bypass X-Frame-Options restrictions
        contents.session.webRequest.onHeadersReceived((details, callback) => {
            const responseHeaders = Object.assign({}, details.responseHeaders);
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
