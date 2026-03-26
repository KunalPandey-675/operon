"use client";

import React, { createContext, useContext, useMemo } from "react";

type CurrentUserContextValue = {
  userId: string | null;
};

const CurrentUserContext = createContext<CurrentUserContextValue | null>(null);

type CurrentUserProviderProps = {
  children: React.ReactNode;
  userId: string | null;
};

export function CurrentUserProvider({ children, userId }: CurrentUserProviderProps) {
  const value = useMemo(() => ({ userId }), [userId]);

  return <CurrentUserContext.Provider value={value}>{children}</CurrentUserContext.Provider>;
}

export function useCurrentUserId() {
  const context = useContext(CurrentUserContext);
  return context?.userId ?? null;
}