# Content Workflow - Technical Overview

## Project Summary

**Content Workflow** is a node-based visual canvas application for UX content creation powered by Large Language Models (LLMs). It enables users to compose complex content generation workflows by connecting nodes that represent different stages of the content pipeline: context, LLM generation, content editing, and prompt visualization.

The application features a professional dark-themed interface inspired by Weavy, with intuitive left-to-right data flow, universal node connectivity, and real-time streaming generation from multiple LLM providers.

---

## Architecture Overview

### Tech Stack

**Frontend:**
- React 19 + TypeScript
- Vite (build tool)
- React Flow (@xyflow/react v12.3.5) - Node-based canvas UI
- TipTap + ProseMirror - Rich text editing
- CSS (custom dark theme)

**Backend:**
- Express + TypeScript
- Node.js with ESM modules
- OpenAI SDK (GPT-4, GPT-4-turbo, GPT-3.5-turbo)
- Anthropic SDK (Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Sonnet)
- Server-Sent Events (SSE) for streaming

**Project Structure:**
```
content-workflow/
├── packages/
│   ├── client/          # React frontend
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   └── nodes/    # Node component implementations
│   │   │   ├── types/        # TypeScript type definitions
│   │   │   ├── utils/        # Utility functions
│   │   │   ├── App.tsx       # Main React Flow canvas
│   │   │   └── App.css       # Dark theme styles
│   │   └── package.json
│   └── server/          # Express backend
│       ├── src/
│       │   ├── providers/    # LLM provider abstractions
│       │   ├── routes/       # API endpoints
│       │   └── index.ts      # Server entry point
│       ├── .env             # API keys (gitignored)
│       └── package.json
└── package.json         # Workspace root
```

---

## Core Features

### 1. Node-Based Visual Canvas

The application uses **React Flow** to provide an infinite canvas where users can:
- Create and position nodes
- Connect nodes to define data flow
- Drag nodes to rearrange workflows
- Pan and zoom the canvas

**Current Node Types:**

1. **Context Node** (Blue #4A90E2)
   - Provides contextual information to LLM nodes
   - Types: tone, audience, constraints, examples
   - Output: Right handle only
   - Location: `packages/client/src/components/nodes/ContextNode.tsx`

2. **LLM Node** (Purple #9B59B6)
   - Generates content using AI models
   - Providers: OpenAI, Anthropic
   - Input: Left handle (accepts context nodes)
   - Output: Right handle (sends to content nodes)
   - Features: Real-time streaming, model/temperature selection
   - Location: `packages/client/src/components/nodes/LLMNode.tsx`

3. **Content Node** (Green #27AE60)
   - Rich text editor powered by TipTap
   - Input: Left handle (accepts LLM output)
   - Output: Right handle (can chain to other nodes)
   - Features: Full markdown editing, paste support
   - Location: `packages/client/src/components/nodes/ContentNode.tsx`

4. **Prompt View Node** (Orange #E67E22)
   - Displays assembled prompts from connected context nodes
   - Input: Left handle only
   - Read-only visualization of what will be sent to LLMs
   - Location: `packages/client/src/components/nodes/PromptViewNode.tsx`

### 2. Connection System

**Handle Positioning (Weavy-inspired):**
- **Inputs**: Left side of nodes
- **Outputs**: Right side of nodes
- Creates intuitive left-to-right data flow

**Connection Rules:**
- Any node can connect to any other node (except self-loops)
- No type restrictions - maximum flexibility
- Visual feedback: Purple glowing bezier curves
- Animated dashes while dragging connections

**Implementation:** `packages/client/src/App.tsx:61-76`

### 3. Prompt Assembly System

When an LLM node generates content, it:
1. Traverses the graph to find all connected context nodes
2. Assembles them into a structured system prompt
3. Sends the prompt to the selected LLM provider
4. Streams the response back in real-time

**Graph Traversal Logic:** `packages/client/src/utils/promptAssembly.ts`

```typescript
export function collectContextNodes(
  targetNodeId: string,
  nodes: CustomNode[],
  edges: CustomEdge[]
): CustomNode[]
```

**Prompt Assembly Format:**
```
You are a UX content assistant. Use the following context:

**Tone**: [value from tone context node]
**Audience**: [value from audience context node]
**Constraints**: [value from constraints context node]
**Examples**: [value from examples context node]

Generate content based on this context.
```

### 4. LLM Provider System

**Provider Abstraction:** `packages/server/src/providers/`

Both OpenAI and Anthropic implement a common interface:

```typescript
interface LLMProvider {
  name: string;
  models: string[];
  generate(
    prompt: string,
    model: string,
    params: ModelParams
  ): AsyncIterable<string>;
}
```

**Supported Models:**

- **OpenAI**: gpt-4, gpt-4-turbo, gpt-3.5-turbo
- **Anthropic**: claude-3-5-sonnet-20241022, claude-3-opus-20240229, claude-3-sonnet-20240229

**Parameters:**
- Temperature (0-2, default 0.7)
- Max tokens (default 2000)

### 5. Server-Sent Events (SSE) Streaming

**Endpoint:** `POST /api/generate`

**Request Body:**
```json
{
  "sessionId": "uuid-v4",
  "prompt": "assembled system prompt",
  "model": "gpt-4",
  "provider": "openai",
  "params": {
    "temperature": 0.7,
    "maxTokens": 2000
  }
}
```

**Response Stream:**
```
data: {"type":"chunk","content":"Hello"}
data: {"type":"chunk","content":" world"}
data: {"type":"done"}
```

**Client-Side Handling:** `packages/client/src/components/nodes/LLMNode.tsx:106-165`

The LLM node:
1. Opens EventSource connection
2. Accumulates chunks in `fullOutput` state
3. Displays real-time preview
4. On completion, updates all connected Content nodes in a single `setNodes` call

**Critical Implementation Detail:** Multiple `setNodes` calls cause stale state closures. We consolidate all updates in the `onDone` callback to ensure content flows correctly.

### 6. State Management

**React Flow State:**
- `useNodesState` - Manages node positions, data, and updates
- `useEdgesState` - Manages connections between nodes
- Single source of truth for canvas state

**Persistence:**
- Auto-save to localStorage on every change
- Load saved flow on mount
- Manual save button available
- Clear button with confirmation

**Storage Location:** `packages/client/src/utils/storage.ts`

```typescript
export function saveFlow(flow: { nodes: CustomNode[]; edges: CustomEdge[] })
export function loadFlow(): { nodes: CustomNode[]; edges: CustomEdge[] } | null
export function clearFlow(): void
```

### 7. Smart Positioning System

New nodes automatically cascade right and down to prevent overlaps:

```typescript
const [lastPosition, setLastPosition] = useState({ x: 100, y: 100 });

const addNode = (type: string) => {
  const newPosition = {
    x: lastPosition.x + 300,  // 300px right
    y: lastPosition.y + 50,   // 50px down
  };
  // ... create node at newPosition
  setLastPosition(newPosition);
};
```

**Result:** Natural left-to-right workflow layout without manual positioning

---

## Data Flow Example

**Typical Workflow:**

1. User creates **Context Node** with tone: "Professional, friendly"
2. User creates **LLM Node** (OpenAI GPT-4)
3. User connects Context → LLM
4. User creates **Content Node**
5. User connects LLM → Content
6. User clicks "Generate" on LLM node

**What Happens:**

```
[Context Node] ---> [LLM Node] ---> [Content Node]
    |                   |                 |
  "tone:           1. Collects        3. Receives
professional"     context via           generated
                  graph traversal       content
                       |
                  2. Assembles:
                  "You are a UX
                  content assistant.
                  Tone: professional,
                  friendly..."
                       |
                  Sends to OpenAI
                  via SSE
                       |
                  Streams response
                  chunk by chunk
```

**Technical Flow:**

1. `LLMNode.handleGenerate()` called
2. `collectContextNodes(llmNodeId, nodes, edges)` traverses graph
3. `assemblePrompt(contextNodes)` creates system prompt
4. `POST /api/generate` initiates SSE stream
5. Server calls `openaiProvider.generate(prompt, model, params)`
6. OpenAI SDK streams chunks back
7. Server forwards chunks as SSE events
8. Client accumulates chunks in `fullOutput`
9. On stream completion, `onDone` callback fires
10. Single `setNodes` call updates LLM status + all connected Content nodes
11. Content node's `useEffect` detects data change, updates TipTap editor

---

## UI/UX Design

### Dark Theme (Weavy-Inspired)

**Color Palette:**
- Canvas: `#1a1a1a`
- Nodes: `#2a2a2a`
- Text: `#e0e0e0`
- Context accent: `#4A90E2` (blue)
- LLM accent: `#9B59B6` (purple)
- Content accent: `#27AE60` (green)
- Prompt View accent: `#E67E22` (orange)

**Visual Effects:**
- Rounded corners: 12px
- Elevation shadows on hover
- Handle scale 1.3x on hover with glow
- Purple bezier connections with drop shadow
- Smooth 200ms transitions
- Selected state: purple glow ring

**Styles Location:** `packages/client/src/App.css`

### Interaction Patterns

- **Node Creation:** Top-left toolbar with "+ Context", "+ LLM", "+ Content", "+ Prompt View"
- **Connection Creation:** Drag from output handle to input handle
- **Node Movement:** Click and drag node body
- **Canvas Navigation:** Pan by dragging background, zoom with mouse wheel/trackpad
- **Content Editing:** Click inside Content node to activate TipTap editor
- **Generation:** Click "Generate" button in LLM node, watch real-time streaming

---

## Type System

**Core Types:** `packages/client/src/types/nodes.ts`

```typescript
export type NodeType = 'context' | 'llm' | 'content' | 'promptView';

export interface ContextNodeData {
  label: string;
  contextType: 'tone' | 'audience' | 'constraints' | 'examples';
  value: string;
}

export interface LLMNodeData {
  label: string;
  provider: 'openai' | 'anthropic';
  model: string;
  temperature: number;
  maxTokens: number;
  status: 'idle' | 'generating' | 'done' | 'error';
  output?: string;
  error?: string;
}

export interface ContentNodeData {
  label: string;
  content: string;
}

export interface PromptViewNodeData {
  label: string;
  prompt: string;
}

export type CustomNode =
  | Node<ContextNodeData>
  | Node<LLMNodeData>
  | Node<ContentNodeData>
  | Node<PromptViewNodeData>;

export type CustomEdge = Edge;
```

---

## API Endpoints

**Base URL:** `http://localhost:3001/api`

### `POST /generate`

**Purpose:** Stream LLM-generated content via SSE

**Headers:**
- `Content-Type: application/json`

**Request:**
```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "prompt": "You are a UX content assistant. Tone: professional...",
  "model": "gpt-4",
  "provider": "openai",
  "params": {
    "temperature": 0.7,
    "maxTokens": 2000
  }
}
```

**Response:** SSE stream
```
data: {"type":"chunk","content":"Generated"}
data: {"type":"chunk","content":" text"}
data: {"type":"done"}
```

**Implementation:** `packages/server/src/routes/generate.ts`

---

## Environment Configuration

**Server Environment Variables:** `packages/server/.env`

```env
PORT=3001
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

**Loading Method:**
- Uses `tsx --env-file=.env` to load variables
- `dotenv.config()` with `fileURLToPath` for ESM compatibility

---

## Known Issues & Limitations

### Current Limitations

1. **No Database Persistence**
   - All data stored in browser localStorage
   - No cross-device sync
   - Limited to ~5-10MB storage

2. **Anonymous Sessions Only**
   - No user authentication
   - No session management beyond UUID
   - Cannot share workflows with others

3. **No Evaluation System**
   - Cannot compare outputs from different LLMs
   - No rubric-based scoring
   - No quality metrics

4. **No Rate Limiting**
   - Server-side rate limiting not implemented
   - Relies on API provider limits
   - No cost tracking

5. **No Undo/Redo**
   - Cannot revert changes
   - No history tracking

### Resolved Issues

✅ **Fixed:** LLM → Content data flow
- **Problem:** Multiple `setNodes` calls caused stale state
- **Solution:** Consolidated updates in single `setNodes` call

✅ **Fixed:** Confusing connection rules
- **Problem:** Restrictive validation made connections unpredictable
- **Solution:** Allow any → any connections (except self-loops)

✅ **Fixed:** Unclear handle positioning
- **Problem:** Top/bottom handles didn't indicate data flow direction
- **Solution:** Moved to left (input) / right (output) handles

---

## Development Setup

**Prerequisites:**
- Node.js 18+ with npm
- OpenAI API key
- Anthropic API key

**Installation:**
```bash
npm install  # Install all workspace dependencies
```

**Environment Setup:**
```bash
cd packages/server
cp .env.example .env
# Add your API keys to .env
```

**Development:**
```bash
# Terminal 1 - Start backend
cd packages/server
npm run dev

# Terminal 2 - Start frontend
cd packages/client
npm run dev
```

**Access:**
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

---

## Future Roadmap (Phase 2 & 3)

### Phase 2: Evaluation & Iteration (Not Yet Implemented)

- **Rubric Node:** Define evaluation criteria
- **AI Analysis Node:** Automated content scoring
- **Cross-LLM Evaluation:** Compare GPT-4 vs Claude outputs
- **Database Persistence:** PostgreSQL + Prisma
- **Rate Limiting:** Server-side enforcement

### Phase 3: Extensibility & Polish (Not Yet Implemented)

- **Custom Node Submission:** Community-contributed nodes
- **Undo/Redo:** Full history tracking
- **Workflow Templates:** Pre-built flows
- **Export/Import:** Share workflows as JSON
- **Collaboration:** Real-time multi-user editing

---

## Key Files Reference

### Frontend
- `packages/client/src/App.tsx` - Main canvas, node creation, connection handling
- `packages/client/src/App.css` - Dark theme, Weavy styling
- `packages/client/src/components/nodes/ContextNode.tsx` - Context input component
- `packages/client/src/components/nodes/LLMNode.tsx` - LLM generation component (critical SSE logic)
- `packages/client/src/components/nodes/ContentNode.tsx` - TipTap editor component
- `packages/client/src/components/nodes/PromptViewNode.tsx` - Prompt visualization
- `packages/client/src/utils/promptAssembly.ts` - Graph traversal & prompt building
- `packages/client/src/utils/storage.ts` - localStorage persistence
- `packages/client/src/types/nodes.ts` - TypeScript type definitions

### Backend
- `packages/server/src/index.ts` - Express server setup, environment loading
- `packages/server/src/routes/generate.ts` - SSE streaming endpoint
- `packages/server/src/providers/openai.ts` - OpenAI provider implementation
- `packages/server/src/providers/anthropic.ts` - Anthropic provider implementation
- `packages/server/.env` - API keys (gitignored)

---

## Integration Considerations

If you're looking to integrate new tools or features, here are the key integration points:

### Adding New Node Types

1. Create node component in `packages/client/src/components/nodes/`
2. Define data type in `packages/client/src/types/nodes.ts`
3. Register in `nodeTypes` object in `App.tsx`
4. Add to `getDefaultNodeData()` switch statement
5. Add toolbar button in `App.tsx`

### Adding New LLM Providers

1. Create provider class in `packages/server/src/providers/`
2. Implement `LLMProvider` interface with `generate()` method
3. Register in `packages/server/src/index.ts`
4. Add to dropdown in `LLMNode.tsx`

### Adding API Endpoints

1. Create route file in `packages/server/src/routes/`
2. Import and register in `packages/server/src/index.ts`
3. Add client-side fetch logic to relevant node component

### Extending Prompt Assembly

- Modify `packages/client/src/utils/promptAssembly.ts`
- Add new context types or assembly strategies
- Update `assemblePrompt()` function

---

## Questions to Consider for Integration

1. **What functionality does your tool provide?**
   - Does it generate content, analyze content, transform content?
   - Does it require API calls or local processing?

2. **How should it fit into the workflow?**
   - Should it be a new node type?
   - Should it enhance existing nodes?
   - Should it be a separate service that nodes can call?

3. **What inputs does it need?**
   - Text content from Content nodes?
   - Context from Context nodes?
   - Generated output from LLM nodes?
   - Custom parameters?

4. **What outputs does it produce?**
   - Modified content?
   - Analysis/scores?
   - Suggestions/alternatives?
   - Metadata?

5. **Does it require streaming or batch processing?**
   - Can we use SSE like the LLM nodes?
   - Or is it a single request/response?

6. **Does it need persistent state?**
   - Should results be saved to localStorage?
   - Does it need database backing?

---

## Contact & Context

This overview was created to facilitate integration discussions with other AI agents or team members. The codebase is fully functional with Phase 1 complete. The foundation is solid and extensible for adding new features.

**Current Status:** Phase 1 Complete ✅
**Next Phase:** Evaluation & Iteration (Phase 2)
**Architecture:** Monorepo with React Flow frontend + Express SSE backend
**Deployment:** Local development only (no production deployment yet)
