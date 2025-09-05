import { Bookmark, BookmarkCategory } from '../../types';

export class BookmarkManager {
  private bookmarks: Bookmark[] = [];
  private categories: BookmarkCategory[] = [];
  private element: HTMLElement | null = null;
  private isVisible: boolean = false;
  private onBookmarkClick?: (url: string) => void;

  constructor(onBookmarkClick?: (url: string) => void) {
    this.onBookmarkClick = onBookmarkClick;
    this.loadBookmarks();
    this.loadCategories();
    this.createBookmarkPanel();
  }

  private loadBookmarks(): void {
    try {
      const stored = localStorage.getItem('noxbox-bookmarks');
      if (stored) {
        this.bookmarks = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load bookmarks from localStorage:', error);
      this.bookmarks = [];
    }
  }

  private saveBookmarks(): void {
    try {
      localStorage.setItem('noxbox-bookmarks', JSON.stringify(this.bookmarks));
    } catch (error) {
      console.error('Failed to save bookmarks:', error);
    }
  }

  private loadCategories(): void {
    try {
      const stored = localStorage.getItem('noxbox-bookmark-categories');
      if (stored) {
        this.categories = JSON.parse(stored);
      } else {
        // Create default category
        this.categories = [{
          id: 'default',
          name: 'Bookmarks',
          bookmarks: []
        }];
      }
    } catch (error) {
      console.warn('Failed to load bookmark categories:', error);
      this.categories = [{
        id: 'default',
        name: 'Bookmarks',
        bookmarks: []
      }];
    }
  }

  private saveCategories(): void {
    try {
      localStorage.setItem('noxbox-bookmark-categories', JSON.stringify(this.categories));
    } catch (error) {
      console.error('Failed to save bookmark categories:', error);
    }
  }

  private createBookmarkPanel(): void {
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

  private setupEventListeners(): void {
    if (!this.element) return;

    // Close button
    const closeBtn = this.element.querySelector('#close-bookmark-btn');
    closeBtn?.addEventListener('click', () => this.hide());

    // Add bookmark button
    const addBtn = this.element.querySelector('#add-bookmark-btn');
    addBtn?.addEventListener('click', () => this.addCurrentPage());

    // Import bookmarks button
    const importBtn = this.element.querySelector('#import-bookmarks-btn');
    importBtn?.addEventListener('click', () => this.importChromeBookmarks());

    // Search input
    const searchInput = this.element.querySelector('#bookmark-search') as HTMLInputElement;
    searchInput?.addEventListener('input', (e) => {
      const query = (e.target as HTMLInputElement).value;
      this.filterBookmarks(query);
    });

    // Category tabs
    const categoryTabs = this.element.querySelectorAll('.category-tab');
    categoryTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        const category = (e.target as HTMLElement).dataset.category!;
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

  private renderBookmarks(category: string = 'all'): void {
    const bookmarkList = this.element?.querySelector('#bookmark-list');
    if (!bookmarkList) return;

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
        if (!(e.target as HTMLElement).closest('.bookmark-actions')) {
          const id = (item as HTMLElement).dataset.id!;
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
        const id = (btn as HTMLElement).dataset.id!;
        this.editBookmark(id);
      });
    });

    const deleteBtns = bookmarkList.querySelectorAll('.delete-btn');
    deleteBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = (btn as HTMLElement).dataset.id!;
        this.deleteBookmark(id);
      });
    });
  }

  private filterBookmarks(query: string): void {
    const bookmarkItems = this.element?.querySelectorAll('.bookmark-item');
    if (!bookmarkItems) return;

    const lowerQuery = query.toLowerCase();

    bookmarkItems.forEach(item => {
      const title = item.querySelector('.bookmark-title')?.textContent?.toLowerCase() || '';
      const url = item.querySelector('.bookmark-url')?.textContent?.toLowerCase() || '';

      if (title.includes(lowerQuery) || url.includes(lowerQuery)) {
        (item as HTMLElement).style.display = 'flex';
      } else {
        (item as HTMLElement).style.display = 'none';
      }
    });
  }

  private switchCategory(category: string): void {
    // Update active tab
    const tabs = this.element?.querySelectorAll('.category-tab');
    tabs?.forEach(tab => {
      if ((tab as HTMLElement).dataset.category === category) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    this.renderBookmarks(category);
  }

  addBookmark(title: string, url: string, category: string = 'default'): void {
    const bookmark: Bookmark = {
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

  private addCurrentPage(): void {
    // Get current URL from the webview
    const webview = document.getElementById('browser-webview') as any;
    if (webview) {
      const currentUrl = webview.getAttribute('src') || '';
      const currentTitle = webview.getTitle?.() || currentUrl;

      if (currentUrl && currentUrl !== 'about:blank' && !currentUrl.startsWith('data:')) {
        this.addBookmark(currentTitle, currentUrl);
      }
    }
  }

  private editBookmark(id: string): void {
    const bookmark = this.bookmarks.find(b => b.id === id);
    if (!bookmark) return;

    const newTitle = prompt('Edit bookmark title:', bookmark.title);
    if (newTitle !== null && newTitle.trim() !== '') {
      bookmark.title = newTitle.trim();
      this.saveBookmarks();
      this.renderBookmarks();
    }
  }

  private deleteBookmark(id: string): void {
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

  private importChromeBookmarks(): void {
    // Create a hidden file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.style.display = 'none';

    fileInput.addEventListener('change', (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        this.processChromeBookmarksFile(file);
      }
    });

    // Trigger file selection
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  }

  private async processChromeBookmarksFile(file: File): Promise<void> {
    try {
      const text = await file.text();
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

    } catch (error) {
      console.error('Error processing Chrome bookmarks file:', error);
      alert('Error reading the bookmarks file. Please make sure it\'s a valid Chrome bookmarks file.');
    }
  }

  private isValidChromeBookmarks(data: any): boolean {
    return data &&
           typeof data === 'object' &&
           data.roots &&
           (data.roots.bookmark_bar || data.roots.other || data.roots.synced);
  }

  private parseChromeBookmarks(chromeData: any): Bookmark[] {
    const bookmarks: Bookmark[] = [];

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

  private parseChromeFolder(items: any[], category: string): Bookmark[] {
    const bookmarks: Bookmark[] = [];

    items.forEach(item => {
      if (item.type === 'url' && item.url && item.name) {
        // This is a bookmark
        const bookmark: Bookmark = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          title: item.name,
          url: item.url,
          dateAdded: item.date_added ? Math.floor(item.date_added / 1000) : Date.now(),
          category: category
        };
        bookmarks.push(bookmark);
      } else if (item.type === 'folder' && item.children) {
        // This is a folder, recursively parse its children
        const folderName = item.name || 'Unnamed Folder';
        bookmarks.push(...this.parseChromeFolder(item.children, folderName));
      }
    });

    return bookmarks;
  }

  show(): void {
    if (this.element) {
      this.element.classList.add('visible');
      this.isVisible = true;

      // Focus search input
      const searchInput = this.element.querySelector('#bookmark-search') as HTMLInputElement;
      searchInput?.focus();
    }
  }

  hide(): void {
    if (this.element) {
      this.element.classList.remove('visible');
      this.isVisible = false;
    }
  }

  toggle(): void {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Public methods for external access
  getBookmarks(): Bookmark[] {
    return [...this.bookmarks];
  }

  getCategories(): BookmarkCategory[] {
    return [...this.categories];
  }

  isBookmark(url: string): boolean {
    return this.bookmarks.some(bookmark => bookmark.url === url);
  }
}