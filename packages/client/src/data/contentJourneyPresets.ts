// Content Journey Presets and Mock Data
// Ported from Content Journey /src/data/mock-data.ts

import type {
  AudienceProfile,
  BrandVoice,
  ContentStandards,
  CoreMessageInput,
} from '../types/contentJourney';

// ============================================================================
// Audience Profile Presets
// ============================================================================

export const audienceProfiles: AudienceProfile[] = [
  {
    id: 'first-time-millennial',
    name: 'First-Time Millennial Buyer',
    demographics: {
      ageRange: '28-38',
      income: '$50,000-$85,000',
      education: "Bachelor's degree or higher",
      location: 'Suburban areas, 30-45 min from city center',
    },
    psychographics: {
      values: ['Financial stability', 'Work-life balance', 'Community'],
      interests: ['Home improvement DIY', 'Smart home technology', 'Sustainable living'],
      painPoints: [
        'Complex mortgage process',
        'Competitive market pressure',
        'Hidden costs and fees',
        'Limited inventory in desired areas',
      ],
      goals: [
        'Build equity instead of renting',
        'Find affordable starter home',
        'Space for growing family',
        'Good school district',
      ],
    },
    preferences: {
      communicationStyle: 'Clear, educational, supportive',
      techSavviness: 'High - mobile-first, expects seamless digital experience',
      decisionMakingFactors: ['Price', 'School district', 'Commute time', 'Future resale value'],
    },
    domainSpecific: {
      buyerType: 'first-time',
      searchBehavior: 'Extensive research, saves many homes, compares neighborhoods',
      primaryConcerns: ['Affordability', 'Future resale value', 'Maintenance costs'],
    },
  },
  {
    id: 'move-up-buyer',
    name: 'Move-Up Buyer (Gen X)',
    demographics: {
      ageRange: '45-55',
      income: '$120,000-$200,000',
      education: "Bachelor's or Master's degree",
      location: 'Established neighborhoods, suburban or urban',
    },
    psychographics: {
      values: ['Quality', 'Comfort', 'Status', 'Investment'],
      interests: ['Home upgrades', 'Entertaining', 'Outdoor spaces', 'Smart home features'],
      painPoints: [
        'Coordinating sale and purchase timing',
        'Market volatility concerns',
        'Finding the right upgrade features',
        'Downsizing vs upgrading decisions',
      ],
      goals: [
        'More space for family needs',
        'Better location or amenities',
        'Investment growth',
        'Lifestyle improvement',
      ],
    },
    preferences: {
      communicationStyle: 'Professional, data-driven, respectful of their experience',
      techSavviness: 'Moderate to high - comfortable with digital tools',
      decisionMakingFactors: ['ROI', 'Amenities', 'Neighborhood reputation', 'Resale potential'],
    },
    domainSpecific: {
      buyerType: 'move-up',
      searchBehavior: 'Targeted search with specific must-haves, compares value propositions',
      primaryConcerns: ['Timing the market', 'Maximizing current home sale', 'Quality upgrades'],
    },
  },
  {
    id: 'investor',
    name: 'Real Estate Investor',
    demographics: {
      ageRange: '35-60',
      income: '$100,000+',
      education: 'Varies - business or finance background common',
      location: 'Multiple markets - not location-dependent',
    },
    psychographics: {
      values: ['ROI', 'Efficiency', 'Data-driven decisions', 'Portfolio growth'],
      interests: ['Market trends', 'Property management', 'Tax strategies', 'Cash flow optimization'],
      painPoints: [
        'Time-consuming property search',
        'Accurate ROI calculations',
        'Property management challenges',
        'Market timing decisions',
      ],
      goals: [
        'Build rental portfolio',
        'Generate passive income',
        'Tax advantages',
        'Long-term wealth building',
      ],
    },
    preferences: {
      communicationStyle: 'Direct, data-focused, efficient',
      techSavviness: 'High - expects robust analytics and tools',
      decisionMakingFactors: ['Cap rate', 'Cash flow', 'Appreciation potential', 'Market trends'],
    },
    domainSpecific: {
      buyerType: 'investor',
      searchBehavior: 'Analytical, compares multiple properties, focuses on numbers',
      primaryConcerns: ['ROI metrics', 'Property condition', 'Rental demand', 'Exit strategies'],
    },
  },
  {
    id: 'downsizer',
    name: 'Empty Nester Downsizer',
    demographics: {
      ageRange: '55-70',
      income: '$80,000-$150,000',
      education: "Bachelor's degree or higher",
      location: 'Low-maintenance communities, active adult communities',
    },
    psychographics: {
      values: ['Simplicity', 'Quality of life', 'Financial security', 'Accessibility'],
      interests: ['Travel', 'Hobbies', 'Grandchildren visits', 'Low-maintenance living'],
      painPoints: [
        'Too much space to maintain',
        'High property taxes',
        'Yard work and upkeep',
        'Accessibility concerns for aging',
      ],
      goals: [
        'Reduce maintenance burden',
        'Free up equity for retirement',
        'Move closer to family or amenities',
        'Age-friendly home features',
      ],
    },
    preferences: {
      communicationStyle: 'Respectful, patient, empathetic',
      techSavviness: 'Moderate - may need guidance with digital tools',
      decisionMakingFactors: [
        'Maintenance requirements',
        'Community amenities',
        'Healthcare proximity',
        'Cost of living',
      ],
    },
    domainSpecific: {
      buyerType: 'downsizer',
      searchBehavior: 'Deliberate, seeks guidance, values agent relationship',
      primaryConcerns: ['Right-sizing', 'Accessibility', 'Community fit', 'Financial prudence'],
    },
  },
];

// ============================================================================
// Brand Voice Presets
// ============================================================================

export const brandVoices: BrandVoice[] = [
  {
    tone: ['Helpful', 'Professional', 'Approachable', 'Trustworthy'],
    style: ['Clear', 'Concise', 'Action-oriented', 'Empathetic'],
    dos: [
      'Use simple, everyday language',
      'Be specific and actionable',
      'Show empathy for user situation',
      'Provide clear next steps',
      'Use active voice',
      'Highlight benefits over features',
    ],
    donts: [
      'Use real estate jargon without explanation',
      'Be overly salesy or pushy',
      'Make assumptions about financial situation',
      'Use fear-based messaging',
      'Overwhelm with too many options',
      'Use vague or ambiguous language',
    ],
    personality:
      'A knowledgeable, supportive guide who understands the emotional and practical aspects of home buying. We empower users with information while respecting their journey and decisions.',
    vocabulary: {
      preferred: [
        'home',
        'explore',
        'discover',
        'save',
        'match',
        'opportunity',
        'find',
        'guide',
        'help',
        'recommend',
      ],
      avoided: [
        'deal',
        'urgent',
        'miss out',
        'limited time',
        'exclusive',
        'act now',
        'once in a lifetime',
        'must see',
      ],
    },
  },
  {
    tone: ['Energetic', 'Confident', 'Modern', 'Direct'],
    style: ['Bold', 'Brief', 'Punchy', 'Benefit-focused'],
    dos: [
      'Start with the benefit',
      'Use strong action verbs',
      'Keep it short and punchy',
      'Create sense of momentum',
      'Speak directly to the reader',
      'Use numbers and data points',
    ],
    donts: [
      'Be long-winded',
      'Hedge or qualify excessively',
      'Use passive voice',
      'Bury the lead',
      'Use corporate speak',
      'Overcomplicate simple ideas',
    ],
    personality:
      'A confident expert who cuts through the noise and delivers what you need to know. Direct, modern, and focused on results.',
    vocabulary: {
      preferred: [
        'unlock',
        'power',
        'boost',
        'maximize',
        'transform',
        'results',
        'win',
        'advantage',
        'smart',
        'fast',
      ],
      avoided: [
        'perhaps',
        'maybe',
        'consider',
        'might',
        'possibly',
        'we think',
        'sort of',
        'basically',
      ],
    },
  },
  {
    tone: ['Warm', 'Friendly', 'Conversational', 'Encouraging'],
    style: ['Casual', 'Relatable', 'Storytelling', 'Personal'],
    dos: [
      "Use contractions (you're, we're, it's)",
      'Ask questions to engage',
      'Share relatable scenarios',
      'Celebrate small wins',
      'Use everyday analogies',
      'Be genuinely encouraging',
    ],
    donts: [
      'Be too formal or stiff',
      'Use technical jargon',
      'Sound robotic or templated',
      'Lecture or talk down',
      'Be overly promotional',
      'Force humor',
    ],
    personality:
      'A friendly neighbor who genuinely cares about your success. Approachable, understanding, and always ready with helpful advice.',
    vocabulary: {
      preferred: [
        "you're",
        "we're",
        "let's",
        'check out',
        'take a look',
        'perfect for',
        'just right',
        'easy',
        'simple',
        'great',
      ],
      avoided: [
        'utilize',
        'facilitate',
        'implement',
        'leverage',
        'synergy',
        'paradigm',
        'ecosystem',
        'solution',
      ],
    },
  },
];

// ============================================================================
// Content Standards Presets
// ============================================================================

export const contentStandards: ContentStandards[] = [
  {
    complianceRules: [
      'Fair Housing Act compliance - no discriminatory language',
      'RESPA compliance - accurate mortgage information',
      'Truth in Advertising - no misleading claims',
      'Data privacy compliance - transparent data use',
      'ADA compliance for digital content',
    ],
    styleGuideRules: [
      'Sentence length maximum 20 words',
      'One idea per sentence',
      'Active voice preferred',
      'Specific over general terms',
      'Numbers as numerals (3 beds, not three beds)',
      'Avoid double negatives',
      'Use parallel structure in lists',
    ],
    accessibilityRequirements: [
      'WCAG 2.1 AA compliant content',
      'Screen reader friendly formatting',
      'Clear heading hierarchy',
      'Descriptive link text (no "click here")',
      'Alt text for images when applicable',
      'Sufficient color contrast',
      'No reliance on color alone for meaning',
    ],
    inclusivityGuidelines: [
      'Gender-neutral language',
      'Avoid assumptions about family structure',
      'Culturally sensitive terminology',
      'Economic situation neutral',
      'Accessibility-first language (avoid "see" or "look")',
      'Age-neutral language',
      'No assumptions about ability or disability',
    ],
    plainLanguageRequirements: true,
    maxReadingLevel: 8,
  },
  {
    complianceRules: [
      'Industry-specific regulatory compliance',
      'Brand guidelines adherence',
      'Legal disclaimer requirements',
      'Copyright and attribution standards',
    ],
    styleGuideRules: [
      'Maintain consistent tone throughout',
      'Use AP Style for dates and numbers',
      'Oxford comma required',
      'Spell out acronyms on first use',
      'Use em dashes for emphasis (—)',
      'No exclamation points in body copy',
    ],
    accessibilityRequirements: [
      'WCAG 2.1 Level AAA where possible',
      'Captions for all video content',
      'Transcripts for audio content',
      'Keyboard navigation support',
      'Focus indicators visible',
    ],
    inclusivityGuidelines: [
      'Use person-first language',
      'Avoid idioms that may not translate',
      'Consider global audience',
      'Avoid cultural assumptions',
      'Use "they" as singular pronoun',
    ],
    plainLanguageRequirements: true,
    maxReadingLevel: 10,
  },
];

// ============================================================================
// Core Message Examples
// ============================================================================

export const messageExamples: Array<CoreMessageInput & { id: string; title: string; type: string }> = [
  {
    id: 'search-expansion',
    title: 'Search expansion',
    type: 'discovery',
    message: 'There are homes within your buyability that are being excluded in your saved search.',
    context: 'User has a saved search with specific criteria that might be too restrictive',
  },
  {
    id: 'price-drop',
    title: 'Price drop alert',
    type: 'opportunity',
    message: 'A home you viewed last month just reduced its price by $15,000.',
    context: 'Previously viewed property now more affordable',
  },
  {
    id: 'new-listing',
    title: 'New listing match',
    type: 'discovery',
    message: 'A new home that matches all your search criteria just hit the market.',
    context: 'Fresh listing that fits user preferences perfectly',
  },
  {
    id: 'market-insight',
    title: 'Market insight',
    type: 'education',
    message: 'Homes in your target neighborhood are selling 15% faster than last month.',
    context: 'Market velocity insight to inform timing decisions',
  },
  {
    id: 'saved-search-results',
    title: 'Saved search results',
    type: 'update',
    message: '5 new homes match your saved search for 3BR homes under $400K in Springfield.',
    context: 'Regular update for an active saved search',
  },
  {
    id: 'home-value-change',
    title: 'Home value change',
    type: 'insight',
    message: "Your home's estimated value has increased by $25,000 in the past 6 months.",
    context: 'Zestimate update for owned home',
  },
  {
    id: 'mortgage-rate-change',
    title: 'Mortgage rate change',
    type: 'opportunity',
    message: 'Mortgage rates just dropped to the lowest level in 3 months.',
    context: 'Favorable rate environment for buyers or refinancers',
  },
  {
    id: 'showing-reminder',
    title: 'Showing reminder',
    type: 'reminder',
    message: 'Your home showing is scheduled for tomorrow at 2 PM.',
    context: 'Upcoming appointment reminder',
  },
];

// ============================================================================
// Helper Functions
// ============================================================================

export function getAudienceProfileById(id: string): AudienceProfile | undefined {
  return audienceProfiles.find((profile) => profile.id === id);
}

export function getBrandVoiceById(index: number): BrandVoice | undefined {
  return brandVoices[index];
}

export function getContentStandardsById(index: number): ContentStandards | undefined {
  return contentStandards[index];
}

export function getMessageExampleById(id: string): (CoreMessageInput & { title: string; type: string }) | undefined {
  return messageExamples.find((example) => example.id === id);
}

// ============================================================================
// Default Values
// ============================================================================

export const defaultBrandVoice = brandVoices[0];
export const defaultContentStandards = contentStandards[0];
export const defaultAudienceProfile = audienceProfiles[0];
