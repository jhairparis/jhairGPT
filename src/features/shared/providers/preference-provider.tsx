"use client";
import { createContext, useContext, useRef } from "react";
import { createStore, StoreApi, useStore } from "zustand";
import { persist } from "zustand/middleware";

export type PreferenceStoreState = {
  currentModel: {
    company: string;
    model: string;
  };
};

type PreferencesStoreActions = {
  setModel: (
    nextModel:
      | PreferenceStoreState["currentModel"]
      | ((
          currentModel: PreferenceStoreState["currentModel"]
        ) => PreferenceStoreState["currentModel"])
  ) => void;
};

type PreferencesStore = PreferenceStoreState & PreferencesStoreActions;

const PreferenceContext = createContext<StoreApi<PreferencesStore> | null>(
  null
);

export const PreferenceProvider = ({ children }: any) => {
  const storeRef = useRef<StoreApi<PreferencesStore> | null>(null);

  if (!storeRef.current) {
    storeRef.current = createStore(
      persist<PreferencesStore>(
        (set) => ({
          currentModel: {
            company: "default",
            model: "Select your AI",
          },
          setModel: (nextModel) =>
            set((state) => ({
              currentModel:
                typeof nextModel === "function"
                  ? nextModel(state.currentModel)
                  : nextModel,
            })),
        }),
        { name: "preference-store" }
      )
    );
  }

  return (
    <PreferenceContext.Provider value={storeRef.current}>
      {children}
    </PreferenceContext.Provider>
  );
};

export function usePreference<T>(selector: (state: PreferencesStore) => T) {
  const store = useContext(PreferenceContext);
  if (!store) {
    throw new Error("Missing PreferenceProvider");
  }

  return useStore(store, selector);
}
