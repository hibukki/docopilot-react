import { getDocText } from './doc';

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

// Helper function to get cached data from PropertiesService
const getCachedData = (): {
  cachedDocumentText: string | null;
  cachedComments: GetCommentsResponse | null;
} => {
  const scriptProperties = PropertiesService.getScriptProperties();
  const cachedDocumentText = scriptProperties.getProperty(
    'lastDocumentTextCache'
  );
  const cachedCommentsString =
    scriptProperties.getProperty('lastCommentsCache');

  if (!cachedCommentsString) {
    return { cachedDocumentText, cachedComments: null };
  }

  // Let JSON.parse errors propagate
  const cachedComments: GetCommentsResponse = JSON.parse(cachedCommentsString);
  return { cachedDocumentText, cachedComments };
};

// Helper function to set cached data in PropertiesService
const setCachedData = (
  documentText: string,
  comments: GetCommentsResponse
): void => {
  const scriptProperties = PropertiesService.getScriptProperties();
  // Let setProperty errors propagate
  scriptProperties.setProperty('lastDocumentTextCache', documentText);
  scriptProperties.setProperty('lastCommentsCache', JSON.stringify(comments));
  console.log('Stored new comments in PropertiesService.');
};

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
  const currentDocumentText = getDocText();
  const { cachedDocumentText, cachedComments } = getCachedData();

  // Check cache
  if (
    currentDocumentText === cachedDocumentText &&
    cachedComments &&
    Array.isArray(cachedComments.comments) // Basic validation
  ) {
    console.log('Returning cached comments from PropertiesService.');
    return cachedComments;
  }

  console.log(
    'Document changed or cache invalid/missing, fetching new comments.'
  );

  const newComments = getCommentsFromLLM(currentDocumentText);

  // Store in PropertiesService using the helper function
  setCachedData(currentDocumentText, newComments);

  return newComments;
};
