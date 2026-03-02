import { SearchEngineManager } from './SearchEngineManager.js';
import { AppSettings, SearchEngine } from '../../types/index.js';

export class HomePage {
  private element: HTMLElement;
  private searchEngineManager: SearchEngineManager;
  private settings: AppSettings;
  private onSearchCallback?: (query: string, searchEngine: string) => void;
  private onNavigateCallback?: (url: string) => void;

  constructor(settings: AppSettings) {
    this.settings = settings;
    this.searchEngineManager = SearchEngineManager.getInstance();
    this.element = this.createElement();
    this.setupEventListeners();
  }

  private createElement(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'home-page';
    container.innerHTML = this.generateHTML();
    return container;
  }

  private generateHTML(): string {
    const searchEngines = this.searchEngineManager.getAllSearchEngines().filter(e => e.id !== 'custom');
    const currentEngine = this.searchEngineManager.getSearchEngine(this.settings.searchEngine) || 
                         this.searchEngineManager.getDefaultSearchEngine();

    return `
      <div class="home-container">
        <div class="home-header">
          <div class="logo-section">
            <h1 class="app-title">
              <span class="nox">Nox</span><span class="box">Box</span>
            </h1>
            <p class="app-subtitle">Private Browser with Advanced Features</p>
          </div>
        </div>

        <div class="search-section">
          <div class="search-engine-selector">
            <label for="engine-select">Search with:</label>
            <select id="engine-select" class="engine-select">
              ${searchEngines.map(engine => 
                `<option value="${engine.id}" ${engine.id === currentEngine.id ? 'selected' : ''}>
                  ${engine.icon} ${engine.name}
                </option>`
              ).join('')}
            </select>
          </div>

          <div class="search-container">
            <input 
              type="text" 
              id="home-search-input" 
              class="search-input" 
              placeholder="Search the web or enter a URL..."
              autocomplete="off"
              spellcheck="false"
            >
            <button id="search-btn" class="search-btn" type="button">
              <span class="search-icon">🔍</span>
            </button>
          </div>
        </div>

        <div class="family-resources">
          <h3>Free Family Resources</h3>
          <div class="resources-grid">
            <div class="resource-section">
              <h4>🎮 Kid-Friendly Games</h4>
              <div class="resource-links">
                <a href="https://www.abcya.com" class="resource-link" data-url="https://www.abcya.com">
                  <span class="resource-icon">🎯</span>
                  <span class="resource-name">ABCya Games</span>
                  <span class="resource-desc">Educational games for K-5</span>
                </a>
                <a href="https://www.coolmathgames.com" class="resource-link" data-url="https://www.coolmathgames.com">
                  <span class="resource-icon">🧮</span>
                  <span class="resource-name">Cool Math Games</span>
                  <span class="resource-desc">Fun math and logic games</span>
                </a>
                <a href="https://www.funbrain.com" class="resource-link" data-url="https://www.funbrain.com">
                  <span class="resource-icon">🧠</span>
                  <span class="resource-name">Funbrain</span>
                  <span class="resource-desc">Educational games & books</span>
                </a>
              </div>
            </div>

            <div class="resource-section">
              <h4>📚 Homeschool Materials</h4>
              <div class="resource-links">
                <a href="https://www.khanacademy.org" class="resource-link" data-url="https://www.khanacademy.org">
                  <span class="resource-icon">🎓</span>
                  <span class="resource-name">Khan Academy</span>
                  <span class="resource-desc">Free courses for all ages</span>
                </a>
                <a href="https://www.ixl.com/math/practice" class="resource-link" data-url="https://www.ixl.com/math/practice">
                  <span class="resource-icon">�</span>
                  <span class="resource-name">IXL Practice</span>
                  <span class="resource-desc">Math & language practice</span>
                </a>
                <a href="https://www.education.com/worksheets" class="resource-link" data-url="https://www.education.com/worksheets">
                  <span class="resource-icon">📝</span>
                  <span class="resource-name">Education.com</span>
                  <span class="resource-desc">Free printable worksheets</span>
                </a>
              </div>
            </div>

            <div class="resource-section">
              <h4>🌟 Suggested Resources</h4>
              <div class="resource-links">
                <a href="https://www.duolingo.com" class="resource-link" data-url="https://www.duolingo.com">
                  <span class="resource-icon">�</span>
                  <span class="resource-name">Duolingo</span>
                  <span class="resource-desc">Learn languages for free</span>
                </a>
                <a href="https://www.scratch.mit.edu" class="resource-link" data-url="https://www.scratch.mit.edu">
                  <span class="resource-icon">💻</span>
                  <span class="resource-name">Scratch</span>
                  <span class="resource-desc">Learn coding with blocks</span>
                </a>
                <a href="https://www.nasa.gov/audience/forkids" class="resource-link" data-url="https://www.nasa.gov/audience/forkids">
                  <span class="resource-icon">🚀</span>
                  <span class="resource-name">NASA Kids</span>
                  <span class="resource-desc">Space exploration for kids</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="footer">
          <p>&copy; 2024 NoxBox - Built with Electron</p>
        </div>
      </div>

      <style>
        .home-page {
          min-height: 100vh;
          background: linear-gradient(135deg, 
            var(--gradient-start, #1a1a2e) 0%, 
            var(--gradient-middle, #16213e) 50%, 
            var(--gradient-end, #0f0f23) 100%);
          color: var(--text-color, #ffffff);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          overflow-y: auto;
          padding: 0;
          margin: 0;
        }

        .home-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 3rem;
          min-height: 100vh;
        }

        .home-header {
          text-align: center;
          margin-top: 2rem;
        }

        .app-title {
          font-size: 3.5rem;
          font-weight: 700;
          margin: 0;
          background: linear-gradient(45deg, #9333ea, #c084fc, #e879f9);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 0 30px rgba(147, 51, 234, 0.3);
        }

        .nox {
          color: #9333ea;
        }

        .box {
          color: #c084fc;
        }

        .app-subtitle {
          font-size: 1.2rem;
          color: var(--text-secondary, #b0b0b0);
          margin: 0.5rem 0 0 0;
        }

        .search-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .search-engine-selector {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-secondary, #b0b0b0);
        }

        .engine-select {
          background: var(--input-bg, rgba(255, 255, 255, 0.1));
          border: 1px solid var(--border-color, rgba(255, 255, 255, 0.2));
          border-radius: 8px;
          color: var(--text-color, #ffffff);
          padding: 0.5rem;
          font-size: 0.9rem;
        }

        .engine-select option {
          background: var(--bg-secondary, #2a2a4a);
          color: var(--text-color, #ffffff);
        }

        .search-container {
          display: flex;
          width: 100%;
          max-width: 600px;
          background: var(--input-bg, rgba(255, 255, 255, 0.1));
          border: 2px solid transparent;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .search-container:focus-within {
          border-color: var(--accent-color, #9333ea);
          box-shadow: 0 0 20px rgba(147, 51, 234, 0.3);
        }

        .search-input {
          flex: 1;
          border: none;
          background: transparent;
          color: var(--text-color, #ffffff);
          font-size: 1.1rem;
          padding: 1rem 1.5rem;
          outline: none;
        }

        .search-input::placeholder {
          color: var(--text-secondary, #b0b0b0);
        }

        .search-btn {
          background: var(--accent-color, #9333ea);
          border: none;
          color: white;
          padding: 1rem 1.5rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
          font-size: 1.1rem;
        }

        .search-btn:hover {
          background: var(--accent-hover, #7c3aed);
        }

        .family-resources {
          text-align: center;
        }

        .family-resources h3 {
          color: var(--text-color, #ffffff);
          margin-bottom: 2rem;
          font-size: 1.8rem;
          background: linear-gradient(45deg, #9333ea, #c084fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .resources-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .resource-section {
          background: var(--card-bg, rgba(255, 255, 255, 0.05));
          border: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
          border-radius: 16px;
          padding: 1.5rem;
          backdrop-filter: blur(10px);
        }

        .resource-section h4 {
          color: var(--text-color, #ffffff);
          margin: 0 0 1.5rem 0;
          font-size: 1.2rem;
          text-align: left;
          border-bottom: 2px solid var(--accent-color, #9333ea);
          padding-bottom: 0.5rem;
        }

        .resource-links {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .resource-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: var(--card-bg, rgba(255, 255, 255, 0.1));
          border: 1px solid var(--border-color, rgba(255, 255, 255, 0.2));
          border-radius: 10px;
          text-decoration: none;
          color: var(--text-color, #ffffff);
          transition: all 0.3s ease;
          text-align: left;
        }

        .resource-link:hover {
          background: var(--card-hover, rgba(255, 255, 255, 0.2));
          transform: translateX(5px);
          border-color: var(--accent-color, #9333ea);
          box-shadow: 0 4px 15px rgba(147, 51, 234, 0.2);
        }

        .resource-icon {
          font-size: 1.5rem;
          min-width: 2rem;
          text-align: center;
        }

        .resource-name {
          font-weight: 600;
          font-size: 1rem;
          color: var(--text-color, #ffffff);
          min-width: 120px;
        }

        .resource-desc {
          font-size: 0.85rem;
          color: var(--text-secondary, #b0b0b0);
          flex: 1;
        }

        .footer {
          text-align: center;
          margin-top: auto;
          padding-top: 2rem;
          color: var(--text-secondary, #b0b0b0);
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .home-container {
            padding: 1rem;
            gap: 2rem;
          }

          .app-title {
            font-size: 2.5rem;
          }

          .search-container {
            max-width: 100%;
          }

          .resources-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .resource-section {
            padding: 1rem;
          }

          .resource-link {
            flex-direction: column;
            text-align: center;
            gap: 0.5rem;
          }

          .resource-name {
            min-width: auto;
          }
        }
      </style>
    `;
  }

  private setupEventListeners(): void {
    const searchInput = this.element.querySelector('#home-search-input') as HTMLInputElement;
    const searchBtn = this.element.querySelector('#search-btn') as HTMLButtonElement;
    const engineSelect = this.element.querySelector('#engine-select') as HTMLSelectElement;

    // Search input events
    if (searchInput) {
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.handleSearch();
        }
      });

      // Auto-focus on load
      setTimeout(() => searchInput.focus(), 100);
    }

    // Search button
    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        this.handleSearch();
      });
    }

    // Search engine selector
    if (engineSelect) {
      engineSelect.addEventListener('change', () => {
        this.settings.searchEngine = engineSelect.value;
        // Trigger settings update
        this.dispatchSettingsUpdate();
      });
    }

    // Resource links
    const resourceLinks = this.element.querySelectorAll('.resource-link');
    resourceLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const url = (link as HTMLElement).dataset.url;
        if (url && this.onNavigateCallback) {
          this.onNavigateCallback(url);
        }
      });
    });
  }

  private handleSearch(): void {
    const searchInput = this.element.querySelector('#home-search-input') as HTMLInputElement;
    const engineSelect = this.element.querySelector('#engine-select') as HTMLSelectElement;
    
    if (!searchInput) return;

    const query = searchInput.value.trim();
    if (!query) return;

    const selectedEngine = engineSelect?.value || this.settings.searchEngine;

    // Check if it's a URL or search query
    if (this.searchEngineManager.isValidUrl(query) || !this.searchEngineManager.shouldTreatAsSearch(query)) {
      // Navigate directly to URL
      let url = query;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      if (this.onNavigateCallback) {
        this.onNavigateCallback(url);
      }
    } else {
      // Perform search
      if (this.onSearchCallback) {
        this.onSearchCallback(query, selectedEngine);
      }
    }

    // Clear the search input
    searchInput.value = '';
  }

  private dispatchSettingsUpdate(): void {
    const event = new CustomEvent('settings-updated', {
      detail: { settings: this.settings }
    });
    this.element.dispatchEvent(event);
  }

  // Public methods
  public getElement(): HTMLElement {
    return this.element;
  }

  public onSearch(callback: (query: string, searchEngine: string) => void): void {
    this.onSearchCallback = callback;
  }

  public onNavigate(callback: (url: string) => void): void {
    this.onNavigateCallback = callback;
  }

  public updateSettings(settings: AppSettings): void {
    this.settings = { ...this.settings, ...settings };
    // Re-render if search engine changed
    const engineSelect = this.element.querySelector('#engine-select') as HTMLSelectElement;
    if (engineSelect && engineSelect.value !== settings.searchEngine) {
      engineSelect.value = settings.searchEngine || 'google';
    }
  }

  public focus(): void {
    const searchInput = this.element.querySelector('#home-search-input') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
  }
}
