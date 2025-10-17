import { memo, useState } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import type { Node } from '@xyflow/react';
import type { LLMNodeData } from '../../types/nodes';
import { generateStream } from '../../utils/api';
import { collectContextNodes, assemblePrompt } from '../../utils/promptAssembly';

export const LLMNode = memo(({ data, id }: Node<LLMNodeData>) => {
  const { setNodes, getNodes, getEdges } = useReactFlow();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);

    // Update node status
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, status: 'generating', output: '' } as LLMNodeData }
          : node
      )
    );

    try {
      // Collect context from upstream nodes
      const nodes = getNodes();
      const edges = getEdges();
      const contextNodes = collectContextNodes(id, nodes, edges);
      const { systemPrompt } = assemblePrompt(contextNodes);

      let fullOutput = '';

      await generateStream(
        {
          prompt: systemPrompt,
          provider: data.provider,
          model: data.model,
          temperature: data.temperature,
          maxTokens: data.maxTokens,
        },
        {
          onChunk: (text) => {
            fullOutput += text;
            setNodes((nds) =>
              nds.map((node) => {
                if (node.id === id) {
                  return { ...node, data: { ...node.data, output: fullOutput } as LLMNodeData };
                }
                return node;
              })
            );
          },
          onDone: () => {
            // Find connected Content nodes
            const edges = getEdges();
            const connectedContentNodes = edges
              .filter((edge) => edge.source === id)
              .map((edge) => edge.target);

            // Update LLM status and populate Content nodes in single pass
            setNodes((nds) =>
              nds.map((node) => {
                if (node.id === id) {
                  return { ...node, data: { ...node.data, status: 'done' } as LLMNodeData };
                }
                if (connectedContentNodes.includes(node.id) && node.type === 'content') {
                  return { ...node, data: { ...node.data, content: fullOutput } };
                }
                return node;
              })
            );

            setIsGenerating(false);
          },
          onError: (error) => {
            setNodes((nds) =>
              nds.map((node) =>
                node.id === id
                  ? { ...node, data: { ...node.data, status: 'error', error } as LLMNodeData }
                  : node
              )
            );
            setIsGenerating(false);
          },
        }
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setNodes((nds) =>
        nds.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, status: 'error', error: errorMessage } as LLMNodeData }
            : node
        )
      );
      setIsGenerating(false);
    }
  };

  const getStatusColor = () => {
    switch (data.status) {
      case 'generating':
        return '#E67E22';
      case 'done':
        return '#27AE60';
      case 'error':
        return '#E74C3C';
      default:
        return '#666';
    }
  };

  return (
    <div
      style={{
        padding: '12px',
        borderRadius: '12px',
        border: '2px solid #9B59B6',
        background: '#2a2a2a',
        minWidth: '280px',
        maxWidth: '320px',
        color: '#e0e0e0',
      }}
    >
      <Handle type="target" position={Position.Left} id="context-in" style={{ background: '#9B59B6' }} />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
        }}
      >
        <div style={{ fontWeight: 'bold', color: '#9B59B6', fontSize: '14px' }}>
          🤖 LLM Generator
        </div>
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: getStatusColor(),
          }}
        />
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ fontSize: '11px', color: '#999', display: 'block', marginBottom: '4px' }}>
          Provider:
        </label>
        <select
          value={data.provider}
          onChange={(e) => {
            const newProvider = e.target.value as 'openai' | 'anthropic';
            const defaultModel = newProvider === 'openai' ? 'gpt-4' : 'claude-3-5-sonnet-20241022';
            setNodes((nds) =>
              nds.map((node) =>
                node.id === id
                  ? { ...node, data: { ...node.data, provider: newProvider, model: defaultModel } as LLMNodeData }
                  : node
              )
            );
          }}
          className="nodrag"
          style={{
            width: '100%',
            padding: '6px',
            borderRadius: '4px',
            border: '1px solid #444',
            background: '#1a1a1a',
            color: '#e0e0e0',
            fontSize: '12px',
          }}
        >
          <option value="openai">OpenAI</option>
          <option value="anthropic">Anthropic</option>
        </select>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ fontSize: '11px', color: '#999', display: 'block', marginBottom: '4px' }}>
          Model:
        </label>
        <select
          value={data.model}
          onChange={(e) => {
            setNodes((nds) =>
              nds.map((node) =>
                node.id === id
                  ? { ...node, data: { ...node.data, model: e.target.value } as LLMNodeData }
                  : node
              )
            );
          }}
          className="nodrag"
          style={{
            width: '100%',
            padding: '6px',
            borderRadius: '4px',
            border: '1px solid #444',
            background: '#1a1a1a',
            color: '#e0e0e0',
            fontSize: '12px',
          }}
        >
          {data.provider === 'openai' ? (
            <>
              <option value="gpt-4">GPT-4</option>
              <option value="gpt-4-turbo">GPT-4 Turbo</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            </>
          ) : (
            <>
              <option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet</option>
              <option value="claude-3-opus-20240229">Claude 3 Opus</option>
              <option value="claude-3-sonnet-20240229">Claude 3 Sonnet</option>
            </>
          )}
        </select>
      </div>

      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="nodrag"
        style={{
          width: '100%',
          padding: '8px',
          borderRadius: '4px',
          border: '1px solid #9B59B6',
          background: isGenerating ? '#333' : '#9B59B6',
          color: 'white',
          cursor: isGenerating ? 'not-allowed' : 'pointer',
          fontSize: '12px',
          fontWeight: '600',
          transition: 'all 0.2s ease',
        }}
      >
        {isGenerating ? '⏳ Generating...' : '▶ Generate Content'}
      </button>

      {data.status === 'error' && (
        <div
          style={{
            marginTop: '12px',
            padding: '8px',
            background: '#2a1a1a',
            borderRadius: '4px',
            fontSize: '11px',
            color: '#E74C3C',
            border: '1px solid #E74C3C',
          }}
        >
          <div style={{ fontWeight: '600', marginBottom: '4px' }}>❌ Error</div>
          {data.error}
        </div>
      )}

      {data.output && (
        <div
          style={{
            marginTop: '12px',
            padding: '8px',
            background: '#1a1a1a',
            borderRadius: '4px',
            fontSize: '11px',
            color: '#999',
            maxHeight: '100px',
            overflow: 'auto',
            lineHeight: '1.4',
          }}
        >
          <div style={{ fontWeight: '600', marginBottom: '4px', color: '#27AE60' }}>✓ Output Preview</div>
          {data.output.slice(0, 150)}
          {data.output.length > 150 && '...'}
        </div>
      )}

      <Handle type="source" position={Position.Right} id="content-out" style={{ background: '#9B59B6' }} />
    </div>
  );
});

LLMNode.displayName = 'LLMNode';
