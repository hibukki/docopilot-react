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

const setCachedDocumentText = (text: string): void => {
  const scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty('lastDocumentTextCache', text);
};

const getCachedComments = (): GetCommentsResponse | null => {
  const scriptProperties = PropertiesService.getScriptProperties();
  const cachedCommentsString =
    scriptProperties.getProperty('lastCommentsCache');
  if (!cachedCommentsString) {
    return null;
  }
  const cachedComments: GetCommentsResponse = JSON.parse(cachedCommentsString);
  return cachedComments;
};

const setCachedComments = (comments: GetCommentsResponse): void => {
  const scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty('lastCommentsCache', JSON.stringify(comments));
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

  const llmResponseString = queryLLM(
    fullPrompt,
    apiKey,
    model,
    llmResponseSchema
  );
  const llmResponse: LLMResponse = JSON.parse(llmResponseString);

  const comments = llmResponse.comments.map((c) => ({
    quoted_text: c.quote,
    comment_text: c.comment,
  }));

  return { comments };
};

export const docopilotMainLoop = () => {
  // TODO: Every second,
  // if the document text changed, prompt the LLM for comments and save them somewhere accessible for getComments to retrieve. This way getComments can immediately return instead of waiting for the LLM
};

export const getComments = (): GetCommentsResponse => {
  const currentDocumentText = getDocText();
  const cachedComments = getCachedComments();

  if (cachedComments) {
    return cachedComments;
  }

  const newComments = getCommentsFromLLM(currentDocumentText);

  setCachedDocumentText(currentDocumentText);
  setCachedComments(newComments);

  return newComments;
};
