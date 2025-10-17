import type { Node, Edge } from '@xyflow/react';
import type {
  AudienceProfile,
  BrandVoice,
  ContentStandards,
  CoreMessageInput,
  ContentVariation,
  EvaluationResult,
  EvaluationCriteria,
  ToneAnalysisResult,
} from './contentJourney';

// Node data types
export interface BaseNodeData {
  label: string;
}

export interface ContextNodeData extends BaseNodeData {
  value: string;
  contextType: 'tone' | 'audience' | 'styleGuide' | 'userScenario';
}

export interface LLMNodeData extends BaseNodeData {
  provider: 'openai' | 'anthropic';
  model: string;
  temperature: number;
  maxTokens: number;
  status: 'idle' | 'generating' | 'done' | 'error';
  output?: string;
  error?: string;
}

export interface ContentNodeData extends BaseNodeData {
  content: string;
}

export interface PromptViewNodeData extends BaseNodeData {
  prompt: string;
}

export interface EvaluationNodeData extends BaseNodeData {
  type: 'rubric' | 'ai';
  scores?: Record<string, number>;
  feedback?: string;
  status?: 'idle' | 'analyzing' | 'done' | 'error';
}

// ============================================================================
// Content Journey Node Data Types
// ============================================================================

export interface AudienceProfileNodeData extends BaseNodeData {
  profile?: AudienceProfile;
  status: 'empty' | 'configured' | 'connected';
  selectedPresetId?: string;
}

export interface BrandVoiceNodeData extends BaseNodeData {
  voice?: BrandVoice;
  status: 'empty' | 'configured' | 'connected';
  selectedPresetId?: string;
}

export interface ContentStandardsNodeData extends BaseNodeData {
  standards?: ContentStandards;
  status: 'empty' | 'configured' | 'connected';
  selectedPresetId?: string;
}

export interface CoreMessageNodeData extends BaseNodeData {
  message?: CoreMessageInput;
  status: 'empty' | 'configured' | 'connected';
  selectedExampleId?: string;
}

export interface RubricEvaluatorNodeData extends BaseNodeData {
  scores?: EvaluationCriteria;
  evaluationResult?: EvaluationResult;
  additionalFeedback?: string;
  status: 'idle' | 'evaluating' | 'complete' | 'error';
  error?: string;
}

export interface ToneAnalyzerNodeData extends BaseNodeData {
  analysisResult?: ToneAnalysisResult;
  evaluationResult?: EvaluationResult;
  status: 'idle' | 'analyzing' | 'complete' | 'error';
  error?: string;
}

export interface ContentIteratorNodeData extends BaseNodeData {
  originalContent?: ContentVariation;
  improvedContent?: ContentVariation;
  improvementRationale?: string;
  customFeedback?: string;
  settings: {
    useEnhancedEngine: boolean;
    enableScoreGuidance: boolean;
    enableMethodOptimization: boolean;
    enablePredictiveImprovements: boolean;
  };
  status: 'idle' | 'iterating' | 'complete' | 'error';
  error?: string;
  versionNumber?: number;
}

// Union type for all node data
export type NodeData =
  | ContextNodeData
  | LLMNodeData
  | ContentNodeData
  | PromptViewNodeData
  | EvaluationNodeData
  | AudienceProfileNodeData
  | BrandVoiceNodeData
  | ContentStandardsNodeData
  | CoreMessageNodeData
  | RubricEvaluatorNodeData
  | ToneAnalyzerNodeData
  | ContentIteratorNodeData;

// Custom node types
export type CustomNode = Node<NodeData>;
export type CustomEdge = Edge;

// Flow state
export interface FlowState {
  nodes: CustomNode[];
  edges: CustomEdge[];
}
