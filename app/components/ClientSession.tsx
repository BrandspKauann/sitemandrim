'use client';

import { createContext, useContext, useMemo, useSyncExternalStore } from 'react';

type ClientSessionValue = {
  sessionId: string;
  shortId: string;
};

const SESSION_KEY = 'tons-de-mandarim:private-session';
const ClientSessionContext = createContext<ClientSessionValue>({ sessionId: '', shortId: '' });
let fallbackSessionId = '';

function newSessionId() {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function sessionSnapshot() {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) ?? fallbackSessionId;
  } catch {
    return fallbackSessionId;
  }
}

function serverSessionSnapshot() {
  return '';
}

function subscribeToSession(onStoreChange: () => void) {
  let active = true;
  if (!sessionSnapshot()) {
    fallbackSessionId = newSessionId();
    try { window.sessionStorage.setItem(SESSION_KEY, fallbackSessionId); } catch { /* Memory fallback keeps this visit isolated. */ }
    queueMicrotask(() => {
      if (active) onStoreChange();
    });
  }
  return () => { active = false; };
}

export function ClientSessionProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const sessionId = useSyncExternalStore(subscribeToSession, sessionSnapshot, serverSessionSnapshot);

  const value = useMemo(() => ({
    sessionId,
    shortId: sessionId ? sessionId.replaceAll('-', '').slice(0, 8).toUpperCase() : '',
  }), [sessionId]);

  return <ClientSessionContext.Provider value={value}>{children}</ClientSessionContext.Provider>;
}

export function useClientSession() {
  return useContext(ClientSessionContext);
}
