import { queryLLM, getGeminiApiKey, getCurrentPrompt } from './llms';

export type Comment = {
  quoted_text: string;
  comment_text: string;
};

export type GetCommentsResponse = {
  comments: Comment[];
};

const emptyComments: GetCommentsResponse = { comments: [] };

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

let lastDocumentTextCache: string | null = null;
let lastCommentsCache: GetCommentsResponse = emptyComments;

const getCommentsFromLLM = (documentText: string): GetCommentsResponse => {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error(
      'Gemini API key not set. Please set it via the Add-on menu.'
    );
  }

  if (!documentText) {
    return emptyComments;
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
    return emptyComments;
  }
};

export const docopilotMainLoop = () => {
  // TODO: Every second,
  // if the document text changed, prompt the LLM for comments and save them somewhere accessible for getComments to retrieve. This way getComments can immediately return instead of waiting for the LLM
};

export const getComments = (): GetCommentsResponse => {
  const currentDocumentText = DocumentApp.getActiveDocument()
    .getBody()
    .getText();

  // Check cache
  if (
    currentDocumentText === lastDocumentTextCache &&
    lastCommentsCache !== null // Ensure cache is populated
  ) {
    console.log('Returning cached comments.');
    return lastCommentsCache;
  }

  console.log('Document changed, fetching new comments.');
  lastDocumentTextCache = currentDocumentText;

  const newComments = getCommentsFromLLM(currentDocumentText);
  lastCommentsCache = newComments;

  return newComments;
};
