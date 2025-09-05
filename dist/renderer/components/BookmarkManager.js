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
exports.BookmarkManager = void 0;
class BookmarkManager {
    constructor(onBookmarkClick) {
        this.bookmarks = [];
        this.categories = [];
        this.element = null;
        this.isVisible = false;
        this.onBookmarkClick = onBookmarkClick;
        this.loadBookmarks();
        this.loadCategories();
        this.createBookmarkPanel();
    }
    loadBookmarks() {
        try {
            const stored = localStorage.getItem('noxbox-bookmarks');
            if (stored) {
                this.bookmarks = JSON.parse(stored);
            }
        }
        catch (error) {
            console.warn('Failed to load bookmarks from localStorage:', error);
            this.bookmarks = [];
        }
    }
    saveBookmarks() {
        try {
            localStorage.setItem('noxbox-bookmarks', JSON.stringify(this.bookmarks));
        }
        catch (error) {
            console.error('Failed to save bookmarks:', error);
        }
    }
    loadCategories() {
        try {
            const stored = localStorage.getItem('noxbox-bookmark-categories');
            if (stored) {
                this.categories = JSON.parse(stored);
            }
            else {
                // Create default category
                this.categories = [{
                        id: 'default',
                        name: 'Bookmarks',
                        bookmarks: []
                    }];
            }
        }
        catch (error) {
            console.warn('Failed to load bookmark categories:', error);
            this.categories = [{
                    id: 'default',
                    name: 'Bookmarks',
                    bookmarks: []
                }];
        }
    }
    saveCategories() {
        try {
            localStorage.setItem('noxbox-bookmark-categories', JSON.stringify(this.categories));
        }
        catch (error) {
            console.error('Failed to save bookmark categories:', error);
        }
    }
    createBookmarkPanel() {
        // Create the bookmark panel element
        this.element = document.createElement('div');
        this.element.id = 'bookmark-panel';
        this.element.className = 'bookmark-panel';
        this.element.innerHTML = `
      <div class="bookmark-content">
        <header class="bookmark-header">
          <h2>Bookmarks</h2>
          <div class="bookmark-controls">
            <button id="import-bookmarks-btn" class="bookmark-btn" title="Import from Chrome">
              <span>📁</span>
            </button>
            <button id="add-bookmark-btn" class="bookmark-btn" title="Add current page">
              <span>+</span>
            </button>
            <button id="close-bookmark-btn" class="bookmark-btn" title="Close">
              <span>×</span>
            </button>
          </div>
        </header>

        <div class="bookmark-search">
          <input type="text" id="bookmark-search" placeholder="Search bookmarks..." />
        </div>

        <div class="bookmark-categories">
          <div class="category-tabs">
            <button class="category-tab active" data-category="all">All</button>
            <button class="category-tab" data-category="default">Bookmarks</button>
          </div>
          <div class="import-help">
            <details>
              <summary>How to import Chrome bookmarks</summary>
              <div class="help-content">
                <ol>
                  <li>Open Chrome and go to <code>chrome://bookmarks/</code></li>
                  <li>Click the three dots menu (⋮) in the top right</li>
                  <li>Select "Export bookmarks"</li>
                  <li>Save the file and then click the 📁 button above to import it</li>
                </ol>
                <p><strong>Alternative:</strong> Find the bookmarks file at:</p>
                <ul>
                  <li><strong>Windows:</strong> <code>%LOCALAPPDATA%\Google\Chrome\User Data\Default\Bookmarks</code></li>
                  <li><strong>macOS:</strong> <code>~/Library/Application Support/Google/Chrome/Default/Bookmarks</code></li>
                  <li><strong>Linux:</strong> <code>~/.config/google-chrome/Default/Bookmarks</code></li>
                </ul>
              </div>
            </details>
          </div>
        </div>

        <div class="bookmark-list" id="bookmark-list">
          <!-- Bookmarks will be populated here -->
        </div>
      </div>
    `;
        document.body.appendChild(this.element);
        this.setupEventListeners();
        this.renderBookmarks();
    }
    setupEventListeners() {
        if (!this.element)
            return;
        // Close button
        const closeBtn = this.element.querySelector('#close-bookmark-btn');
        closeBtn === null || closeBtn === void 0 ? void 0 : closeBtn.addEventListener('click', () => this.hide());
        // Add bookmark button
        const addBtn = this.element.querySelector('#add-bookmark-btn');
        addBtn === null || addBtn === void 0 ? void 0 : addBtn.addEventListener('click', () => this.addCurrentPage());
        // Import bookmarks button
        const importBtn = this.element.querySelector('#import-bookmarks-btn');
        importBtn === null || importBtn === void 0 ? void 0 : importBtn.addEventListener('click', () => this.importChromeBookmarks());
        // Search input
        const searchInput = this.element.querySelector('#bookmark-search');
        searchInput === null || searchInput === void 0 ? void 0 : searchInput.addEventListener('input', (e) => {
            const query = e.target.value;
            this.filterBookmarks(query);
        });
        // Category tabs
        const categoryTabs = this.element.querySelectorAll('.category-tab');
        categoryTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                this.switchCategory(category);
            });
        });
        // Click outside to close
        this.element.addEventListener('click', (e) => {
            if (e.target === this.element) {
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
    renderBookmarks(category = 'all') {
        var _a;
        const bookmarkList = (_a = this.element) === null || _a === void 0 ? void 0 : _a.querySelector('#bookmark-list');
        if (!bookmarkList)
            return;
        let bookmarksToShow = this.bookmarks;
        if (category !== 'all') {
            const categoryObj = this.categories.find(cat => cat.id === category);
            if (categoryObj) {
                bookmarksToShow = categoryObj.bookmarks;
            }
        }
        if (bookmarksToShow.length === 0) {
            bookmarkList.innerHTML = `
        <div class="no-bookmarks">
          <p>No bookmarks yet</p>
          <p>Click the + button to add the current page</p>
        </div>
      `;
            return;
        }
        bookmarkList.innerHTML = bookmarksToShow
            .sort((a, b) => b.dateAdded - a.dateAdded)
            .map(bookmark => `
        <div class="bookmark-item" data-id="${bookmark.id}">
          <div class="bookmark-info">
            <div class="bookmark-title">${this.escapeHtml(bookmark.title)}</div>
            <div class="bookmark-url">${this.escapeHtml(bookmark.url)}</div>
          </div>
          <div class="bookmark-actions">
            <button class="bookmark-action edit-btn" data-id="${bookmark.id}" title="Edit">
              <span>✎</span>
            </button>
            <button class="bookmark-action delete-btn" data-id="${bookmark.id}" title="Delete">
              <span>×</span>
            </button>
          </div>
        </div>
      `).join('');
        // Add event listeners for bookmark items
        const bookmarkItems = bookmarkList.querySelectorAll('.bookmark-item');
        bookmarkItems.forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.bookmark-actions')) {
                    const id = item.dataset.id;
                    const bookmark = this.bookmarks.find(b => b.id === id);
                    if (bookmark && this.onBookmarkClick) {
                        this.onBookmarkClick(bookmark.url);
                        this.hide();
                    }
                }
            });
        });
        // Add event listeners for action buttons
        const editBtns = bookmarkList.querySelectorAll('.edit-btn');
        editBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.dataset.id;
                this.editBookmark(id);
            });
        });
        const deleteBtns = bookmarkList.querySelectorAll('.delete-btn');
        deleteBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.dataset.id;
                this.deleteBookmark(id);
            });
        });
    }
    filterBookmarks(query) {
        var _a;
        const bookmarkItems = (_a = this.element) === null || _a === void 0 ? void 0 : _a.querySelectorAll('.bookmark-item');
        if (!bookmarkItems)
            return;
        const lowerQuery = query.toLowerCase();
        bookmarkItems.forEach(item => {
            var _a, _b, _c, _d;
            const title = ((_b = (_a = item.querySelector('.bookmark-title')) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.toLowerCase()) || '';
            const url = ((_d = (_c = item.querySelector('.bookmark-url')) === null || _c === void 0 ? void 0 : _c.textContent) === null || _d === void 0 ? void 0 : _d.toLowerCase()) || '';
            if (title.includes(lowerQuery) || url.includes(lowerQuery)) {
                item.style.display = 'flex';
            }
            else {
                item.style.display = 'none';
            }
        });
    }
    switchCategory(category) {
        var _a;
        // Update active tab
        const tabs = (_a = this.element) === null || _a === void 0 ? void 0 : _a.querySelectorAll('.category-tab');
        tabs === null || tabs === void 0 ? void 0 : tabs.forEach(tab => {
            if (tab.dataset.category === category) {
                tab.classList.add('active');
            }
            else {
                tab.classList.remove('active');
            }
        });
        this.renderBookmarks(category);
    }
    addBookmark(title, url, category = 'default') {
        const bookmark = {
            id: Date.now().toString(),
            title: title || url,
            url: url,
            dateAdded: Date.now(),
            category: category
        };
        this.bookmarks.push(bookmark);
        // Add to category
        const categoryObj = this.categories.find(cat => cat.id === category);
        if (categoryObj) {
            categoryObj.bookmarks.push(bookmark);
        }
        this.saveBookmarks();
        this.saveCategories();
        this.renderBookmarks();
    }
    addCurrentPage() {
        var _a;
        // Get current URL from the webview
        const webview = document.getElementById('browser-webview');
        if (webview) {
            const currentUrl = webview.getAttribute('src') || '';
            const currentTitle = ((_a = webview.getTitle) === null || _a === void 0 ? void 0 : _a.call(webview)) || currentUrl;
            if (currentUrl && currentUrl !== 'about:blank' && !currentUrl.startsWith('data:')) {
                this.addBookmark(currentTitle, currentUrl);
            }
        }
    }
    editBookmark(id) {
        const bookmark = this.bookmarks.find(b => b.id === id);
        if (!bookmark)
            return;
        const newTitle = prompt('Edit bookmark title:', bookmark.title);
        if (newTitle !== null && newTitle.trim() !== '') {
            bookmark.title = newTitle.trim();
            this.saveBookmarks();
            this.renderBookmarks();
        }
    }
    deleteBookmark(id) {
        if (confirm('Are you sure you want to delete this bookmark?')) {
            // Remove from main bookmarks array
            this.bookmarks = this.bookmarks.filter(b => b.id !== id);
            // Remove from categories
            this.categories.forEach(category => {
                category.bookmarks = category.bookmarks.filter(b => b.id !== id);
            });
            this.saveBookmarks();
            this.saveCategories();
            this.renderBookmarks();
        }
    }
    importChromeBookmarks() {
        // Create a hidden file input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.style.display = 'none';
        fileInput.addEventListener('change', (event) => {
            var _a;
            const file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
            if (file) {
                this.processChromeBookmarksFile(file);
            }
        });
        // Trigger file selection
        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    }
    processChromeBookmarksFile(file) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const text = yield file.text();
                const chromeBookmarks = JSON.parse(text);
                if (!this.isValidChromeBookmarks(chromeBookmarks)) {
                    alert('Invalid Chrome bookmarks file. Please select a valid Bookmarks file from Chrome.');
                    return;
                }
                const importedBookmarks = this.parseChromeBookmarks(chromeBookmarks);
                if (importedBookmarks.length === 0) {
                    alert('No bookmarks found in the selected file.');
                    return;
                }
                // Confirm import
                const confirmMessage = `Found ${importedBookmarks.length} bookmarks. Do you want to import them?`;
                if (!confirm(confirmMessage)) {
                    return;
                }
                // Add imported bookmarks
                importedBookmarks.forEach(bookmark => {
                    this.addBookmark(bookmark.title, bookmark.url, bookmark.category);
                });
                alert(`Successfully imported ${importedBookmarks.length} bookmarks!`);
                this.renderBookmarks();
            }
            catch (error) {
                console.error('Error processing Chrome bookmarks file:', error);
                alert('Error reading the bookmarks file. Please make sure it\'s a valid Chrome bookmarks file.');
            }
        });
    }
    isValidChromeBookmarks(data) {
        return data &&
            typeof data === 'object' &&
            data.roots &&
            (data.roots.bookmark_bar || data.roots.other || data.roots.synced);
    }
    parseChromeBookmarks(chromeData) {
        const bookmarks = [];
        // Process each root folder
        const roots = chromeData.roots;
        if (roots.bookmark_bar) {
            bookmarks.push(...this.parseChromeFolder(roots.bookmark_bar.children || [], 'Bookmarks Bar'));
        }
        if (roots.other) {
            bookmarks.push(...this.parseChromeFolder(roots.other.children || [], 'Other Bookmarks'));
        }
        if (roots.synced) {
            bookmarks.push(...this.parseChromeFolder(roots.synced.children || [], 'Mobile Bookmarks'));
        }
        return bookmarks;
    }
    parseChromeFolder(items, category) {
        const bookmarks = [];
        items.forEach(item => {
            if (item.type === 'url' && item.url && item.name) {
                // This is a bookmark
                const bookmark = {
                    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                    title: item.name,
                    url: item.url,
                    dateAdded: item.date_added ? Math.floor(item.date_added / 1000) : Date.now(),
                    category: category
                };
                bookmarks.push(bookmark);
            }
            else if (item.type === 'folder' && item.children) {
                // This is a folder, recursively parse its children
                const folderName = item.name || 'Unnamed Folder';
                bookmarks.push(...this.parseChromeFolder(item.children, folderName));
            }
        });
        return bookmarks;
    }
    show() {
        if (this.element) {
            this.element.classList.add('visible');
            this.isVisible = true;
            // Focus search input
            const searchInput = this.element.querySelector('#bookmark-search');
            searchInput === null || searchInput === void 0 ? void 0 : searchInput.focus();
        }
    }
    hide() {
        if (this.element) {
            this.element.classList.remove('visible');
            this.isVisible = false;
        }
    }
    toggle() {
        if (this.isVisible) {
            this.hide();
        }
        else {
            this.show();
        }
    }
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    // Public methods for external access
    getBookmarks() {
        return [...this.bookmarks];
    }
    getCategories() {
        return [...this.categories];
    }
    isBookmark(url) {
        return this.bookmarks.some(bookmark => bookmark.url === url);
    }
}
exports.BookmarkManager = BookmarkManager;
