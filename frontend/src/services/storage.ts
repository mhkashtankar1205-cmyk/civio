export const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Storage access blocked or quota exceeded
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch {
      // Storage access blocked
    }
  },
  clear: (): void => {
    try {
      localStorage.clear();
    } catch {
      // Storage access blocked
    }
  }
};

export default safeStorage;
