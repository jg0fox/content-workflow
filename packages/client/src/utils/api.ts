import { getSessionId } from './session';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface GenerateParams {
  prompt: string;
  provider: 'openai' | 'anthropic';
  model: string;
  temperature?: number;
  maxTokens?: number;
}

export interface StreamCallbacks {
  onChunk: (text: string) => void;
  onDone: () => void;
  onError: (error: string) => void;
}

export async function generateStream(params: GenerateParams, callbacks: StreamCallbacks): Promise<void> {
  const sessionId = getSessionId();

  const response = await fetch(`${API_URL}/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sessionId,
      ...params,
      params: {
        temperature: params.temperature,
        maxTokens: params.maxTokens,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('No response body');
  }

  const decoder = new TextDecoder();

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = JSON.parse(line.slice(6));

          if (data.type === 'chunk') {
            callbacks.onChunk(data.content);
          } else if (data.type === 'done') {
            callbacks.onDone();
          } else if (data.type === 'error') {
            callbacks.onError(data.error);
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

export async function evaluateStream(
  content: string,
  context: string | undefined,
  provider: 'openai' | 'anthropic',
  model: string,
  callbacks: StreamCallbacks
): Promise<void> {
  const sessionId = getSessionId();

  const response = await fetch(`${API_URL}/evaluate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sessionId,
      content,
      context,
      provider,
      model,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('No response body');
  }

  const decoder = new TextDecoder();

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = JSON.parse(line.slice(6));

          if (data.type === 'chunk') {
            callbacks.onChunk(data.content);
          } else if (data.type === 'done') {
            callbacks.onDone();
          } else if (data.type === 'error') {
            callbacks.onError(data.error);
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

export async function getProviders(): Promise<Array<{ name: string; models: string[] }>> {
  const response = await fetch(`${API_URL}/providers`);
  const data = await response.json();
  return data.providers;
}
