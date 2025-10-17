export interface ModelParams {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
}

export interface GenerateRequest {
  sessionId: string;
  prompt: string;
  model: string;
  provider: 'openai' | 'anthropic';
  params?: ModelParams;
}

export interface LLMProvider {
  generate(prompt: string, model: string, params: ModelParams): AsyncIterable<string>;
  models: string[];
  name: string;
}
