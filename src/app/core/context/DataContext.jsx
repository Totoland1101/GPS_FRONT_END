"use client";
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const initialState = {
  order: {
    list: null,
    detail: null,
    loadingList: false,
    loadingDetail: false,
  },
};

const DataContext = createContext(undefined);

export const DataProvider = ({ children }) => {
  const [state, setState] = useState(initialState);

  const getStateNamspace = useCallback(
    (namespace, initValue) => {
      if (namespace) {
        return state[namespace] ?? initValue;
      }
      return state;
    },
    [state],
  );

  const updateState = (values, namespace) => {
    setState((prev) => {
      if (namespace) {
        return {
          ...prev,
          [namespace]: {
            ...(prev[namespace] ?? {}),
            ...(values ?? {}),
          },
        };
      }
      return {
        ...prev,
        ...(values ?? {}),
      };
    });
  };

  const contextValue = useMemo(
    () => ({
      state,
      setState,
      updateState,
      getStateNamspace,
    }),
    [state],
  );

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useDataContext must be used within DataProvider");
  }
  return context;
};
