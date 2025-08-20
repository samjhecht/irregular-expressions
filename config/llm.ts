export const LLM_CONFIG = {
  MAX_PROMPT_LENGTH: parseInt(process.env.MAX_PROMPT_LENGTH || '4000'),
  DEFAULT_MODEL: process.env.ANTHROPIC_MODEL || 'claude-3-haiku-20240307',
  MAX_TOKENS: parseInt(process.env.MAX_TOKENS || '1000')
} as const