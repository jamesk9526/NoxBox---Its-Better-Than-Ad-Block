export interface MediaBlurOptions {
  blurImages: boolean;
  blurVideos: boolean;
  blurRadiusPx: number;
}

export interface AppSettings {
  mediaBlur: MediaBlurOptions;
  theme: 'light' | 'dark' | 'high-contrast';
  accessibility: {
    highContrast: boolean;
    largeText: boolean;
    reducedMotion: boolean;
  };
  ui: {
    showHoverReveal: boolean;
  };
}

export interface AppConfig {
  settings: AppSettings;
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  dateAdded: number;
  category?: string;
}

export interface BookmarkCategory {
  id: string;
  name: string;
  bookmarks: Bookmark[];
}

export interface HistoryEntry {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  visitCount: number;
  lastVisited: number;
  firstVisited: number;
  visitDuration?: number; // in milliseconds
}

export interface HistorySearchOptions {
  query?: string;
  startDate?: number;
  endDate?: number;
  limit?: number;
  offset?: number;
}

export interface HistoryStats {
  totalEntries: number;
  totalVisits: number;
  oldestEntry?: number;
  newestEntry?: number;
  mostVisited?: HistoryEntry;
}

// Preload API types
export interface AppApi {
  minimizeWindow: () => Promise<void>;
  maximizeWindow: () => Promise<void>;
  unmaximizeWindow: () => Promise<void>;
  closeWindow: () => Promise<void>;
  isWindowMaximized: () => Promise<boolean>;
  getSettings: () => Promise<AppSettings>;
  updateSettings: (settings: AppSettings) => Promise<void>;
  navigateTo: (url: string) => Promise<void>;
  getVersions: () => { node: string; chrome: string; electron: string };
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    appApi: AppApi;
  }
}