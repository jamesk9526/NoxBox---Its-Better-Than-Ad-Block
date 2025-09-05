"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryPanel = void 0;
class HistoryPanel {
    constructor(historyManager) {
        this.isVisible = false;
        this.historyManager = historyManager;
        this.element = document.getElementById('history-panel');
        // Debug: Check if element exists
        if (!this.element) {
            console.error('HistoryPanel: history-panel element not found in DOM');
            return;
        }
        // Ensure the panel starts hidden
        this.element.classList.remove('visible');
        this.isVisible = false;
        console.log('HistoryPanel: Initialized successfully');
        this.setupEventListeners();
        this.render();
    }
    setupEventListeners() {
        // Close button
        const closeBtn = document.getElementById('close-history-btn');
        closeBtn === null || closeBtn === void 0 ? void 0 : closeBtn.addEventListener('click', () => this.hide());
        // Search functionality
        const searchInput = document.getElementById('history-search');
        const clearSearchBtn = document.getElementById('clear-search-btn');
        searchInput === null || searchInput === void 0 ? void 0 : searchInput.addEventListener('input', (e) => {
            const query = e.target.value;
            this.filterHistory(query);
        });
        clearSearchBtn === null || clearSearchBtn === void 0 ? void 0 : clearSearchBtn.addEventListener('click', () => {
            if (searchInput) {
                searchInput.value = '';
                this.filterHistory('');
            }
        });
        // Filter functionality
        const filterSelect = document.getElementById('history-filter');
        filterSelect === null || filterSelect === void 0 ? void 0 : filterSelect.addEventListener('change', (e) => {
            const filter = e.target.value;
            this.applyFilter(filter);
        });
        // Clear all history
        const clearBtn = document.getElementById('clear-history-btn');
        clearBtn === null || clearBtn === void 0 ? void 0 : clearBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all browsing history?')) {
                this.clearAllHistory();
            }
        });
        // Click outside to close
        document.addEventListener('click', (e) => {
            if (this.isVisible && !this.element.contains(e.target) &&
                !e.target.closest('#history-btn')) {
                this.hide();
            }
        });
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.hide();
            }
        });
    }
    show() {
        console.log('HistoryPanel: show() called');
        if (!this.element) {
            console.error('HistoryPanel: Cannot show - element not found');
            return;
        }
        this.element.classList.add('visible');
        this.isVisible = true;
        this.render();
        console.log('HistoryPanel: Panel should now be visible');
    }
    hide() {
        console.log('HistoryPanel: hide() called');
        if (!this.element) {
            console.error('HistoryPanel: Cannot hide - element not found');
            return;
        }
        this.element.classList.remove('visible');
        this.isVisible = false;
        console.log('HistoryPanel: Panel should now be hidden');
    }
    toggle() {
        console.log('HistoryPanel: toggle() called, current visibility:', this.isVisible);
        if (this.isVisible) {
            this.hide();
        }
        else {
            this.show();
        }
    }
    render() {
        this.updateStats();
        this.renderHistoryList();
    }
    updateStats() {
        const stats = this.historyManager.getStats();
        const totalVisitsEl = document.getElementById('total-visits');
        const totalPagesEl = document.getElementById('total-pages');
        if (totalVisitsEl) {
            totalVisitsEl.textContent = stats.totalVisits.toLocaleString();
        }
        if (totalPagesEl) {
            totalPagesEl.textContent = stats.totalEntries.toLocaleString();
        }
    }
    renderHistoryList(entries) {
        const historyList = document.getElementById('history-list');
        if (!historyList)
            return;
        const entriesToRender = entries || this.historyManager.getRecent(100);
        const groupedEntries = this.groupByDate(entriesToRender);
        historyList.innerHTML = '';
        if (Object.keys(groupedEntries).length === 0) {
            historyList.innerHTML = `
        <div class="no-history">
          <p>No browsing history found</p>
        </div>
      `;
            return;
        }
        // Sort dates in descending order (newest first)
        const sortedDates = Object.keys(groupedEntries).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
        sortedDates.forEach(date => {
            const dateGroup = document.createElement('div');
            dateGroup.className = 'history-date-group';
            const dateHeader = document.createElement('h3');
            dateHeader.className = 'history-date-header';
            dateHeader.textContent = this.formatDate(date);
            dateGroup.appendChild(dateHeader);
            groupedEntries[date].forEach(entry => {
                const entryEl = this.createHistoryEntryElement(entry);
                dateGroup.appendChild(entryEl);
            });
            historyList.appendChild(dateGroup);
        });
    }
    createHistoryEntryElement(entry) {
        const entryEl = document.createElement('div');
        entryEl.className = 'history-entry';
        entryEl.setAttribute('data-id', entry.id);
        entryEl.innerHTML = `
      <div class="history-entry-content">
        <div class="history-entry-title">${this.escapeHtml(entry.title)}</div>
        <div class="history-entry-url">${this.escapeHtml(entry.url)}</div>
        <div class="history-entry-meta">
          <span class="history-entry-time">${this.formatTime(entry.lastVisited)}</span>
          ${entry.visitCount > 1 ? `<span class="history-entry-visits">${entry.visitCount} visits</span>` : ''}
        </div>
      </div>
      <button class="history-entry-delete" aria-label="Delete history entry">
        <span>×</span>
      </button>
    `;
        // Click to navigate
        entryEl.addEventListener('click', (e) => {
            if (!e.target.closest('.history-entry-delete')) {
                this.navigateToEntry(entry.url);
            }
        });
        // Delete button
        const deleteBtn = entryEl.querySelector('.history-entry-delete');
        deleteBtn === null || deleteBtn === void 0 ? void 0 : deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.deleteEntry(entry.id);
        });
        return entryEl;
    }
    groupByDate(entries) {
        const grouped = {};
        entries.forEach(entry => {
            const date = new Date(entry.lastVisited).toDateString();
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(entry);
        });
        return grouped;
    }
    formatDate(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        }
        else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        }
        else {
            return date.toLocaleDateString();
        }
    }
    formatTime(timestamp) {
        return new Date(timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    filterHistory(query) {
        if (!query.trim()) {
            this.renderHistoryList();
            return;
        }
        const filteredEntries = this.historyManager.search({ query });
        this.renderHistoryList(filteredEntries);
    }
    applyFilter(filter) {
        let entries;
        switch (filter) {
            case 'today':
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                entries = this.historyManager.search({
                    startDate: today.getTime()
                });
                break;
            case 'week':
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                entries = this.historyManager.search({
                    startDate: weekAgo.getTime()
                });
                break;
            case 'month':
                const monthAgo = new Date();
                monthAgo.setMonth(monthAgo.getMonth() - 1);
                entries = this.historyManager.search({
                    startDate: monthAgo.getTime()
                });
                break;
            default:
                entries = this.historyManager.getRecent(100);
        }
        this.renderHistoryList(entries);
    }
    navigateToEntry(url) {
        // Dispatch custom event to notify the main app
        const navigateEvent = new CustomEvent('navigate-to-history', {
            detail: { url }
        });
        window.dispatchEvent(navigateEvent);
        this.hide();
    }
    deleteEntry(id) {
        if (this.historyManager.removeEntry(id)) {
            this.render();
        }
    }
    clearAllHistory() {
        this.historyManager.clearAll();
        this.render();
    }
}
exports.HistoryPanel = HistoryPanel;
