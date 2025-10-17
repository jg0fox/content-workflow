import { v4 as uuidv4 } from 'uuid';

const SESSION_KEY = 'content-workflow-session-id';

export function getSessionId(): string {
  let sessionId = localStorage.getItem(SESSION_KEY);

  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem(SESSION_KEY, sessionId);
  }

  return sessionId;
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}
