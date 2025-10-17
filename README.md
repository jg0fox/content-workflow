# Content Workflow - Node-Based LLM-Powered UX Content Assistant

A web-based application that empowers UX writers, product managers, content designers, and engineers to craft product content with AI assistance using a visual node-based canvas.

## Features (Phase 1)

- 🎨 **Node-Based Visual Canvas** - Intuitive drag-and-drop interface powered by React Flow
- 🤖 **Dual LLM Support** - OpenAI (GPT-4, GPT-3.5) and Anthropic (Claude) integration
- ⚡ **Real-Time Streaming** - SSE streaming for responsive AI generation
- 📝 **Rich Text Editing** - TipTap-based content editor with formatting
- 🔄 **Cross-LLM Evaluation** - Use one model to evaluate content from another
- 💾 **Session Persistence** - Anonymous sessions with localStorage

## Project Structure

```
content-workflow/
├── packages/
│   ├── client/          # React + TypeScript frontend
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   └── nodes/  # Custom node components
│   │   │   ├── types/
│   │   │   ├── utils/
│   │   │   └── hooks/
│   │   └── package.json
│   └── server/          # Express + TypeScript backend
│       ├── src/
│       │   ├── providers/  # LLM provider implementations
│       │   ├── routes/
│       │   └── types/
│       └── package.json
└── package.json         # Workspace root
```

## Getting Started

### Prerequisites

- Node.js 22+
- npm or yarn
- OpenAI API key
- Anthropic API key

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

Create `packages/server/.env`:

```bash
cp packages/server/.env.example packages/server/.env
```

Edit `packages/server/.env` and add your API keys:

```
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
PORT=3001
```

### Running the Application

Start both client and server in development mode:

```bash
npm run dev
```

This will start:
- Frontend at http://localhost:5173
- Backend at http://localhost:3001

Or run them separately:

```bash
# Terminal 1 - Server
npm run dev:server

# Terminal 2 - Client
npm run dev:client
```

## Usage

1. **Add Nodes** - Click the buttons in the top-left to add different node types:
   - Context nodes: Define tone, audience, style guides
   - LLM nodes: Generate content with AI
   - Content nodes: Edit and refine content
   - Prompt View nodes: Inspect assembled prompts

2. **Connect Nodes** - Drag from the output handle (bottom) of one node to the input handle (top) of another

3. **Generate Content** - Configure your LLM node with provider and model, then click "Generate"

4. **Iterate** - Use evaluation nodes (Phase 2) to refine content through multiple iterations

## Tech Stack

### Frontend
- React 19
- TypeScript
- React Flow (node-based UI)
- TipTap (rich text editor)
- Vite (build tool)

### Backend
- Node.js
- Express
- TypeScript
- OpenAI SDK
- Anthropic SDK

## Development Roadmap

### ✅ Phase 1 (Current)
- Core canvas with React Flow
- Context, LLM, Content, and Prompt View nodes
- OpenAI and Anthropic provider integration
- SSE streaming
- Anonymous session management
- Basic persistence (localStorage)

### 🔄 Phase 2 (Next)
- Evaluation nodes (Rubric & AI Analysis)
- Cross-LLM evaluation workflows
- Database persistence (PostgreSQL)
- Enhanced iteration support
- Visual history and versioning

### 📋 Phase 3 (Future)
- Extensible node SDK
- Custom node support
- Rate limiting
- Undo/redo
- Enhanced UX (context menus, alignment guides)
- Collaboration infrastructure (WebSockets, Y.js)

## Contributing

This is currently in active development. Phase 1 implementation is in progress.

## License

Private - All rights reserved
