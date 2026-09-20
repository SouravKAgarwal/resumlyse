import { AnalysisResult, AnalysisRecord } from '../types';

export interface StoredAnalysisRecord {
  id: number;
  filename: string;
  overall_score: number;
  created_at: string;
  job_description: string | null;
  analysis: AnalysisResult;
}

const DB_NAME = 'resumlyse_db';
const DB_VERSION = 1;
const STORE_NAME = 'analyses';
const LOCAL_STORAGE_KEY = 'resumlyse_local_analyses';

// Check if IndexedDB is supported
const isIndexedDBAvailable = (): boolean => {
  try {
    return typeof window !== 'undefined' && 'indexedDB' in window && window.indexedDB !== null;
  } catch {
    return false;
  }
};

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (!isIndexedDBAvailable()) {
      return reject(new Error('IndexedDB not supported'));
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('created_at', 'created_at', { unique: false });
        store.createIndex('filename', 'filename', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Failed to open database'));
  });
};

// LocalStorage Fallback Helpers
const getLocalStorageRecords = (): StoredAnalysisRecord[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const setLocalStorageRecords = (records: StoredAnalysisRecord[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    console.error('LocalStorage quota exceeded or unavailable:', err);
  }
};

/**
 * Save an analysis record into the browser's private database.
 * No data is saved on the server.
 */
export const saveAnalysisToBrowser = async (data: {
  filename: string;
  overall_score: number;
  analysis: AnalysisResult;
  job_description?: string | null;
}): Promise<StoredAnalysisRecord> => {
  const newRecord: StoredAnalysisRecord = {
    id: Date.now(),
    filename: data.filename,
    overall_score: data.overall_score,
    created_at: new Date().toISOString(),
    job_description: data.job_description || null,
    analysis: data.analysis,
  };

  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(newRecord);

      request.onsuccess = () => resolve(newRecord);
      request.onerror = () => reject(request.error || new Error('Failed to save record to IndexedDB'));
    });
  } catch (err) {
    console.warn('IndexedDB failed, falling back to localStorage:', err);
    const existing = getLocalStorageRecords();
    const updated = [newRecord, ...existing];
    setLocalStorageRecords(updated);
    return newRecord;
  }
};

/**
 * Retrieve all past analyses metadata from the browser's private database.
 */
export const getHistoryFromBrowser = async (): Promise<AnalysisRecord[]> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const records = (request.result as StoredAnalysisRecord[]) || [];
        // Sort descending by created_at
        records.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        // Return summary record without the large analysis blob
        const summaries: AnalysisRecord[] = records.map((r) => ({
          id: r.id,
          filename: r.filename,
          overall_score: r.overall_score,
          created_at: r.created_at,
          job_description: r.job_description,
        }));
        resolve(summaries);
      };

      request.onerror = () => reject(request.error || new Error('Failed to fetch from IndexedDB'));
    });
  } catch (err) {
    console.warn('IndexedDB failed, fetching from localStorage fallback:', err);
    const records = getLocalStorageRecords();
    records.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return records.map((r) => ({
      id: r.id,
      filename: r.filename,
      overall_score: r.overall_score,
      created_at: r.created_at,
      job_description: r.job_description,
    }));
  }
};

/**
 * Retrieve a specific full analysis record by its ID from browser storage.
 */
export const getAnalysisFromBrowser = async (id: number): Promise<StoredAnalysisRecord | null> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => {
        resolve(request.result || null);
      };

      request.onerror = () => reject(request.error || new Error('Failed to retrieve record'));
    });
  } catch (err) {
    console.warn('IndexedDB failed, reading from localStorage fallback:', err);
    const records = getLocalStorageRecords();
    const found = records.find((r) => r.id === id);
    return found || null;
  }
};

/**
 * Delete an analysis record from the browser's private database.
 */
export const deleteAnalysisFromBrowser = async (id: number): Promise<void> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error || new Error('Failed to delete record'));
    });
  } catch (err) {
    console.warn('IndexedDB failed, deleting from localStorage fallback:', err);
    const records = getLocalStorageRecords().filter((r) => r.id !== id);
    setLocalStorageRecords(records);
  }
};

/**
 * Clear all private resume analyses from this browser.
 */
export const clearAllAnalysesFromBrowser = async (): Promise<void> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error || new Error('Failed to clear database'));
    });
  } catch {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }
};
