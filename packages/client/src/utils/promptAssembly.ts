import type {
  CustomNode,
  CustomEdge,
  ContextNodeData,
  AudienceProfileNodeData,
  BrandVoiceNodeData,
  ContentStandardsNodeData,
  CoreMessageNodeData
} from '../types/nodes';

export interface AssembledPrompt {
  systemPrompt: string;
  contexts: Array<{ type: string; value: string }>;
}

// Content Journey node types
const CONTENT_JOURNEY_NODE_TYPES = [
  'audienceProfile',
  'brandVoice',
  'contentStandards',
  'coreMessage'
];

/**
 * Traverse the graph backwards from a target node to collect all connected context nodes
 */
export function collectContextNodes(
  targetNodeId: string,
  nodes: CustomNode[],
  edges: CustomEdge[]
): CustomNode[] {
  const contextNodes: CustomNode[] = [];
  const visited = new Set<string>();

  function traverse(nodeId: string) {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);

    // Find all edges pointing to this node
    const incomingEdges = edges.filter((edge) => edge.target === nodeId);

    for (const edge of incomingEdges) {
      const sourceNode = nodes.find((n) => n.id === edge.source);
      if (!sourceNode) continue;

      // If it's a context node (legacy or Content Journey), collect it
      if (sourceNode.type === 'context' || CONTENT_JOURNEY_NODE_TYPES.includes(sourceNode.type)) {
        contextNodes.push(sourceNode);
      }

      // Recursively traverse upstream
      traverse(sourceNode.id);
    }
  }

  traverse(targetNodeId);
  return contextNodes;
}

/**
 * Assemble a system prompt from context nodes
 */
export function assemblePrompt(contextNodes: CustomNode[]): AssembledPrompt {
  const contexts: Array<{ type: string; value: string }> = [];
  let systemPrompt = 'You are a UX writing assistant. Generate appropriate UX content based on the following context:\n\n';

  // Separate Content Journey nodes from legacy context nodes
  const audienceNode = contextNodes.find((n) => n.type === 'audienceProfile');
  const brandVoiceNode = contextNodes.find((n) => n.type === 'brandVoice');
  const standardsNode = contextNodes.find((n) => n.type === 'contentStandards');
  const messageNode = contextNodes.find((n) => n.type === 'coreMessage');
  const legacyContextNodes = contextNodes.filter((n) => n.type === 'context');

  // Build Content Journey sections
  if (audienceNode) {
    const data = audienceNode.data as AudienceProfileNodeData;
    if (data.profile) {
      systemPrompt += '--- AUDIENCE PROFILE ---\n';
      systemPrompt += `Name: ${data.profile.name}\n\n`;

      systemPrompt += 'Demographics:\n';
      systemPrompt += `  Age: ${data.profile.demographics.ageRange}\n`;
      systemPrompt += `  Income: ${data.profile.demographics.income}\n`;
      systemPrompt += `  Education: ${data.profile.demographics.education}\n`;
      systemPrompt += `  Location: ${data.profile.demographics.location}\n\n`;

      if (data.profile.psychographics.values.length > 0) {
        systemPrompt += `Values: ${data.profile.psychographics.values.join(', ')}\n`;
      }
      if (data.profile.psychographics.interests.length > 0) {
        systemPrompt += `Interests: ${data.profile.psychographics.interests.join(', ')}\n`;
      }
      if (data.profile.psychographics.painPoints.length > 0) {
        systemPrompt += `Pain Points: ${data.profile.psychographics.painPoints.join(', ')}\n`;
      }
      if (data.profile.psychographics.goals.length > 0) {
        systemPrompt += `Goals: ${data.profile.psychographics.goals.join(', ')}\n`;
      }

      systemPrompt += `\nCommunication Style: ${data.profile.preferences.communicationStyle}\n`;
      systemPrompt += `Tech Savviness: ${data.profile.preferences.techSavviness}\n\n`;

      contexts.push({ type: 'Audience', value: data.profile.name });
    }
  }

  if (brandVoiceNode) {
    const data = brandVoiceNode.data as BrandVoiceNodeData;
    if (data.voice) {
      systemPrompt += '--- BRAND VOICE ---\n';

      if (data.voice.tone.length > 0) {
        systemPrompt += `Tone: ${data.voice.tone.join(', ')}\n`;
      }
      if (data.voice.style.length > 0) {
        systemPrompt += `Style: ${data.voice.style.join(', ')}\n`;
      }

      if (data.voice.personality) {
        systemPrompt += `\nPersonality: ${data.voice.personality}\n`;
      }

      if (data.voice.dos.length > 0) {
        systemPrompt += '\nDo:\n';
        data.voice.dos.forEach((item) => {
          systemPrompt += `  - ${item}\n`;
        });
      }

      if (data.voice.donts.length > 0) {
        systemPrompt += '\nDon\'t:\n';
        data.voice.donts.forEach((item) => {
          systemPrompt += `  - ${item}\n`;
        });
      }

      if (data.voice.vocabulary.preferred.length > 0) {
        systemPrompt += `\nPreferred Terms: ${data.voice.vocabulary.preferred.join(', ')}\n`;
      }
      if (data.voice.vocabulary.avoided.length > 0) {
        systemPrompt += `Avoided Terms: ${data.voice.vocabulary.avoided.join(', ')}\n`;
      }

      systemPrompt += '\n';
      contexts.push({ type: 'Brand Voice', value: data.voice.tone.join(', ') });
    }
  }

  if (standardsNode) {
    const data = standardsNode.data as ContentStandardsNodeData;
    if (data.standards) {
      systemPrompt += '--- CONTENT STANDARDS ---\n';

      if (data.standards.complianceRules.length > 0) {
        systemPrompt += 'Compliance:\n';
        data.standards.complianceRules.forEach((rule) => {
          systemPrompt += `  - ${rule}\n`;
        });
      }

      if (data.standards.styleGuideRules.length > 0) {
        systemPrompt += '\nStyle Guide:\n';
        data.standards.styleGuideRules.forEach((rule) => {
          systemPrompt += `  - ${rule}\n`;
        });
      }

      if (data.standards.accessibilityRequirements.length > 0) {
        systemPrompt += '\nAccessibility:\n';
        data.standards.accessibilityRequirements.forEach((req) => {
          systemPrompt += `  - ${req}\n`;
        });
      }

      if (data.standards.inclusivityGuidelines.length > 0) {
        systemPrompt += '\nInclusivity:\n';
        data.standards.inclusivityGuidelines.forEach((guide) => {
          systemPrompt += `  - ${guide}\n`;
        });
      }

      if (data.standards.plainLanguageRequirements) {
        systemPrompt += `\nPlain Language Required: Yes\n`;
      }
      if (data.standards.maxReadingLevel) {
        systemPrompt += `Maximum Reading Level: Grade ${data.standards.maxReadingLevel}\n`;
      }

      systemPrompt += '\n';
      contexts.push({ type: 'Standards', value: `Reading Level ${data.standards.maxReadingLevel}` });
    }
  }

  if (messageNode) {
    const data = messageNode.data as CoreMessageNodeData;
    if (data.message?.message) {
      systemPrompt += '--- CORE MESSAGE ---\n';
      systemPrompt += `${data.message.message}\n`;

      if (data.message.context) {
        systemPrompt += `\nContext: ${data.message.context}\n`;
      }

      systemPrompt += '\n';
      contexts.push({ type: 'Message', value: data.message.message.substring(0, 50) });
    }
  }

  // Add legacy context nodes
  for (const node of legacyContextNodes) {
    const data = node.data as ContextNodeData;
    if (data.value && data.value.trim()) {
      contexts.push({
        type: getContextLabel(data.contextType),
        value: data.value.trim(),
      });
      systemPrompt += `${getContextLabel(data.contextType)}: ${data.value.trim()}\n`;
    }
  }

  if (contexts.length === 0) {
    systemPrompt += 'No specific context provided. Generate general UX content.\n';
  }

  systemPrompt += '\nGenerate clear, concise, and user-friendly content that adheres to the context above.';

  return {
    systemPrompt,
    contexts,
  };
}

function getContextLabel(contextType: string): string {
  switch (contextType) {
    case 'tone':
      return 'Tone';
    case 'audience':
      return 'Audience';
    case 'styleGuide':
      return 'Style Guide';
    case 'userScenario':
      return 'User Scenario';
    default:
      return 'Context';
  }
}
