import React, { createContext, useContext, useState } from 'react';
import { AnalysisRecord } from '../types';

interface HistoryContextValue {
  history: AnalysisRecord[];
  refreshHistory: () => Promise<void>;
  deleteRecord: (id: number) => Promise<void>;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
}

const HistoryContext = createContext<HistoryContextValue | undefined>(undefined);

export const HistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<AnalysisRecord[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const refreshHistory = useCallback(async () => {
    // No-op since we removed history functionality
    setHistory([]);
    return Promise.resolve();
  }, []);

  const deleteRecord = useCallback(async (id: number) => {
    // No-op since we removed history functionality
    return Promise.resolve();
  }, []);

  return (
    <HistoryContext.Provider
      value={{
        history,
        refreshHistory,
        deleteRecord,
        isDrawerOpen,
        setIsDrawerOpen,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = (): HistoryContextValue => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
};
