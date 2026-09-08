'use client';

import { createContext, useContext, useMemo, useSyncExternalStore } from 'react';

type ClientSessionValue = {
  sessionId: string;
  shortId: string;
};

const SESSION_KEY = 'tons-de-mandarim:private-session';
const SESSION_CHANNEL = 'tons-de-mandarim:session-check';
const COLLISION_PROBE_DELAY_MS = 800;
const ClientSessionContext = createContext<ClientSessionValue>({ sessionId: '', shortId: '' });
let fallbackSessionId = '';
let documentTabId = '';

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

function storeSessionId(sessionId: string) {
  fallbackSessionId = sessionId;
  try { window.sessionStorage.setItem(SESSION_KEY, sessionId); } catch { /* Memory fallback keeps this visit isolated. */ }
}

function currentDocumentTabId() {
  if (!documentTabId) documentTabId = newSessionId();
  return documentTabId;
}

function subscribeToSession(onStoreChange: () => void) {
  let active = true;
  if (!sessionSnapshot()) {
    storeSessionId(newSessionId());
    queueMicrotask(() => {
      if (active) onStoreChange();
    });
  }

  const tabId = currentDocumentTabId();
  let collisionHandled = false;
  let channel: BroadcastChannel | null = null;
  let probeTimer: number | null = null;
  try {
    channel = new BroadcastChannel(SESSION_CHANNEL);
    channel.onmessage = (event: MessageEvent<{ type?: string; sessionId?: string; tabId?: string; targetTabId?: string }>) => {
      const data = event.data;
      const currentSession = sessionSnapshot();
      if (data.type === 'probe' && data.sessionId === currentSession && data.tabId !== tabId) {
        channel?.postMessage({ type: 'occupied', sessionId: currentSession, targetTabId: data.tabId });
      }
      if (!collisionHandled && data.type === 'occupied' && data.targetTabId === tabId && data.sessionId === currentSession) {
        collisionHandled = true;
        storeSessionId(newSessionId());
        onStoreChange();
      }
    };
    probeTimer = window.setTimeout(() => {
      if (active) channel?.postMessage({ type: 'probe', sessionId: sessionSnapshot(), tabId });
    }, COLLISION_PROBE_DELAY_MS);
  } catch {
    channel = null;
  }

  return () => {
    active = false;
    if (probeTimer !== null) window.clearTimeout(probeTimer);
    channel?.close();
  };
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
