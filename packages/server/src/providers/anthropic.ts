import Anthropic from '@anthropic-ai/sdk';
import type { LLMProvider, ModelParams } from '../types/llm.js';

export class AnthropicProvider implements LLMProvider {
  name = 'anthropic';
  models = ['claude-3-5-sonnet-20241022', 'claude-3-opus-20240229', 'claude-3-sonnet-20240229'];

  private client: Anthropic;

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY environment variable is required');
    }
    this.client = new Anthropic({ apiKey });
  }

  async *generate(prompt: string, model: string, params: ModelParams): AsyncIterable<string> {
    const stream = await this.client.messages.create({
      model,
      max_tokens: params.maxTokens ?? 2000,
      temperature: params.temperature ?? 0.7,
      top_p: params.topP ?? 1,
      messages: [{ role: 'user', content: prompt }],
      stream: true,
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        yield event.delta.text;
      }
    }
  }
}
