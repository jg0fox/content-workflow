import OpenAI from 'openai';
import type { LLMProvider, ModelParams } from '../types/llm.js';

export class OpenAIProvider implements LLMProvider {
  name = 'openai';
  models = ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'];

  private client: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
    this.client = new OpenAI({ apiKey });
  }

  async *generate(prompt: string, model: string, params: ModelParams): AsyncIterable<string> {
    const stream = await this.client.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: params.temperature ?? 0.7,
      max_tokens: params.maxTokens ?? 2000,
      top_p: params.topP ?? 1,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        yield content;
      }
    }
  }
}
