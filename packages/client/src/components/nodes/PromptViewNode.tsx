import { memo, useEffect, useMemo, useState } from 'react';
import { Handle, Position, useReactFlow, useNodes, useEdges } from '@xyflow/react';
import type { Node } from '@xyflow/react';
import type { PromptViewNodeData } from '../../types/nodes';
import { collectContextNodes, assemblePrompt } from '../../utils/promptAssembly';

export const PromptViewNode = memo(({ data, id }: Node<PromptViewNodeData>) => {
  const { setNodes } = useReactFlow();
  const nodes = useNodes();
  const edges = useEdges();
  const [isExpanded, setIsExpanded] = useState(false);

  // Compute the prompt from connected nodes
  const computedPrompt = useMemo(() => {
    // Check if this node is connected to any upstream nodes
    const incomingEdges = edges.filter((e) => e.target === id);

    if (incomingEdges.length === 0) {
      return ''; // No connections
    }

    // If connected to an LLM node, show what that LLM will use
    const connectedLLMNodes = incomingEdges
      .map((e) => nodes.find((n) => n.id === e.source))
      .filter((n) => n?.type === 'llm');

    if (connectedLLMNodes.length > 0) {
      // Show the prompt that the first connected LLM node will use
      const llmNodeId = connectedLLMNodes[0]!.id;
      const contextNodes = collectContextNodes(llmNodeId, nodes, edges);
      const { systemPrompt } = assemblePrompt(contextNodes);
      return systemPrompt;
    }

    // Otherwise, collect context nodes connected to this Prompt View
    const contextNodes = collectContextNodes(id, nodes, edges);
    const { systemPrompt } = assemblePrompt(contextNodes);
    return systemPrompt;
  }, [id, nodes, edges]);

  // Update node data when computed prompt changes
  useEffect(() => {
    if (computedPrompt !== data.prompt) {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, prompt: computedPrompt } as PromptViewNodeData }
            : node
        )
      );
    }
  }, [computedPrompt, data.prompt, id, setNodes]);

  const promptLineCount = computedPrompt.split('\n').length;
  const hasContent = computedPrompt.length > 0;

  return (
    <div
      style={{
        padding: '12px',
        borderRadius: '12px',
        border: '2px solid #E67E22',
        background: '#2a2a2a',
        width: isExpanded ? '600px' : '400px',
        color: '#e0e0e0',
        transition: 'width 0.3s ease',
      }}
    >
      <Handle type="target" position={Position.Left} id="prompt-in" style={{ background: '#E67E22' }} />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
        }}
      >
        <div style={{ fontWeight: 'bold', color: '#E67E22', fontSize: '14px' }}>
          👁️ Prompt View
        </div>
        {hasContent && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="nodrag"
            style={{
              padding: '4px 12px',
              borderRadius: '4px',
              border: '1px solid #E67E22',
              background: isExpanded ? '#E67E22' : 'transparent',
              color: isExpanded ? 'white' : '#E67E22',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: '600',
              transition: 'all 0.2s ease',
            }}
          >
            {isExpanded ? '◀ Collapse' : '▶ Expand'}
          </button>
        )}
      </div>

      {hasContent && (
        <div
          style={{
            marginBottom: '8px',
            fontSize: '11px',
            color: '#999',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>{promptLineCount} lines</span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(computedPrompt);
            }}
            className="nodrag"
            style={{
              padding: '2px 8px',
              borderRadius: '4px',
              border: '1px solid #666',
              background: 'transparent',
              color: '#999',
              cursor: 'pointer',
              fontSize: '10px',
            }}
          >
            📋 Copy
          </button>
        </div>
      )}

      <div
        className="nodrag nowheel"
        style={{
          padding: '12px',
          background: '#1a1a1a',
          borderRadius: '4px',
          fontSize: '12px',
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap',
          maxHeight: isExpanded ? '1200px' : '300px',
          minHeight: isExpanded ? '400px' : '200px',
          overflow: 'auto',
          overflowY: 'scroll',
          color: '#e0e0e0',
          lineHeight: '1.5',
          border: '1px solid #333',
          transition: 'max-height 0.3s ease, min-height 0.3s ease',
          cursor: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
        onMouseEnter={(e) => {
          // Prevent React Flow from capturing scroll events
          e.currentTarget.style.pointerEvents = 'auto';
        }}
        onWheel={(e) => {
          // Stop propagation to prevent React Flow from handling
          e.stopPropagation();
        }}
        onTouchMove={(e) => {
          // Allow touch scrolling
          e.stopPropagation();
        }}
      >
        {computedPrompt || (
          <div style={{ color: '#666', fontStyle: 'italic', fontFamily: 'sans-serif' }}>
            Connect Content Journey nodes or Context nodes to see the assembled prompt...
          </div>
        )}
      </div>

      {isExpanded && hasContent && (
        <div
          style={{
            marginTop: '8px',
            padding: '6px 8px',
            background: '#1a2a1a',
            borderRadius: '4px',
            fontSize: '10px',
            color: '#27AE60',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span>✓</span>
          <span>Expanded view - showing full prompt</span>
        </div>
      )}
    </div>
  );
});

PromptViewNode.displayName = 'PromptViewNode';
