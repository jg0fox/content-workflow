import { memo, useState } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import type { Node } from '@xyflow/react';
import type { AudienceProfileNodeData } from '../../types/nodes';
import type { AudienceProfile } from '../../types/contentJourney';
import { audienceProfiles } from '../../data/contentJourneyPresets';
import { CollapsibleSection } from '../shared/CollapsibleSection';
import { TagInput } from '../shared/TagInput';

export const AudienceProfileNode = memo(({ data, id }: Node<AudienceProfileNodeData>) => {
  const { setNodes } = useReactFlow();
  const [isEditing, setIsEditing] = useState(false);

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const presetId = e.target.value;

    let preset: AudienceProfile | undefined;

    if (presetId === 'custom') {
      // Create empty custom profile
      preset = {
        id: 'custom',
        name: 'Custom Audience',
        demographics: {
          ageRange: '',
          income: '',
          education: '',
          location: '',
        },
        psychographics: {
          values: [],
          interests: [],
          painPoints: [],
          goals: [],
        },
        preferences: {
          communicationStyle: '',
          techSavviness: '',
          decisionMakingFactors: [],
        },
      };
    } else {
      preset = audienceProfiles.find((p) => p.id === presetId);
    }

    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                profile: preset,
                selectedPresetId: presetId,
                status: 'configured',
              } as AudienceProfileNodeData,
            }
          : node
      )
    );
  };

  const updateProfile = (updates: Partial<AudienceProfile>) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                profile: { ...data.profile, ...updates } as AudienceProfile,
                status: 'configured',
              } as AudienceProfileNodeData,
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
        return '#4A90E2';
      default:
        return '#666';
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
          👥 Audience Profile
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
          <option value="">-- Select Audience --</option>
          <option value="custom">✨ Custom (Start from Scratch)</option>
          {audienceProfiles.map((profile) => (
            <option key={profile.id} value={profile.id}>
              {profile.name}
            </option>
          ))}
        </select>
      </div>

      {data.profile && (
        <>
          {/* Profile Name Display */}
          <div
            style={{
              padding: '8px',
              background: '#1a1a1a',
              borderRadius: '4px',
              marginBottom: '8px',
              fontSize: '13px',
              fontWeight: '600',
            }}
          >
            {data.profile.name}
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
              background: isEditing ? '#4A90E2' : '#333',
              color: 'white',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: '600',
            }}
          >
            {isEditing ? '✓ Done Editing' : '✏️ Edit Profile'}
          </button>

          {isEditing ? (
            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {/* Demographics */}
              <CollapsibleSection title="Demographics" defaultExpanded>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div>
                    <label style={{ fontSize: '10px', color: '#999' }}>Age Range:</label>
                    <input
                      type="text"
                      value={data.profile.demographics.ageRange}
                      onChange={(e) =>
                        updateProfile({
                          demographics: {
                            ...data.profile!.demographics,
                            ageRange: e.target.value,
                          },
                        })
                      }
                      className="nodrag"
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
                    <label style={{ fontSize: '10px', color: '#999' }}>Income:</label>
                    <input
                      type="text"
                      value={data.profile.demographics.income}
                      onChange={(e) =>
                        updateProfile({
                          demographics: {
                            ...data.profile!.demographics,
                            income: e.target.value,
                          },
                        })
                      }
                      className="nodrag"
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
                    <label style={{ fontSize: '10px', color: '#999' }}>Education:</label>
                    <input
                      type="text"
                      value={data.profile.demographics.education}
                      onChange={(e) =>
                        updateProfile({
                          demographics: {
                            ...data.profile!.demographics,
                            education: e.target.value,
                          },
                        })
                      }
                      className="nodrag"
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
                    <label style={{ fontSize: '10px', color: '#999' }}>Location:</label>
                    <input
                      type="text"
                      value={data.profile.demographics.location}
                      onChange={(e) =>
                        updateProfile({
                          demographics: {
                            ...data.profile!.demographics,
                            location: e.target.value,
                          },
                        })
                      }
                      className="nodrag"
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
                </div>
              </CollapsibleSection>

              {/* Psychographics */}
              <CollapsibleSection title="Psychographics">
                <TagInput
                  label="Values"
                  tags={data.profile.psychographics.values}
                  onChange={(values) =>
                    updateProfile({
                      psychographics: {
                        ...data.profile!.psychographics,
                        values,
                      },
                    })
                  }
                  placeholder="Add value..."
                />
                <TagInput
                  label="Interests"
                  tags={data.profile.psychographics.interests}
                  onChange={(interests) =>
                    updateProfile({
                      psychographics: {
                        ...data.profile!.psychographics,
                        interests,
                      },
                    })
                  }
                  placeholder="Add interest..."
                />
                <TagInput
                  label="Pain Points"
                  tags={data.profile.psychographics.painPoints}
                  onChange={(painPoints) =>
                    updateProfile({
                      psychographics: {
                        ...data.profile!.psychographics,
                        painPoints,
                      },
                    })
                  }
                  placeholder="Add pain point..."
                />
                <TagInput
                  label="Goals"
                  tags={data.profile.psychographics.goals}
                  onChange={(goals) =>
                    updateProfile({
                      psychographics: {
                        ...data.profile!.psychographics,
                        goals,
                      },
                    })
                  }
                  placeholder="Add goal..."
                />
              </CollapsibleSection>

              {/* Preferences */}
              <CollapsibleSection title="Preferences">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div>
                    <label style={{ fontSize: '10px', color: '#999' }}>Communication Style:</label>
                    <input
                      type="text"
                      value={data.profile.preferences.communicationStyle}
                      onChange={(e) =>
                        updateProfile({
                          preferences: {
                            ...data.profile!.preferences,
                            communicationStyle: e.target.value,
                          },
                        })
                      }
                      className="nodrag"
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
                    <label style={{ fontSize: '10px', color: '#999' }}>Tech Savviness:</label>
                    <input
                      type="text"
                      value={data.profile.preferences.techSavviness}
                      onChange={(e) =>
                        updateProfile({
                          preferences: {
                            ...data.profile!.preferences,
                            techSavviness: e.target.value,
                          },
                        })
                      }
                      className="nodrag"
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
                  <TagInput
                    label="Decision Making Factors"
                    tags={data.profile.preferences.decisionMakingFactors}
                    onChange={(decisionMakingFactors) =>
                      updateProfile({
                        preferences: {
                          ...data.profile!.preferences,
                          decisionMakingFactors,
                        },
                      })
                    }
                    placeholder="Add factor..."
                  />
                </div>
              </CollapsibleSection>
            </div>
          ) : (
            <div style={{ fontSize: '11px', color: '#666' }}>
              <div style={{ marginBottom: '4px' }}>
                <strong>Age:</strong> {data.profile.demographics.ageRange}
              </div>
              <div style={{ marginBottom: '4px' }}>
                <strong>Income:</strong> {data.profile.demographics.income}
              </div>
              <div>
                <strong>Values:</strong> {data.profile.psychographics.values.slice(0, 2).join(', ')}
                {data.profile.psychographics.values.length > 2 && '...'}
              </div>
            </div>
          )}
        </>
      )}

      <Handle
        type="source"
        position={Position.Right}
        id="audience-out"
        style={{ background: '#4A90E2' }}
      />
    </div>
  );
});

AudienceProfileNode.displayName = 'AudienceProfileNode';
