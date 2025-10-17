import { Router } from 'express';
import type { Request, Response } from 'express';
import { getProvider, listProviders } from '../providers/index.js';
import type { GenerateRequest } from '../types/llm.js';

export const generateRouter = Router();

// List available providers and models
generateRouter.get('/providers', (req: Request, res: Response) => {
  const providers = listProviders();
  res.json({ providers });
});

// Generate content with SSE streaming
generateRouter.post('/generate', async (req: Request, res: Response) => {
  try {
    const { sessionId, prompt, model, provider: providerName, params } = req.body as GenerateRequest;

    // Validation
    if (!sessionId || !prompt || !model || !providerName) {
      res.status(400).json({
        error: 'Missing required fields: sessionId, prompt, model, provider'
      });
      return;
    }

    // Get the provider
    const provider = getProvider(providerName);

    // Set up SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    try {
      // Stream the generation
      for await (const chunk of provider.generate(prompt, model, params || {})) {
        res.write(`data: ${JSON.stringify({ type: 'chunk', content: chunk })}\n\n`);
      }

      // Send completion event
      res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
      res.end();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.write(`data: ${JSON.stringify({ type: 'error', error: errorMessage })}\n\n`);
      res.end();
    }
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
});

// Evaluate content with AI (similar to generate, but with evaluation prompt template)
generateRouter.post('/evaluate', async (req: Request, res: Response) => {
  try {
    const { sessionId, content, context, model, provider: providerName, params } = req.body;

    if (!sessionId || !content || !model || !providerName) {
      res.status(400).json({
        error: 'Missing required fields: sessionId, content, model, provider'
      });
      return;
    }

    // Build evaluation prompt
    const evaluationPrompt = `You are a UX content evaluator. Please analyze the following content and provide constructive feedback.

${context ? `Context:\n${context}\n\n` : ''}Content to evaluate:
${content}

Please evaluate this content on:
1. Clarity - Is the message clear and easy to understand?
2. Tone - Is the tone appropriate for the context and audience?
3. Conciseness - Is it appropriately concise without sacrificing clarity?
4. Grammar & Style - Are there any grammar issues or style improvements?

Provide specific, actionable feedback.`;

    const provider = getProvider(providerName);

    // Set up SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    try {
      for await (const chunk of provider.generate(evaluationPrompt, model, params || {})) {
        res.write(`data: ${JSON.stringify({ type: 'chunk', content: chunk })}\n\n`);
      }

      res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
      res.end();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.write(`data: ${JSON.stringify({ type: 'error', error: errorMessage })}\n\n`);
      res.end();
    }
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
});
