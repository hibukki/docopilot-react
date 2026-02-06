import { z } from 'zod';

export const LLMResponseSchema = z.object({
  thinking: z.string().nullable(),
  comments: z.array(
    z.object({
      quote: z.string(),
      comment: z.string(),
    })
  ),
});

export type LLMResponse = z.infer<typeof LLMResponseSchema>;

// JSON Schema format for Gemini's responseSchema parameter
export const llmResponseJsonSchema = {
  type: 'object',
  properties: {
    thinking: { type: 'string' },
    comments: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          quote: { type: 'string' },
          comment: { type: 'string' },
        },
        required: ['quote', 'comment'],
      },
    },
  },
  required: ['thinking', 'comments'],
};
