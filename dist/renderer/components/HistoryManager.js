"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryManager = void 0;
class HistoryManager {
    constructor() {
        this.history = [];
        this.STORAGE_KEY = 'noxbox_history';
        this.MAX_ENTRIES = 10000;
        this.CLEANUP_THRESHOLD = 12000;
        this.loadHistory();
    }
    static getInstance() {
        if (!HistoryManager.instance) {
            HistoryManager.instance = new HistoryManager();
        }
        return HistoryManager.instance;
    }
    /**
     * Add a new history entry or update existing one
     */
    addEntry(url, title, favicon, visitDuration) {
        if (!url || url === 'about:blank' || url.startsWith('data:')) {
            return;
        }
        const now = Date.now();
        const existingIndex = this.history.findIndex(entry => entry.url === url);
        if (existingIndex >= 0) {
            // Update existing entry
            const entry = this.history[existingIndex];
            entry.title = title || entry.title;
            entry.favicon = favicon || entry.favicon;
            entry.visitCount++;
            entry.lastVisited = now;
            if (visitDuration !== undefined) {
                entry.visitDuration = visitDuration;
            }
        }
        else {
            // Create new entry
            const newEntry = {
                id: this.generateId(),
                title: title || url,
                url,
                favicon,
                visitCount: 1,
                lastVisited: now,
                firstVisited: now,
                visitDuration
            };
            this.history.unshift(newEntry); // Add to beginning for chronological order
        }
        this.cleanupIfNeeded();
        this.saveHistory();
    }
    /**
     * Remove a history entry by ID
     */
    removeEntry(id) {
        const index = this.history.findIndex(entry => entry.id === id);
        if (index >= 0) {
            this.history.splice(index, 1);
            this.saveHistory();
            return true;
        }
        return false;
    }
    /**
     * Remove multiple entries by IDs
     */
    removeEntries(ids) {
        let removedCount = 0;
        ids.forEach(id => {
            if (this.removeEntry(id)) {
                removedCount++;
            }
        });
        return removedCount;
    }
    /**
     * Clear all history
     */
    clearAll() {
        this.history = [];
        this.saveHistory();
    }
    /**
     * Search and filter history entries
     */
    search(options = {}) {
        let results = [...this.history];
        // Apply date filters
        if (options.startDate) {
            results = results.filter(entry => entry.lastVisited >= options.startDate);
        }
        if (options.endDate) {
            results = results.filter(entry => entry.lastVisited <= options.endDate);
        }
        // Apply text search
        if (options.query) {
            const query = options.query.toLowerCase();
            results = results.filter(entry => entry.title.toLowerCase().includes(query) ||
                entry.url.toLowerCase().includes(query));
        }
        // Apply pagination
        if (options.offset) {
            results = results.slice(options.offset);
        }
        if (options.limit) {
            results = results.slice(0, options.limit);
        }
        return results;
    }
    /**
     * Get history entries grouped by date
     */
    getGroupedByDate(limit = 50) {
        const recentEntries = this.history.slice(0, limit);
        const grouped = {};
        recentEntries.forEach(entry => {
            const date = new Date(entry.lastVisited).toDateString();
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(entry);
        });
        return grouped;
    }
    /**
     * Get most visited entries
     */
    getMostVisited(limit = 10) {
        return [...this.history]
            .sort((a, b) => b.visitCount - a.visitCount)
            .slice(0, limit);
    }
    /**
     * Get recently visited entries
     */
    getRecent(limit = 50) {
        return this.history.slice(0, limit);
    }
    /**
     * Get history statistics
     */
    getStats() {
        if (this.history.length === 0) {
            return {
                totalEntries: 0,
                totalVisits: 0
            };
        }
        const totalVisits = this.history.reduce((sum, entry) => sum + entry.visitCount, 0);
        const mostVisited = this.history.reduce((max, entry) => entry.visitCount > ((max === null || max === void 0 ? void 0 : max.visitCount) || 0) ? entry : max);
        return {
            totalEntries: this.history.length,
            totalVisits,
            oldestEntry: Math.min(...this.history.map(entry => entry.firstVisited)),
            newestEntry: Math.max(...this.history.map(entry => entry.lastVisited)),
            mostVisited
        };
    }
    /**
     * Export history data
     */
    exportData() {
        return JSON.stringify({
            version: '1.0',
            exportDate: Date.now(),
            entries: this.history
        }, null, 2);
    }
    /**
     * Import history data
     */
    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            if (data.entries && Array.isArray(data.entries)) {
                const validEntries = data.entries.filter((entry) => entry.id && entry.url && entry.title && entry.lastVisited);
                this.history = [...validEntries, ...this.history];
                this.cleanupIfNeeded();
                this.saveHistory();
                return true;
            }
        }
        catch (error) {
            console.error('Failed to import history data:', error);
        }
        return false;
    }
    /**
     * Get all history entries (for internal use)
     */
    getAllEntries() {
        return [...this.history];
    }
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    cleanupIfNeeded() {
        if (this.history.length > this.CLEANUP_THRESHOLD) {
            // Keep only the most recent entries and most visited ones
            const recentEntries = this.history.slice(0, this.MAX_ENTRIES / 2);
            const mostVisited = this.history
                .slice(this.MAX_ENTRIES / 2)
                .sort((a, b) => b.visitCount - a.visitCount)
                .slice(0, this.MAX_ENTRIES / 2);
            this.history = [...recentEntries, ...mostVisited];
        }
    }
    loadHistory() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    this.history = parsed.map(entry => (Object.assign(Object.assign({}, entry), { 
                        // Ensure all required fields exist
                        visitCount: entry.visitCount || 1, firstVisited: entry.firstVisited || entry.lastVisited || Date.now(), lastVisited: entry.lastVisited || Date.now() })));
                }
            }
        }
        catch (error) {
            console.warn('Failed to load history from localStorage:', error);
            this.history = [];
        }
    }
    saveHistory() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.history));
        }
        catch (error) {
            console.warn('Failed to save history to localStorage:', error);
        }
    }
}
exports.HistoryManager = HistoryManager;
