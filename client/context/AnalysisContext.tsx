"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useSyncExternalStore,
} from "react";
import { AnalysisResult } from "@/types";

export interface AnalysisData {
  filename: string;
  analysis: AnalysisResult;
}

interface AnalysisContextType {
  analysisData: AnalysisData | null;
  setAnalysisData: (data: AnalysisData | null) => void;
  clearAnalysis: () => void;
  isLoading: boolean;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

const STORAGE_KEY = "resumlyse_latest_analysis";

const subscribe = (callback: () => void) => {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
};

const getSnapshot = (): string | null => {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

const getServerSnapshot = (): string | null => null;

export const AnalysisProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [inMemoryData, setInMemoryData] = useState<AnalysisData | null>(null);
  const storedJson = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  let parsedStored: AnalysisData | null = null;
  if (storedJson) {
    try {
      parsedStored = JSON.parse(storedJson) as AnalysisData;
    } catch {
      parsedStored = null;
    }
  }

  const analysisData = inMemoryData || parsedStored;

  const setAnalysisData = (data: AnalysisData | null) => {
    setInMemoryData(data);
    try {
      if (data) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } else {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.error("Failed to save analysis to sessionStorage:", e);
    }
  };

  const clearAnalysis = () => {
    setAnalysisData(null);
  };

  return (
    <AnalysisContext.Provider
      value={{
        analysisData,
        setAnalysisData,
        clearAnalysis,
        isLoading: false,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = (): AnalysisContextType => {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error("useAnalysis must be used within an AnalysisProvider");
  }
  return context;
};
