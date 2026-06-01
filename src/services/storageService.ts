/**
 * Storage Service
 * 
 * Responsibilities:
 * - Provides a unified interface for generic, persistent key-value storage.
 * - Currently falls back to standard browser `localStorage` for offline persistence.
 * - In the future, this can sync non-relational user preferences to a `user_settings` table in Supabase.
 */
export const storageService = {
  /**
   * Retrieve an item from local storage, returning a fallback if not found or parsing fails.
   */
  getItem: <T>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  },

  /**
   * Save an item to local storage securely.
   */
  setItem: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn('Storage Service: Failed to save item to localStorage', error);
    }
  }
};
