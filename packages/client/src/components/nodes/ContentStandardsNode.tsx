import { memo, useState } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import type { Node } from '@xyflow/react';
import type { ContentStandardsNodeData } from '../../types/nodes';
import type { ContentStandards } from '../../types/contentJourney';
import { contentStandards } from '../../data/contentJourneyPresets';
import { CollapsibleSection } from '../shared/CollapsibleSection';
import { ListEditor } from '../shared/ListEditor';

export const ContentStandardsNode = memo(({ data, id }: Node<ContentStandardsNodeData>) => {
  const { setNodes } = useReactFlow();
  const [isEditing, setIsEditing] = useState(false);

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    let preset: ContentStandards | undefined;

    if (value === 'custom') {
      // Create empty custom standards
      preset = {
        complianceRules: [],
        styleGuideRules: [],
        accessibilityRequirements: [],
        inclusivityGuidelines: [],
        plainLanguageRequirements: true,
        maxReadingLevel: 8,
      };
    } else {
      const presetIndex = parseInt(value);
      preset = contentStandards[presetIndex];
    }

    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                standards: preset,
                selectedPresetId: value,
                status: 'configured',
              } as ContentStandardsNodeData,
            }
          : node
      )
    );
  };

  const updateStandards = (updates: Partial<ContentStandards>) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                standards: { ...data.standards, ...updates } as ContentStandards,
                status: 'configured',
              } as ContentStandardsNodeData,
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
        return '#27AE60';
      default:
        return '#666';
    }
  };

  return (
    <div
      style={{
        padding: '12px',
        borderRadius: '12px',
        border: '2px solid #27AE60',
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
        <div style={{ fontWeight: 'bold', color: '#27AE60', fontSize: '14px' }}>
          ✓ Content Standards
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
          <option value="">-- Select Standards --</option>
          <option value="custom">✨ Custom (Start from Scratch)</option>
          {contentStandards.map((_, index) => (
            <option key={index} value={index}>
              {index === 0 ? 'Standard (Reading Level 8)' : 'Strict (Reading Level 10)'}
            </option>
          ))}
        </select>
      </div>

      {data.standards && (
        <>
          {/* Standards Preview */}
          <div
            style={{
              padding: '8px',
              background: '#1a1a1a',
              borderRadius: '4px',
              marginBottom: '8px',
              fontSize: '11px',
            }}
          >
            <div style={{ marginBottom: '4px' }}>
              <strong>Plain Language:</strong> {data.standards.plainLanguageRequirements ? 'Yes' : 'No'}
            </div>
            <div>
              <strong>Reading Level:</strong> Grade {data.standards.maxReadingLevel || 'N/A'}
            </div>
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
              background: isEditing ? '#27AE60' : '#333',
              color: 'white',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: '600',
            }}
          >
            {isEditing ? '✓ Done Editing' : '✏️ Edit Standards'}
          </button>

          {isEditing ? (
            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {/* Compliance Rules */}
              <CollapsibleSection title="Compliance Rules" defaultExpanded>
                <ListEditor
                  label="Legal & Regulatory Requirements"
                  items={data.standards.complianceRules}
                  onChange={(complianceRules) => updateStandards({ complianceRules })}
                  placeholder="Add compliance rule..."
                  itemColor="#2a2520"
                />
              </CollapsibleSection>

              {/* Style Guide Rules */}
              <CollapsibleSection title="Style Guide Rules">
                <ListEditor
                  label="Writing Style Requirements"
                  items={data.standards.styleGuideRules}
                  onChange={(styleGuideRules) => updateStandards({ styleGuideRules })}
                  placeholder="Add style rule..."
                  itemColor="#252a2a"
                />
              </CollapsibleSection>

              {/* Accessibility Requirements */}
              <CollapsibleSection title="Accessibility">
                <ListEditor
                  label="WCAG & Accessibility Standards"
                  items={data.standards.accessibilityRequirements}
                  onChange={(accessibilityRequirements) =>
                    updateStandards({ accessibilityRequirements })
                  }
                  placeholder="Add accessibility requirement..."
                  itemColor="#202a25"
                />
              </CollapsibleSection>

              {/* Inclusivity Guidelines */}
              <CollapsibleSection title="Inclusivity">
                <ListEditor
                  label="DEI & Inclusive Language Guidelines"
                  items={data.standards.inclusivityGuidelines}
                  onChange={(inclusivityGuidelines) => updateStandards({ inclusivityGuidelines })}
                  placeholder="Add inclusivity guideline..."
                  itemColor="#25202a"
                />
              </CollapsibleSection>

              {/* Plain Language & Reading Level */}
              <CollapsibleSection title="Readability Settings">
                <div style={{ marginBottom: '12px' }}>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={data.standards.plainLanguageRequirements}
                      onChange={(e) =>
                        updateStandards({ plainLanguageRequirements: e.target.checked })
                      }
                      className="nodrag"
                      style={{ cursor: 'pointer' }}
                    />
                    <span>Require Plain Language</span>
                  </label>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', color: '#999' }}>
                    Maximum Reading Level (Grade 1-12):
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={data.standards.maxReadingLevel || 8}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (value >= 1 && value <= 12) {
                        updateStandards({ maxReadingLevel: value });
                      }
                    }}
                    className="nodrag"
                    style={{
                      width: '100%',
                      padding: '6px',
                      background: '#1a1a1a',
                      border: '1px solid #444',
                      borderRadius: '4px',
                      color: '#e0e0e0',
                      fontSize: '12px',
                    }}
                  />
                  <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>
                    Grade {data.standards.maxReadingLevel || 8} ≈{' '}
                    {data.standards.maxReadingLevel && data.standards.maxReadingLevel <= 6
                      ? 'Elementary'
                      : data.standards.maxReadingLevel && data.standards.maxReadingLevel <= 8
                      ? 'Middle School'
                      : 'High School'}
                  </div>
                </div>
              </CollapsibleSection>
            </div>
          ) : (
            <div style={{ fontSize: '11px', color: '#666' }}>
              <div style={{ marginBottom: '4px' }}>
                <strong>Compliance:</strong> {data.standards.complianceRules.length} rules
              </div>
              <div style={{ marginBottom: '4px' }}>
                <strong>Style Rules:</strong> {data.standards.styleGuideRules.length} rules
              </div>
              <div style={{ marginBottom: '4px' }}>
                <strong>Accessibility:</strong> {data.standards.accessibilityRequirements.length}{' '}
                requirements
              </div>
              <div>
                <strong>Inclusivity:</strong> {data.standards.inclusivityGuidelines.length} guidelines
              </div>
            </div>
          )}
        </>
      )}

      <Handle
        type="source"
        position={Position.Right}
        id="standards-out"
        style={{ background: '#27AE60' }}
      />
    </div>
  );
});

ContentStandardsNode.displayName = 'ContentStandardsNode';
