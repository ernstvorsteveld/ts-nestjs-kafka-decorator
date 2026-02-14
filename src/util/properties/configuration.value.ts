export class ConfigurationValue<T> {
  private value: T | undefined;
  private initialized: boolean = false;

  constructor(value: T | undefined) {
    this.value = value;
    this.initialized = true;
    if (value === undefined) {
      this.initialized = false;
    }
  }

  public static empty<T>(): ConfigurationValue<T> {
    return new ConfigurationValue<T>(undefined);
  }

  public get(): T {
    if (!this.initialized) {
      throw new Error('Value not initialized');
    }
    return this.value as T;
  }

  public isInitialized(): boolean {
    return this.initialized;
  }
}
