import { SearchEngine, AppSettings } from '../../types/index.js';
import { HomePage } from './HomePage.js';

export class HomePageManager {
  private static instance: HomePageManager;
  private homePage: HomePage | null = null;

  private constructor() {}

  static getInstance(): HomePageManager {
    if (!HomePageManager.instance) {
      HomePageManager.instance = new HomePageManager();
    }
    return HomePageManager.instance;
  }

  /**
   * Create or get the HomePage component
   */
  getHomePage(settings: AppSettings): HomePage {
    if (!this.homePage) {
      this.homePage = new HomePage(settings);
    } else {
      this.homePage.updateSettings(settings);
    }
    return this.homePage;
  }

  /**
   * Generate a self-contained home page as a data URL (fallback method)
   * This works in both development and production builds
   */
  generateHomePage(searchEngines: SearchEngine[], currentSearchEngine: string): string {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NoxBox - Privacy-First Browsing</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);
            color: #ffffff;
            min-height: 100vh;
            overflow-x: hidden;
            position: relative;
        }

        body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image:
                radial-gradient(circle at 25% 25%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 75% 75%, rgba(118, 75, 162, 0.1) 0%, transparent 50%);
            animation: patternShift 20s ease-in-out infinite;
            pointer-events: none;
            z-index: -1;
        }

        @keyframes patternShift {
            0%, 100% { transform: translateX(0) translateY(0); }
            50% { transform: translateX(-20px) translateY(-20px); }
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            min-height: 100vh;
            justify-content: center;
        }

        .header {
            text-align: center;
            margin-bottom: 60px;
        }

        .logo {
            font-size: 4rem;
            margin-bottom: 20px;
            filter: drop-shadow(0 4px 8px rgba(102, 126, 234, 0.3));
        }

        .brand-title {
            font-size: 3rem;
            font-weight: 700;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 16px;
            letter-spacing: -0.02em;
        }

        .tagline {
            font-size: 1.25rem;
            color: #a0aec0;
            font-weight: 400;
            letter-spacing: 0.01em;
        }

        .search-section {
            width: 100%;
            max-width: 600px;
            margin-bottom: 60px;
        }

        .search-container {
            position: relative;
            margin-bottom: 30px;
        }

        .search-input {
            width: 100%;
            padding: 18px 24px;
            font-size: 18px;
            border: 2px solid rgba(102, 126, 234, 0.3);
            border-radius: 25px;
            background: rgba(255, 255, 255, 0.1);
            color: #ffffff;
            -webkit-backdrop-filter: blur(10px);
            backdrop-filter: blur(10px);
            outline: none;
            transition: all 0.3s ease;
        }

        .search-input::placeholder {
            color: #a0aec0;
        }

        .search-input:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.2);
            background: rgba(255, 255, 255, 0.15);
        }

        .search-engines {
            display: flex;
            justify-content: center;
            gap: 12px;
            flex-wrap: wrap;
        }

        .search-engine-btn {
            padding: 8px 16px;
            border: 1px solid rgba(102, 126, 234, 0.3);
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.1);
            color: #e2e8f0;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 14px;
            font-weight: 500;
            -webkit-backdrop-filter: blur(10px);
            backdrop-filter: blur(10px);
        }

        .search-engine-btn:hover {
            background: rgba(102, 126, 234, 0.2);
            border-color: #667eea;
            transform: translateY(-1px);
        }

        .search-engine-btn.active {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-color: #667eea;
            color: white;
        }

        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 30px;
            width: 100%;
            max-width: 900px;
            margin-bottom: 60px;
        }

        .feature-card {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(102, 126, 234, 0.2);
            border-radius: 16px;
            padding: 30px;
            text-align: center;
            -webkit-backdrop-filter: blur(10px);
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
        }

        .feature-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 30px rgba(102, 126, 234, 0.2);
            border-color: rgba(102, 126, 234, 0.4);
        }

        .feature-icon {
            font-size: 2.5rem;
            margin-bottom: 20px;
            display: block;
        }

        .feature-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: #ffffff;
            margin-bottom: 12px;
        }

        .feature-description {
            color: #a0aec0;
            line-height: 1.6;
        }

        .quick-links {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
            justify-content: center;
        }

        .quick-link {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 20px;
            border: 1px solid rgba(102, 126, 234, 0.3);
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.1);
            color: #e2e8f0;
            text-decoration: none;
            transition: all 0.2s ease;
            -webkit-backdrop-filter: blur(10px);
            backdrop-filter: blur(10px);
            cursor: pointer;
        }

        .quick-link:hover {
            background: rgba(102, 126, 234, 0.2);
            border-color: #667eea;
            transform: translateY(-1px);
            color: #ffffff;
        }

        .footer {
            margin-top: auto;
            text-align: center;
            padding: 20px 0;
            color: #718096;
            font-size: 14px;
        }

        @media (max-width: 768px) {
            .container { padding: 20px 16px; }
            .brand-title { font-size: 2.5rem; }
            .logo { font-size: 3rem; }
            .search-input { padding: 16px 20px; font-size: 16px; }
            .features { grid-template-columns: 1fr; gap: 20px; }
            .quick-links { flex-direction: column; align-items: center; }
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <div class="logo">🛡️</div>
            <h1 class="brand-title">NoxBox</h1>
            <p class="tagline">Privacy-first browsing with intelligent content control</p>
        </header>

        <section class="search-section">
            <div class="search-container">
                <input 
                    type="text" 
                    class="search-input" 
                    placeholder="Search the web or enter a URL..."
                    id="main-search"
                    autocomplete="off"
                >
            </div>
            <div class="search-engines" id="search-engines">
                ${searchEngines.map(engine => `
                    <button class="search-engine-btn ${engine.id === currentSearchEngine ? 'active' : ''}" 
                            data-engine="${engine.id}">
                        ${engine.icon || '🔍'} ${engine.name}
                    </button>
                `).join('')}
            </div>
        </section>

        <section class="features">
            <div class="feature-card">
                <span class="feature-icon">👁️</span>
                <h3 class="feature-title">Smart Blur</h3>
                <p class="feature-description">Automatically blur distracting media content while you browse, with intelligent hover-to-reveal functionality.</p>
            </div>
            <div class="feature-card">
                <span class="feature-icon">🎯</span>
                <h3 class="feature-title">Selective Control</h3>
                <p class="feature-description">Click to permanently unlock specific content that matters to you, building your personalized browsing experience.</p>
            </div>
            <div class="feature-card">
                <span class="feature-icon">🔒</span>
                <h3 class="feature-title">Privacy Focused</h3>
                <p class="feature-description">Choose from multiple privacy-focused search engines including DuckDuckGo, Startpage, and SearXNG.</p>
            </div>
        </section>

        <section class="quick-links">
            <div class="quick-link" data-url="https://github.com">
                <span>👨‍💻</span>
                <span>GitHub</span>
            </div>
            <div class="quick-link" data-url="https://reddit.com">
                <span>🤖</span>
                <span>Reddit</span>
            </div>
            <div class="quick-link" data-url="https://youtube.com">
                <span>📺</span>
                <span>YouTube</span>
            </div>
            <div class="quick-link" data-url="https://news.ycombinator.com">
                <span>📰</span>
                <span>Hacker News</span>
            </div>
        </section>

        <footer class="footer">
            <p>Built with ❤️ for privacy-conscious users</p>
        </footer>
    </div>

    <script>
        const searchEngines = ${JSON.stringify(searchEngines)};
        let currentSearchEngine = '${currentSearchEngine}';

        function selectSearchEngine(engineId) {
            currentSearchEngine = engineId;
            document.querySelectorAll('.search-engine-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.engine === engineId);
            });
        }

        function handleSearch() {
            const query = document.getElementById('main-search').value.trim();
            if (!query) return;

            let targetUrl;
            if (isUrl(query)) {
                targetUrl = query.startsWith('http') ? query : 'https://' + query;
            } else {
                const engine = searchEngines.find(e => e.id === currentSearchEngine) || searchEngines[0];
                targetUrl = engine.searchUrl.replace('{{query}}', encodeURIComponent(query));
            }
            navigateToUrl(targetUrl);
        }

        function isUrl(text) {
            return text.includes('.') && !text.includes(' ') && text.length > 3;
        }

        function navigateToUrl(url) {
            // Send message to parent (webview container)
            if (window.parent && window.parent !== window) {
                window.parent.postMessage({ type: 'navigate', url: url }, '*');
            } else {
                window.location.href = url;
            }
        }

        // Event listeners
        document.getElementById('main-search').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });

        document.querySelectorAll('.search-engine-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                selectSearchEngine(btn.dataset.engine);
            });
        });

        document.querySelectorAll('.quick-link').forEach(link => {
            link.addEventListener('click', () => {
                const url = link.dataset.url;
                if (url) {
                    navigateToUrl(url);
                }
            });
        });
    </script>
</body>
</html>`;

    return `data:text/html;charset=utf-8,${encodeURIComponent(html)}`;
  }
}
