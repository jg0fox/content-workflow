import { memo, useState } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import type { Node } from '@xyflow/react';
import type { BrandVoiceNodeData } from '../../types/nodes';
import type { BrandVoice } from '../../types/contentJourney';
import { brandVoices } from '../../data/contentJourneyPresets';
import { CollapsibleSection } from '../shared/CollapsibleSection';
import { TagInput } from '../shared/TagInput';

export const BrandVoiceNode = memo(({ data, id }: Node<BrandVoiceNodeData>) => {
  const { setNodes } = useReactFlow();
  const [isEditing, setIsEditing] = useState(false);

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    let preset: BrandVoice | undefined;

    if (value === 'custom') {
      // Create empty custom voice
      preset = {
        tone: [],
        style: [],
        dos: [],
        donts: [],
        personality: '',
        vocabulary: {
          preferred: [],
          avoided: [],
        },
      };
    } else {
      const presetIndex = parseInt(value);
      preset = brandVoices[presetIndex];
    }

    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                voice: preset,
                selectedPresetId: value,
                status: 'configured',
              } as BrandVoiceNodeData,
            }
          : node
      )
    );
  };

  const updateVoice = (updates: Partial<BrandVoice>) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                voice: { ...data.voice, ...updates } as BrandVoice,
                status: 'configured',
              } as BrandVoiceNodeData,
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
        return '#9B59B6';
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
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
        }}
      >
        <div style={{ fontWeight: 'bold', color: '#9B59B6', fontSize: '14px' }}>
          🎨 Brand Voice
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

      {/* Preset Selector */}
      <div style={{ marginBottom: '12px' }}>
        <label style={{ fontSize: '11px', color: '#999', display: 'block', marginBottom: '4px' }}>
          Select Preset:
        </label>
        <select
          value={data.selectedPresetId || ''}
          onChange={handlePresetChange}
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
          <option value="">-- Select Brand Voice --</option>
          <option value="custom">✨ Custom (Start from Scratch)</option>
          {brandVoices.map((voice, index) => (
            <option key={index} value={index}>
              {voice.tone.slice(0, 3).join(', ')}
            </option>
          ))}
        </select>
      </div>

      {data.voice && (
        <>
          {/* Voice Preview */}
          <div
            style={{
              padding: '8px',
              background: '#1a1a1a',
              borderRadius: '4px',
              marginBottom: '8px',
              fontSize: '11px',
            }}
          >
            <strong>Tone:</strong> {data.voice.tone.slice(0, 2).join(', ')}
            {data.voice.tone.length > 2 && '...'}
          </div>

          {/* Edit Toggle */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="nodrag"
            style={{
              width: '100%',
              padding: '6px',
              marginBottom: '8px',
              borderRadius: '4px',
              border: '1px solid #444',
              background: isEditing ? '#9B59B6' : '#333',
              color: 'white',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: '600',
            }}
          >
            {isEditing ? '✓ Done Editing' : '✏️ Edit Voice'}
          </button>

          {isEditing ? (
            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {/* Tone & Style */}
              <CollapsibleSection title="Tone & Style" defaultExpanded>
                <TagInput
                  label="Tone"
                  tags={data.voice.tone}
                  onChange={(tone) => updateVoice({ tone })}
                  placeholder="Add tone..."
                />
                <TagInput
                  label="Style"
                  tags={data.voice.style}
                  onChange={(style) => updateVoice({ style })}
                  placeholder="Add style..."
                />
              </CollapsibleSection>

              {/* Best Practices */}
              <CollapsibleSection title="Dos & Don'ts">
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '11px', color: '#27AE60', display: 'block', marginBottom: '4px' }}>
                    ✓ Do:
                  </label>
                  {data.voice.dos.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '4px 6px',
                        background: '#1a2a1a',
                        borderRadius: '4px',
                        marginBottom: '4px',
                        fontSize: '11px',
                      }}
                    >
                      <span style={{ flex: 1 }}>{item}</span>
                      <button
                        onClick={() => {
                          const newDos = data.voice!.dos.filter((_, i) => i !== index);
                          updateVoice({ dos: newDos });
                        }}
                        className="nodrag"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#666',
                          cursor: 'pointer',
                          padding: '0 4px',
                          fontSize: '12px',
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <input
                    type="text"
                    placeholder="Add do..."
                    className="nodrag"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        updateVoice({ dos: [...data.voice!.dos, e.currentTarget.value.trim()] });
                        e.currentTarget.value = '';
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '4px',
                      background: '#1a1a1a',
                      border: '1px solid #444',
                      borderRadius: '4px',
                      color: '#e0e0e0',
                      fontSize: '11px',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: '#E74C3C', display: 'block', marginBottom: '4px' }}>
                    ✗ Don't:
                  </label>
                  {data.voice.donts.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '4px 6px',
                        background: '#2a1a1a',
                        borderRadius: '4px',
                        marginBottom: '4px',
                        fontSize: '11px',
                      }}
                    >
                      <span style={{ flex: 1 }}>{item}</span>
                      <button
                        onClick={() => {
                          const newDonts = data.voice!.donts.filter((_, i) => i !== index);
                          updateVoice({ donts: newDonts });
                        }}
                        className="nodrag"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#666',
                          cursor: 'pointer',
                          padding: '0 4px',
                          fontSize: '12px',
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <input
                    type="text"
                    placeholder="Add don't..."
                    className="nodrag"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        updateVoice({ donts: [...data.voice!.donts, e.currentTarget.value.trim()] });
                        e.currentTarget.value = '';
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '4px',
                      background: '#1a1a1a',
                      border: '1px solid #444',
                      borderRadius: '4px',
                      color: '#e0e0e0',
                      fontSize: '11px',
                    }}
                  />
                </div>
              </CollapsibleSection>

              {/* Personality */}
              <CollapsibleSection title="Personality">
                <textarea
                  value={data.voice.personality}
                  onChange={(e) => updateVoice({ personality: e.target.value })}
                  className="nodrag"
                  placeholder="Describe the brand personality..."
                  style={{
                    width: '100%',
                    minHeight: '60px',
                    padding: '6px',
                    background: '#1a1a1a',
                    border: '1px solid #444',
                    borderRadius: '4px',
                    color: '#e0e0e0',
                    fontSize: '11px',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                  }}
                />
              </CollapsibleSection>

              {/* Vocabulary */}
              <CollapsibleSection title="Vocabulary">
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '11px', color: '#27AE60', display: 'block', marginBottom: '4px' }}>
                    Preferred Terms:
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '4px' }}>
                    {data.voice.vocabulary.preferred.map((term, index) => (
                      <span
                        key={index}
                        style={{
                          padding: '2px 6px',
                          background: '#27AE60',
                          color: 'white',
                          borderRadius: '10px',
                          fontSize: '10px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '2px',
                        }}
                      >
                        {term}
                        <button
                          onClick={() => {
                            const newPreferred = data.voice!.vocabulary.preferred.filter((_, i) => i !== index);
                            updateVoice({
                              vocabulary: { ...data.voice!.vocabulary, preferred: newPreferred },
                            });
                          }}
                          className="nodrag"
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            padding: '0 2px',
                            fontSize: '12px',
                            lineHeight: '1',
                          }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Add preferred term..."
                    className="nodrag"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        updateVoice({
                          vocabulary: {
                            ...data.voice!.vocabulary,
                            preferred: [...data.voice!.vocabulary.preferred, e.currentTarget.value.trim()],
                          },
                        });
                        e.currentTarget.value = '';
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '4px',
                      background: '#1a1a1a',
                      border: '1px solid #444',
                      borderRadius: '4px',
                      color: '#e0e0e0',
                      fontSize: '11px',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: '#E74C3C', display: 'block', marginBottom: '4px' }}>
                    Avoided Terms:
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '4px' }}>
                    {data.voice.vocabulary.avoided.map((term, index) => (
                      <span
                        key={index}
                        style={{
                          padding: '2px 6px',
                          background: '#E74C3C',
                          color: 'white',
                          borderRadius: '10px',
                          fontSize: '10px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '2px',
                        }}
                      >
                        {term}
                        <button
                          onClick={() => {
                            const newAvoided = data.voice!.vocabulary.avoided.filter((_, i) => i !== index);
                            updateVoice({
                              vocabulary: { ...data.voice!.vocabulary, avoided: newAvoided },
                            });
                          }}
                          className="nodrag"
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            padding: '0 2px',
                            fontSize: '12px',
                            lineHeight: '1',
                          }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Add avoided term..."
                    className="nodrag"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        updateVoice({
                          vocabulary: {
                            ...data.voice!.vocabulary,
                            avoided: [...data.voice!.vocabulary.avoided, e.currentTarget.value.trim()],
                          },
                        });
                        e.currentTarget.value = '';
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '4px',
                      background: '#1a1a1a',
                      border: '1px solid #444',
                      borderRadius: '4px',
                      color: '#e0e0e0',
                      fontSize: '11px',
                    }}
                  />
                </div>
              </CollapsibleSection>
            </div>
          ) : (
            <div style={{ fontSize: '11px', color: '#666' }}>
              <div style={{ marginBottom: '4px' }}>
                <strong>Style:</strong> {data.voice.style.slice(0, 2).join(', ')}
              </div>
              <div>
                <strong>Personality:</strong> {data.voice.personality.slice(0, 60)}...
              </div>
            </div>
          )}
        </>
      )}

      <Handle
        type="source"
        position={Position.Right}
        id="brand-voice-out"
        style={{ background: '#9B59B6' }}
      />
    </div>
  );
});

BrandVoiceNode.displayName = 'BrandVoiceNode';
