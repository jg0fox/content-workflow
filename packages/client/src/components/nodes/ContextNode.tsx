import { memo } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import type { Node } from '@xyflow/react';
import type { ContextNodeData } from '../../types/nodes';

export const ContextNode = memo(({ data, id }: Node<ContextNodeData>) => {
  const { setNodes } = useReactFlow();

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, contextType: e.target.value } as ContextNodeData }
          : node
      )
    );
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, value: e.target.value } as ContextNodeData }
          : node
      )
    );
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'tone': return 'Tone';
      case 'audience': return 'Audience';
      case 'styleGuide': return 'Style Guide';
      case 'userScenario': return 'User Scenario';
      default: return 'Context';
    }
  };

  return (
    <div
      style={{
        padding: '12px',
        borderRadius: '12px',
        border: '2px solid #4A90E2',
        background: '#2a2a2a',
        minWidth: '280px',
        maxWidth: '320px',
        color: '#e0e0e0',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
        }}
      >
        <div style={{ fontWeight: 'bold', color: '#4A90E2', fontSize: '14px' }}>
          📝 Context
        </div>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ fontSize: '11px', color: '#999', display: 'block', marginBottom: '4px' }}>
          Context Type:
        </label>
        <select
          value={data.contextType}
          onChange={handleTypeChange}
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
          <option value="tone">Tone</option>
          <option value="audience">Audience</option>
          <option value="styleGuide">Style Guide</option>
          <option value="userScenario">User Scenario</option>
        </select>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '4px',
            fontSize: '11px',
            color: '#999',
          }}
        >
          <span>{getTypeLabel(data.contextType)} Description</span>
          <span style={{ fontSize: '10px', color: '#666' }}>
            {data.value?.length || 0} chars
          </span>
        </label>
        <textarea
          value={data.value}
          onChange={handleValueChange}
          placeholder={`Describe the ${getTypeLabel(data.contextType).toLowerCase()} for your content...`}
          className="nodrag"
          style={{
            width: '100%',
            minHeight: '80px',
            padding: '8px',
            background: '#1a1a1a',
            border: '1px solid #444',
            borderRadius: '4px',
            color: '#e0e0e0',
            fontSize: '12px',
            fontFamily: 'inherit',
            resize: 'vertical',
            lineHeight: '1.5',
          }}
        />
      </div>

      <Handle type="source" position={Position.Right} id="context-out" style={{ background: '#4A90E2' }} />
    </div>
  );
});

ContextNode.displayName = 'ContextNode';
