"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";

// Flexible type that matches what the SDK actually sends
export type DataStreamPart = {
  type: `data-${string}`;
  id?: string;
  data: unknown;
};

interface DataStreamContextValue {
  dataStream: DataStreamPart[];
  setDataStream: Dispatch<SetStateAction<DataStreamPart[]>>;
  clearDataStream: () => void;
}

const DataStreamContext = createContext<DataStreamContextValue | null>(null);

export function DataStreamProvider({ children }: { children: ReactNode }) {
  const [dataStream, setDataStream] = useState<DataStreamPart[]>([]);

  const clearDataStream = useCallback(() => {
    setDataStream([]);
  }, []);

  const value = useMemo(
    () => ({ dataStream, setDataStream, clearDataStream }),
    [dataStream, clearDataStream]
  );

  return (
    <DataStreamContext.Provider value={value}>
      {children}
    </DataStreamContext.Provider>
  );
}

export function useDataStream() {
  const context = useContext(DataStreamContext);
  if (!context) {
    throw new Error("useDataStream must be used within DataStreamProvider");
  }
  return context;
}

