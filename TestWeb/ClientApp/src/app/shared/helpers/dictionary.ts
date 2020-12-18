import { IKeyCollection } from './key-collection';

export default class Dictionary<T> implements IKeyCollection<T> {
  private items: { [index: string]: T } = {};
  private count = 0;

  add(key: string, value: T) {
    if (!this.items.hasOwnProperty(key)) {
      this.count++;
    }

    this.items[key] = value;
  }

  containsKey(key: string): boolean {
    return this.items.hasOwnProperty(key);
  }

  size(): number {
    return this.count;
  }

  getItem(key: string): T {
    return this.items[key];
  }

  removeItem(key: string): T {
    const value = this.items[key];

    delete this.items[key];
    this.count--;

    return value;
  }

  getKeys(): string[] {
    const keySet: string[] = [];

    for (const property in this.items) {
      if (this.items.hasOwnProperty(property)) {
        keySet.push(property);
      }
    }

    return keySet;
  }

  values(): T[] {
    const values: T[] = [];

    for (const property in this.items) {
      if (this.items.hasOwnProperty(property)) {
        values.push(this.items[property]);
      }
    }

    return values;
  }

  reset(): void {
    this.items = {};
  }
}
