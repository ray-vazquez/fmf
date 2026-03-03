interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class Cache {
  private store: Map<string, CacheEntry<any>> = new Map();
  private ttl: number = 5 * 60 * 1000; // 5 minutes

  set<T>(key: string, data: T, customTTL?: number): void {
    this.store.set(key, {
      data,
      timestamp: Date.now() + (customTTL || this.ttl),
    });
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    
    if (Date.now() > entry.timestamp) {
      this.store.delete(key);
      return null;
    }
    
    return entry.data as T;
  }

  clear(): void {
    this.store.clear();
  }
}

export default new Cache();
