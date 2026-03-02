import { SearchEngine, AppSettings } from '../../types/index.js';

export class SearchEngineManager {
  private static instance: SearchEngineManager;
  private searchEngines: SearchEngine[] = [
    {
      id: 'google',
      name: 'Google',
      searchUrl: 'https://www.google.com/search?q={{query}}',
      homePage: 'https://www.google.com',
      icon: '🔍'
    },
    {
      id: 'duckduckgo',
      name: 'DuckDuckGo',
      searchUrl: 'https://duckduckgo.com/?q={{query}}',
      homePage: 'https://duckduckgo.com',
      icon: '🦆'
    },
    {
      id: 'bing',
      name: 'Bing',
      searchUrl: 'https://www.bing.com/search?q={{query}}',
      homePage: 'https://www.bing.com',
      icon: '🌐'
    },
    {
      id: 'startpage',
      name: 'Startpage',
      searchUrl: 'https://www.startpage.com/sp/search?query={{query}}',
      homePage: 'https://www.startpage.com',
      icon: '🔒'
    },
    {
      id: 'searx',
      name: 'SearXNG',
      searchUrl: 'https://searx.org/search?q={{query}}',
      homePage: 'https://searx.org',
      icon: '⚡'
    },
    {
      id: 'yandex',
      name: 'Yandex',
      searchUrl: 'https://yandex.com/search/?text={{query}}',
      homePage: 'https://yandex.com',
      icon: '🇷🇺'
    },
    {
      id: 'baidu',
      name: 'Baidu',
      searchUrl: 'https://www.baidu.com/s?wd={{query}}',
      homePage: 'https://www.baidu.com',
      icon: '🇨🇳'
    },
    {
      id: 'custom',
      name: 'Custom NoxBox Home',
      searchUrl: 'https://www.google.com/search?q={{query}}', // Fallback to Google for search
      homePage: '/home.html', // Custom home page
      icon: '🏠'
    }
  ];

  private constructor() {
    // No longer need HomePageManager
  }

  static getInstance(): SearchEngineManager {
    if (!SearchEngineManager.instance) {
      SearchEngineManager.instance = new SearchEngineManager();
    }
    return SearchEngineManager.instance;
  }

  getAllSearchEngines(): SearchEngine[] {
    return [...this.searchEngines];
  }

  getSearchEngine(id: string): SearchEngine | undefined {
    return this.searchEngines.find(engine => engine.id === id);
  }

  getDefaultSearchEngine(): SearchEngine {
    return this.getSearchEngine('google') || this.searchEngines[0]; // Google as default, fallback to first engine
  }

  buildSearchUrl(engineId: string, query: string): string {
    const engine = this.getSearchEngine(engineId) || this.getDefaultSearchEngine();
    return engine.searchUrl.replace('{{query}}', encodeURIComponent(query));
  }

  getHomePage(engineId: string, settings?: AppSettings): string {
    const engine = this.getSearchEngine(engineId) || this.getDefaultSearchEngine();
    
    // If it's our custom engine, return the static HTML file path
    if (engine.id === 'custom') {
      // In development, use the Vite dev server URL
      // In production, this would need to be served differently
      const isDev = window.location.hostname === 'localhost';
      if (isDev) {
        return `${window.location.protocol}//${window.location.hostname}:${window.location.port}/home.html`;
      } else {
        // For production, we might need to use a different approach
        return engine.homePage;
      }
    }
    
    return engine.homePage;
  }

  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  shouldTreatAsSearch(input: string): boolean {
    // If it looks like a URL (has . and no spaces), don't treat as search
    if (input.includes('.') && !input.includes(' ') && !input.includes('/')) {
      return false;
    }
    
    // If it has spaces or doesn't look like a domain, treat as search
    return input.includes(' ') || !input.includes('.');
  }
}
