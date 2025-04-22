import { queryLLM, getGeminiApiKey, getCurrentPrompt } from './llms';

export type Comment = {
  quoted_text: string;
  comment_text: string;
};

export type GetCommentsResponse = {
  comments: Comment[];
};

export type LLMResponse = {
  thinking: string;
  comments: {
    quote: string;
    comment: string;
  }[];
};

const llmResponseSchema = {
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

export const getComments = (): GetCommentsResponse => {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error(
      'Gemini API key not set. Please set it via the Add-on menu.'
    );
  }

  const documentText = DocumentApp.getActiveDocument().getBody().getText();
  if (!documentText) {
    return { comments: [] }; // No text, no comments
  }

  const systemPrompt = getCurrentPrompt();
  const fullPrompt = `${systemPrompt}\n\nDocument Text:\n\`\`\`\n${documentText}\n\`\`\``;

  // TODO: Make model configurable?
  const model = 'gemini-1.5-flash-latest';

  try {
    const llmResponseString = queryLLM(
      fullPrompt,
      apiKey,
      model,
      llmResponseSchema
    );
    const llmResponse: LLMResponse = JSON.parse(llmResponseString);

    // Log the thinking process for debugging or potential display
    console.log(`LLM Thinking: ${llmResponse.thinking}`);

    const comments = llmResponse.comments.map((c) => ({
      quoted_text: c.quote,
      comment_text: c.comment,
    }));

    return { comments };
  } catch (e) {
    console.error('Error querying LLM or parsing response:', e);
    // Consider more robust error handling or returning a specific error state
    return { comments: [] }; // Return empty comments on error for now
  }
};
