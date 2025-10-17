# Quick Start Guide

## Initial Setup

### 1. Add Your API Keys

Edit `packages/server/.env` and replace the placeholder values:

```bash
OPENAI_API_KEY=sk-your-actual-openai-key-here
ANTHROPIC_API_KEY=sk-ant-your-actual-anthropic-key-here
PORT=3001
```

### 2. Install Dependencies

From the project root:

```bash
npm install
```

### 3. Start the Application

```bash
npm run dev
```

This will start:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001

## Using the Application

### Adding Nodes

Click the buttons at the top-left of the canvas:
- **+ Context**: Add context information (tone, audience, style guide)
- **+ LLM**: Add an AI generation node
- **+ Content**: Add a content editor
- **+ Prompt View**: View the assembled prompt

### Connecting Nodes

1. Drag from the **bottom handle** (output) of one node
2. Connect to the **top handle** (input) of another node

### Generating Content

1. Add a Context node and configure it
2. Add an LLM node
3. Connect Context → LLM
4. Select your provider (OpenAI or Anthropic) and model
5. Click "Generate"
6. Watch as content streams in real-time!

### Example Workflow

```
[Context: Tone=Friendly]
         ↓
    [LLM: GPT-4]
         ↓
  [Content Editor]
```

## Current Features

✅ Visual node-based canvas with zoom/pan
✅ Real-time SSE streaming from both OpenAI and Anthropic
✅ Rich text editor with TipTap
✅ Anonymous session management
✅ Multiple node types (Context, LLM, Content, Prompt View)

## Next Steps (Phase 2)

- Prompt assembly from context nodes
- Evaluation nodes (AI analysis & manual rubric)
- Cross-LLM evaluation workflows
- Database persistence
- Save/load functionality

## Troubleshooting

### Server won't start
- Check that your API keys are correctly set in `packages/server/.env`
- Make sure port 3001 is not in use

### Frontend won't connect to backend
- Verify the backend is running on port 3001
- Check `packages/client/.env` has `VITE_API_URL=http://localhost:3001/api`

### Node.js version warnings
- The project requires Node.js 22+
- Engine warnings about 20.19.0 can be safely ignored if you're on 22.11.0

## Development

### Run server only
```bash
npm run dev:server
```

### Run client only
```bash
npm run dev:client
```

### Type check
```bash
npm run type-check
```

### Build for production
```bash
npm run build
```
