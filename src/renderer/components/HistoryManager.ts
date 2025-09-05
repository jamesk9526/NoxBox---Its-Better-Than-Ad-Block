import { HistoryEntry, HistorySearchOptions, HistoryStats } from '../../types/index';

export class HistoryManager {
  private static instance: HistoryManager;
  private history: HistoryEntry[] = [];
  private readonly STORAGE_KEY = 'noxbox_history';
  private readonly MAX_ENTRIES = 10000;
  private readonly CLEANUP_THRESHOLD = 12000;

  private constructor() {
    this.loadHistory();
  }

  public static getInstance(): HistoryManager {
    if (!HistoryManager.instance) {
      HistoryManager.instance = new HistoryManager();
    }
    return HistoryManager.instance;
  }

  /**
   * Add a new history entry or update existing one
   */
  public addEntry(url: string, title: string, favicon?: string, visitDuration?: number): void {
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
    } else {
      // Create new entry
      const newEntry: HistoryEntry = {
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
  public removeEntry(id: string): boolean {
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
  public removeEntries(ids: string[]): number {
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
  public clearAll(): void {
    this.history = [];
    this.saveHistory();
  }

  /**
   * Search and filter history entries
   */
  public search(options: HistorySearchOptions = {}): HistoryEntry[] {
    let results = [...this.history];

    // Apply date filters
    if (options.startDate) {
      results = results.filter(entry => entry.lastVisited >= options.startDate!);
    }
    if (options.endDate) {
      results = results.filter(entry => entry.lastVisited <= options.endDate!);
    }

    // Apply text search
    if (options.query) {
      const query = options.query.toLowerCase();
      results = results.filter(entry =>
        entry.title.toLowerCase().includes(query) ||
        entry.url.toLowerCase().includes(query)
      );
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
  public getGroupedByDate(limit: number = 50): { [date: string]: HistoryEntry[] } {
    const recentEntries = this.history.slice(0, limit);
    const grouped: { [date: string]: HistoryEntry[] } = {};

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
  public getMostVisited(limit: number = 10): HistoryEntry[] {
    return [...this.history]
      .sort((a, b) => b.visitCount - a.visitCount)
      .slice(0, limit);
  }

  /**
   * Get recently visited entries
   */
  public getRecent(limit: number = 50): HistoryEntry[] {
    return this.history.slice(0, limit);
  }

  /**
   * Get history statistics
   */
  public getStats(): HistoryStats {
    if (this.history.length === 0) {
      return {
        totalEntries: 0,
        totalVisits: 0
      };
    }

    const totalVisits = this.history.reduce((sum, entry) => sum + entry.visitCount, 0);
    const mostVisited = this.history.reduce((max, entry) =>
      entry.visitCount > (max?.visitCount || 0) ? entry : max
    );

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
  public exportData(): string {
    return JSON.stringify({
      version: '1.0',
      exportDate: Date.now(),
      entries: this.history
    }, null, 2);
  }

  /**
   * Import history data
   */
  public importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      if (data.entries && Array.isArray(data.entries)) {
        const validEntries = data.entries.filter((entry: any) =>
          entry.id && entry.url && entry.title && entry.lastVisited
        );
        this.history = [...validEntries, ...this.history];
        this.cleanupIfNeeded();
        this.saveHistory();
        return true;
      }
    } catch (error) {
      console.error('Failed to import history data:', error);
    }
    return false;
  }

  /**
   * Get all history entries (for internal use)
   */
  public getAllEntries(): HistoryEntry[] {
    return [...this.history];
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private cleanupIfNeeded(): void {
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

  private loadHistory(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          this.history = parsed.map(entry => ({
            ...entry,
            // Ensure all required fields exist
            visitCount: entry.visitCount || 1,
            firstVisited: entry.firstVisited || entry.lastVisited || Date.now(),
            lastVisited: entry.lastVisited || Date.now()
          }));
        }
      }
    } catch (error) {
      console.warn('Failed to load history from localStorage:', error);
      this.history = [];
    }
  }

  private saveHistory(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.history));
    } catch (error) {
      console.warn('Failed to save history to localStorage:', error);
    }
  }
}
