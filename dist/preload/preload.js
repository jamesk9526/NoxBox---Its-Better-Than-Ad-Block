"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
electron_1.contextBridge.exposeInMainWorld('appApi', {
    // Window controls
    minimizeWindow: () => electron_1.ipcRenderer.invoke('window:minimize'),
    maximizeWindow: () => electron_1.ipcRenderer.invoke('window:maximize'),
    unmaximizeWindow: () => electron_1.ipcRenderer.invoke('window:unmaximize'),
    closeWindow: () => electron_1.ipcRenderer.invoke('window:close'),
    isWindowMaximized: () => electron_1.ipcRenderer.invoke('window:isMaximized'),
    // Settings
    getSettings: () => electron_1.ipcRenderer.invoke('settings:get'),
    updateSettings: (settings) => electron_1.ipcRenderer.invoke('settings:update', settings),
    // Navigation (for future webview implementation)
    navigateTo: (url) => electron_1.ipcRenderer.invoke('navigation:navigate', url),
    // Open URL in system browser
    openInBrowser: (url) => electron_1.ipcRenderer.invoke('open-in-browser', url),
    // Privacy / Cookie management
    clearCookies: () => electron_1.ipcRenderer.invoke('privacy:clear-cookies'),
    clearCache: () => electron_1.ipcRenderer.invoke('privacy:clear-cache'),
    clearStorage: () => electron_1.ipcRenderer.invoke('privacy:clear-storage'),
    // Download manager API
    onDownloadEvent: (listener) => {
        const handler = (_, data) => listener(_, data);
        electron_1.ipcRenderer.on('download:event', handler);
        return () => electron_1.ipcRenderer.removeListener('download:event', handler);
    },
    downloadControl: (id, action) => electron_1.ipcRenderer.invoke('download:control', { id, action }),
    // Version info
    getVersions: () => ({
        node: process.versions.node,
        chrome: process.versions.chrome,
        electron: process.versions.electron,
    }),
});
