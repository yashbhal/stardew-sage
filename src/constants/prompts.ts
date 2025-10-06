export const PROMPT_POOL = [
  'Best crops for Spring year 1?',
  'Optimal Spring crop rotations?',
  'Gift ideas for Sebastian?',
  'Easiest heart events to unlock?',
  'How do I unlock the community center?',
  'Fastest way to earn gold early?',
  'Efficient mining day plan?',
  'Where to find rare fish today?',
  'Tips for perfect fishing?',
  'What should I do on rainy days?',
] as const;

export const PROMPT_COUNT = 3;

export type PromptSuggestion = typeof PROMPT_POOL[number];
