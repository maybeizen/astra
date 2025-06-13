export enum CacheErrorCode {
  KeyAlreadySet = "KEY_ALREADY_SET",
  KeyNotFound = "KEY_NOT_FOUND",
}

export class CacheError extends Error {
  code: CacheErrorCode;

  constructor(code: CacheErrorCode, key?: string) {
    const messages: Record<CacheErrorCode, string> = {
      [CacheErrorCode.KeyAlreadySet]: `Key "${key}" already exists in cache.`,
      [CacheErrorCode.KeyNotFound]: `Key "${key}" not found in cache.`,
    };

    super(messages[code]);
    this.name = "CacheError";
    this.code = code;
  }
}
