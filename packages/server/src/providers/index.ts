import type { LLMProvider } from '../types/llm.js';
import { OpenAIProvider } from './openai.js';
import { AnthropicProvider } from './anthropic.js';

const providers = new Map<string, LLMProvider>();

// Initialize providers
try {
  const openai = new OpenAIProvider();
  providers.set('openai', openai);
  console.log('✓ OpenAI provider initialized');
} catch (error) {
  console.warn('⚠ OpenAI provider not available:', (error as Error).message);
}

try {
  const anthropic = new AnthropicProvider();
  providers.set('anthropic', anthropic);
  console.log('✓ Anthropic provider initialized');
} catch (error) {
  console.warn('⚠ Anthropic provider not available:', (error as Error).message);
}

export function getProvider(name: string): LLMProvider {
  const provider = providers.get(name);
  if (!provider) {
    throw new Error(`Provider "${name}" not found or not configured`);
  }
  return provider;
}

export function listProviders(): Array<{ name: string; models: string[] }> {
  return Array.from(providers.values()).map((p) => ({
    name: p.name,
    models: p.models,
  }));
}
