import { CacheError, CacheErrorCode } from "./errors/CacheError";

class CacheManager {
  private cache: Map<any, { value: any; expiryTime: number | null }>;

  constructor() {
    this.cache = new Map();
  }

  set(key: any, value: any, expiry: number = 0): void {
    // if (this.cache.has(key))
    //   throw new CacheError(
    //     CacheErrorCode.KeyAlreadySet,
    //     `Key ${key} already exists in cache.`
    //   );
    const expiryTime = expiry > 0 ? Date.now() + expiry : null;
    this.cache.set(key, { value, expiryTime });
  }

  get(key: any): any | null {
    const entry = this.cache.get(key);

    if (!entry) return null;

    const { value, expiryTime } = entry;

    if (expiryTime && Date.now() > expiryTime) {
      this.delete(key);
      return null;
    }

    return value;
  }

  delete(key: any): void {
    if (!this.cache.has(key)) return;
    this.cache.delete(key);
  }

  has(key: any): boolean {
    return this.get(key) !== null;
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  cleanUp(): void {
    const now = Date.now();
    for (const [key, { expiryTime }] of this.cache) {
      if (expiryTime && now > expiryTime) {
        this.delete(key);
      }
    }
  }
}

export default new CacheManager();
