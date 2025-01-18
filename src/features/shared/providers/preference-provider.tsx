"use client";
import { createContext, useContext, useRef } from "react";
import { createStore, StoreApi, useStore } from "zustand";
import { persist } from "zustand/middleware";

type PreferenceStoreState = { currentModel: string };

type PreferencesStoreActions = {
  setModel: (
    nextAge:
      | PreferenceStoreState["currentModel"]
      | ((
          currentAge: PreferenceStoreState["currentModel"]
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
          currentModel: "Select your AI",
          setModel: (nextAge) =>
            set((state) => ({
              currentModel:
                typeof nextAge === "function"
                  ? nextAge(state.currentModel)
                  : nextAge,
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
