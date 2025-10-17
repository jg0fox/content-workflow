import { memo, useState } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import type { Node } from '@xyflow/react';
import type { CoreMessageNodeData } from '../../types/nodes';
import type { CoreMessageInput } from '../../types/contentJourney';
import { messageExamples } from '../../data/contentJourneyPresets';

export const CoreMessageNode = memo(({ data, id }: Node<CoreMessageNodeData>) => {
  const { setNodes } = useReactFlow();
  const [showExamples, setShowExamples] = useState(false);

  const handleExampleSelect = (exampleId: string) => {
    const example = messageExamples.find((ex) => ex.id === exampleId);
    if (example) {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  message: {
                    message: example.message,
                    context: example.context,
                  },
                  selectedExampleId: exampleId,
                  status: 'configured',
                } as CoreMessageNodeData,
              }
            : node
        )
      );
      setShowExamples(false);
    }
  };

  const updateMessage = (updates: Partial<CoreMessageInput>) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                message: { ...data.message, ...updates } as CoreMessageInput,
                status: 'configured',
                selectedExampleId: undefined, // Clear example selection on manual edit
              } as CoreMessageNodeData,
            }
          : node
      )
    );
  };

  const getStatusColor = () => {
    switch (data.status) {
      case 'configured':
        return '#27AE60';
      case 'connected':
        return '#E67E22';
      default:
        return '#666';
    }
  };

  const messageLength = data.message?.message?.length || 0;
  const wordCount = data.message?.message
    ? data.message.message.trim().split(/\s+/).length
    : 0;
  const sentenceCount = data.message?.message
    ? (data.message.message.match(/[.!?]+/g) || []).length
    : 0;

  const isValid = messageLength >= 10;

  return (
    <div
      style={{
        padding: '12px',
        borderRadius: '12px',
        border: `2px solid ${isValid ? '#E67E22' : '#666'}`,
        background: '#2a2a2a',
        minWidth: '300px',
        maxWidth: '360px',
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
        <div style={{ fontWeight: 'bold', color: '#E67E22', fontSize: '14px' }}>
          💬 Core Message
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

      {/* Example Selector Toggle */}
      <button
        onClick={() => setShowExamples(!showExamples)}
        className="nodrag"
        style={{
          width: '100%',
          padding: '6px',
          marginBottom: '8px',
          borderRadius: '4px',
          border: '1px solid #444',
          background: '#333',
          color: '#E67E22',
          cursor: 'pointer',
          fontSize: '11px',
          fontWeight: '600',
        }}
      >
        {showExamples ? '✕ Hide Examples' : data.message?.message ? '📋 Load Different Example' : '📋 Load Example Message'}
      </button>

      {/* Examples List */}
      {showExamples && (
        <div
          style={{
            marginBottom: '12px',
            maxHeight: '200px',
            overflowY: 'auto',
            border: '1px solid #444',
            borderRadius: '4px',
            background: '#1a1a1a',
          }}
        >
          {messageExamples.map((example) => (
            <button
              key={example.id}
              onClick={() => handleExampleSelect(example.id)}
              className="nodrag"
              style={{
                width: '100%',
                padding: '8px',
                background:
                  data.selectedExampleId === example.id ? '#2a2520' : 'transparent',
                border: 'none',
                borderBottom: '1px solid #333',
                color: '#e0e0e0',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '11px',
              }}
            >
              <div style={{ fontWeight: '600', marginBottom: '2px', color: '#E67E22' }}>
                {example.title}
              </div>
              <div
                style={{
                  fontSize: '10px',
                  color: '#999',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {example.message}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Message Input */}
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
          <span>Message {!isValid && <span style={{ color: '#E74C3C' }}>*</span>}</span>
          <span style={{ fontSize: '10px', color: messageLength < 10 ? '#E74C3C' : '#666' }}>
            {messageLength} chars
          </span>
        </label>
        <textarea
          value={data.message?.message || ''}
          onChange={(e) => updateMessage({ message: e.target.value })}
          placeholder="Enter your core message (min 10 characters)..."
          className="nodrag"
          style={{
            width: '100%',
            minHeight: '80px',
            padding: '8px',
            background: '#1a1a1a',
            border: `1px solid ${isValid ? '#444' : '#E74C3C'}`,
            borderRadius: '4px',
            color: '#e0e0e0',
            fontSize: '12px',
            fontFamily: 'inherit',
            resize: 'vertical',
            lineHeight: '1.5',
          }}
        />
        {!isValid && messageLength > 0 && (
          <div style={{ fontSize: '10px', color: '#E74C3C', marginTop: '4px' }}>
            Message must be at least 10 characters
          </div>
        )}
      </div>

      {/* Context Input */}
      <div style={{ marginBottom: '12px' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '4px',
            fontSize: '11px',
            color: '#999',
          }}
        >
          Context (Optional)
        </label>
        <textarea
          value={data.message?.context || ''}
          onChange={(e) => updateMessage({ context: e.target.value })}
          placeholder="Add situational context (e.g., user behavior, timing, etc.)..."
          className="nodrag"
          style={{
            width: '100%',
            minHeight: '60px',
            padding: '8px',
            background: '#1a1a1a',
            border: '1px solid #444',
            borderRadius: '4px',
            color: '#e0e0e0',
            fontSize: '11px',
            fontFamily: 'inherit',
            resize: 'vertical',
            lineHeight: '1.4',
          }}
        />
      </div>

      {/* Stats */}
      {isValid && (
        <div
          style={{
            padding: '8px',
            background: '#1a1a1a',
            borderRadius: '4px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '8px',
            fontSize: '10px',
            color: '#666',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: '600', color: '#E67E22' }}>{messageLength}</div>
            <div>characters</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: '600', color: '#E67E22' }}>{wordCount}</div>
            <div>words</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: '600', color: '#E67E22' }}>{sentenceCount}</div>
            <div>sentences</div>
          </div>
        </div>
      )}

      {/* Selected Example Badge */}
      {data.selectedExampleId && (
        <div
          style={{
            marginTop: '8px',
            padding: '4px 8px',
            background: '#2a2520',
            borderRadius: '4px',
            fontSize: '10px',
            color: '#E67E22',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>
            📋 {messageExamples.find((ex) => ex.id === data.selectedExampleId)?.title}
          </span>
          <button
            onClick={() => {
              setNodes((nds) =>
                nds.map((node) =>
                  node.id === id
                    ? {
                        ...node,
                        data: {
                          ...node.data,
                          selectedExampleId: undefined,
                        } as CoreMessageNodeData,
                      }
                    : node
                )
              );
            }}
            className="nodrag"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#E67E22',
              cursor: 'pointer',
              padding: '0 4px',
              fontSize: '12px',
            }}
          >
            ✕
          </button>
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        id="message-out"
        style={{ background: '#E67E22' }}
      />
    </div>
  );
});

CoreMessageNode.displayName = 'CoreMessageNode';
