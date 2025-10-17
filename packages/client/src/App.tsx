import { useCallback, useState, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import type { Connection, NodeTypes } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './App.css';

import { ContextNode } from './components/nodes/ContextNode';
import { LLMNode } from './components/nodes/LLMNode';
import { ContentNode } from './components/nodes/ContentNode';
import { PromptViewNode } from './components/nodes/PromptViewNode';
import { AudienceProfileNode } from './components/nodes/AudienceProfileNode';
import { BrandVoiceNode } from './components/nodes/BrandVoiceNode';
import { ContentStandardsNode } from './components/nodes/ContentStandardsNode';
import { CoreMessageNode } from './components/nodes/CoreMessageNode';
import type { CustomNode, CustomEdge } from './types/nodes';
import { saveFlow, loadFlow, clearFlow } from './utils/storage';

const nodeTypes: NodeTypes = {
  context: ContextNode,
  llm: LLMNode,
  content: ContentNode,
  promptView: PromptViewNode,
  audienceProfile: AudienceProfileNode,
  brandVoice: BrandVoiceNode,
  contentStandards: ContentStandardsNode,
  coreMessage: CoreMessageNode,
};

const initialNodes: CustomNode[] = [];
const initialEdges: CustomEdge[] = [];

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeId, setNodeId] = useState(1);
  const [lastPosition, setLastPosition] = useState({ x: 100, y: 100 });

  // Load saved flow on mount
  useEffect(() => {
    const saved = loadFlow();
    if (saved) {
      setNodes(saved.nodes);
      setEdges(saved.edges);
      // Set next ID to be max of existing IDs + 1
      const maxId = saved.nodes.reduce((max, node) => {
        const match = node.id.match(/-(\d+)$/);
        const num = match ? parseInt(match[1], 10) : 0;
        return Math.max(max, num);
      }, 0);
      setNodeId(maxId + 1);
    }
  }, [setNodes, setEdges]);

  // Auto-save whenever nodes or edges change
  useEffect(() => {
    if (nodes.length > 0 || edges.length > 0) {
      saveFlow({ nodes, edges });
    }
  }, [nodes, edges]);

  const isValidConnection = useCallback(
    (connection: Connection) => {
      // Only prevent self-connections - allow everything else
      return connection.source !== connection.target;
    },
    []
  );

  const onConnect = useCallback(
    (params: Connection) => {
      if (isValidConnection(params)) {
        setEdges((eds) => addEdge(params, eds));
      }
    },
    [setEdges, isValidConnection]
  );

  const addNode = useCallback(
    (type: string) => {
      const id = `${type}-${nodeId}`;

      // Smart positioning: cascade right and down
      const newPosition = {
        x: lastPosition.x + 300,
        y: lastPosition.y + 50,
      };

      const newNode: CustomNode = {
        id,
        type,
        position: newPosition,
        data: getDefaultNodeData(type),
      };

      setNodes((nds) => [...nds, newNode]);
      setNodeId((id) => id + 1);
      setLastPosition(newPosition);
    },
    [nodeId, setNodes, lastPosition]
  );

  const handleClear = useCallback(() => {
    if (confirm('Clear all nodes and start fresh?')) {
      setNodes([]);
      setEdges([]);
      clearFlow();
      setLastPosition({ x: 100, y: 100 }); // Reset positioning
    }
  }, [setNodes, setEdges]);

  const handleSave = useCallback(() => {
    saveFlow({ nodes, edges });
    alert('Flow saved!');
  }, [nodes, edges]);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <div style={{ position: 'absolute', top: 10, left: 10, right: 10, zIndex: 4, display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '6px', padding: '8px 12px', background: 'rgba(0,0,0,0.85)', borderRadius: '8px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
          {/* Context Sources */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '9px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px', marginRight: '2px' }}>Context</span>
            <button onClick={() => addNode('audienceProfile')} style={{ background: 'rgba(74, 144, 226, 0.15)', color: '#4A90E2', border: '1px solid rgba(74, 144, 226, 0.3)', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
              👥 Audience
            </button>
            <button onClick={() => addNode('brandVoice')} style={{ background: 'rgba(155, 89, 182, 0.15)', color: '#9B59B6', border: '1px solid rgba(155, 89, 182, 0.3)', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
              🎨 Brand Voice
            </button>
            <button onClick={() => addNode('contentStandards')} style={{ background: 'rgba(39, 174, 96, 0.15)', color: '#27AE60', border: '1px solid rgba(39, 174, 96, 0.3)', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
              ✓ Standards
            </button>
            <button onClick={() => addNode('coreMessage')} style={{ background: 'rgba(230, 126, 34, 0.15)', color: '#E67E22', border: '1px solid rgba(230, 126, 34, 0.3)', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
              💬 Message
            </button>
          </div>

          <div style={{ width: '1px', height: '28px', background: 'rgba(255,255,255,0.1)', margin: '0 4px' }} />

          {/* Generator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '9px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px', marginRight: '2px' }}>Generate</span>
            <button onClick={() => addNode('llm')} style={{ background: 'rgba(155, 89, 182, 0.15)', color: '#9B59B6', border: '1px solid rgba(155, 89, 182, 0.3)', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
              🤖 LLM
            </button>
          </div>

          <div style={{ width: '1px', height: '28px', background: 'rgba(255,255,255,0.1)', margin: '0 4px' }} />

          {/* Output & Views */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '9px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px', marginRight: '2px' }}>Output</span>
            <button onClick={() => addNode('content')} style={{ background: 'rgba(39, 174, 96, 0.15)', color: '#27AE60', border: '1px solid rgba(39, 174, 96, 0.3)', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
              📄 Content
            </button>
            <button onClick={() => addNode('promptView')} style={{ background: 'rgba(230, 126, 34, 0.15)', color: '#E67E22', border: '1px solid rgba(230, 126, 34, 0.3)', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
              👁️ Prompt View
            </button>
          </div>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
          <button onClick={handleSave} style={{ background: 'rgba(39, 174, 96, 0.2)', color: '#27AE60', border: '1px solid rgba(39, 174, 96, 0.4)', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
            💾 Save
          </button>
          <button onClick={handleClear} style={{ background: 'rgba(231, 76, 60, 0.2)', color: '#E74C3C', border: '1px solid rgba(231, 76, 60, 0.4)', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
            🗑️ Clear
          </button>
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}

function getDefaultNodeData(type: string): any {
  switch (type) {
    case 'context':
      return {
        label: 'Context',
        contextType: 'tone',
        value: '',
      };
    case 'llm':
      return {
        label: 'LLM',
        provider: 'openai',
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 2000,
        status: 'idle',
      };
    case 'content':
      return {
        label: 'Content',
        content: '',
      };
    case 'promptView':
      return {
        label: 'Prompt View',
        prompt: '',
      };
    case 'audienceProfile':
      return {
        label: 'Audience Profile',
        status: 'empty',
      };
    case 'brandVoice':
      return {
        label: 'Brand Voice',
        status: 'empty',
      };
    case 'contentStandards':
      return {
        label: 'Content Standards',
        status: 'empty',
      };
    case 'coreMessage':
      return {
        label: 'Core Message',
        status: 'empty',
      };
    default:
      return { label: 'Unknown' };
  }
}

export default App;
