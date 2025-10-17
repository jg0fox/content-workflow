// Core Content Journey Type Definitions
// Ported from Content Journey /src/lib/types.ts

// ============================================================================
// Content Types
// ============================================================================

export type ContentType =
  | 'tooltip'
  | 'desktop-notification'
  | 'push-notification'
  | 'email'
  | 'in-app-banner';

// ============================================================================
// Audience Profile
// ============================================================================

export interface AudienceProfile {
  id: string;
  name: string;
  demographics: {
    ageRange: string;           // e.g., "28-38"
    income: string;             // e.g., "$50,000-$85,000"
    education: string;          // e.g., "Bachelor's degree or higher"
    location: string;           // e.g., "Suburban areas, 30-45 min from city"
  };
  psychographics: {
    values: string[];           // e.g., ["Financial stability", "Work-life balance"]
    interests: string[];        // e.g., ["Home improvement DIY", "Smart home tech"]
    painPoints: string[];       // e.g., ["Complex mortgage process", "Hidden costs"]
    goals: string[];            // e.g., ["Build equity", "Space for growing family"]
  };
  preferences: {
    communicationStyle: string; // e.g., "Clear, educational, supportive"
    techSavviness: string;      // e.g., "High - mobile-first"
    decisionMakingFactors: string[]; // e.g., ["Price", "School district"]
  };
  // Optional domain-specific extension
  domainSpecific?: Record<string, unknown>;
}

// ============================================================================
// Brand Voice
// ============================================================================

export interface BrandVoice {
  tone: string[];              // e.g., ["Helpful", "Professional", "Approachable"]
  style: string[];             // e.g., ["Clear", "Concise", "Action-oriented"]
  dos: string[];               // Best practices
  donts: string[];             // Practices to avoid
  personality: string;         // Overall character description
  vocabulary: {
    preferred: string[];       // Encouraged terms
    avoided: string[];         // Discouraged terms
  };
}

// ============================================================================
// Content Standards
// ============================================================================

export interface ContentStandards {
  complianceRules: string[];         // Legal/regulatory requirements
  styleGuideRules: string[];         // Writing style rules
  accessibilityRequirements: string[]; // WCAG compliance
  inclusivityGuidelines: string[];   // DEI language guidelines
  plainLanguageRequirements: boolean; // Enable plain language mode
  maxReadingLevel?: number;          // Grade level (1-12)
}

// ============================================================================
// Core Message
// ============================================================================

export interface CoreMessageInput {
  message: string;      // The main message (min 10 chars)
  context?: string;     // Optional situational context
}

// ============================================================================
// Content Variation
// ============================================================================

export interface ContentVariation {
  id: string;
  contentType: ContentType;
  version: number;
  primary: string;       // Main content text
  secondary?: string;    // Supporting text
  cta?: string;          // Call to action
  metadata: {
    characterCount: number;
    readingLevel?: number;
    generatedAt: Date;
    generationPrompt?: string;
  };
}

// ============================================================================
// Evaluation
// ============================================================================

export interface EvaluationCriteria {
  clarity: number;        // 1-5 scale
  relevance: number;      // 1-5 scale
  tone: number;           // 1-5 scale
  actionability: number;  // 1-5 scale
  accessibility: number;  // 1-5 scale
}

export interface LinguisticDevice {
  device: string;         // e.g., "Assonance", "Direct Address"
  count: number;          // Occurrences found
  effectiveness: number;  // 1-5 rating
  description: string;    // What it does
}

export interface ToneAnalysisResult {
  sentiment: 'positive' | 'neutral' | 'negative';
  formality: 'formal' | 'neutral' | 'informal';
  urgency: 'high' | 'medium' | 'low';
  brandAlignment: number;           // 1-5 score
  linguisticDevices: LinguisticDevice[];
  readabilityScore: number;         // Flesch Reading Ease converted to 1-5
  vocabularyCompliance: {
    preferredTermsUsed: string[];
    avoidedTermsUsed: string[];
    score: number;
  };
}

export interface EvaluationResult {
  id: string;
  contentVariationId: string;
  method: 'rubric' | 'tone-analysis';
  scores: EvaluationCriteria;
  feedback: string[];         // Areas for improvement
  suggestions: string[];      // Specific actionable suggestions
  strengths?: string[];       // What works well
  overallScore: number;       // Weighted average
  timestamp: Date;
  toneAnalysis?: ToneAnalysisResult; // Only for tone-analysis method
}

// ============================================================================
// Iteration
// ============================================================================

export interface IterationRequest {
  content: ContentVariation;
  evaluationResult: EvaluationResult;
  audienceProfile: AudienceProfile;
  brandVoice: BrandVoice;
  contentStandards: ContentStandards;
  coreMessage: string;
  customFeedback?: string;
  enhancedPrompt?: string;
}

export interface IterationResponse {
  improvedContent: ContentVariation;
  improvementRationale: string;
  systemPrompt: string;
}

// ============================================================================
// System Prompt
// ============================================================================

export interface SystemPrompt {
  id: string;
  contentType: ContentType;
  prompt: string;
  components: {
    hasAudience: boolean;
    hasBrandVoice: boolean;
    hasStandards: boolean;
    hasCoreMessage: boolean;
  };
  metadata: {
    characterCount: number;
    createdAt: Date;
  };
}
