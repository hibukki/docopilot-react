import { getDocText, highlightCommentsInDoc } from './doc';

import { queryLLM, getGeminiApiKey, getCurrentPrompt } from './llms';
import {
  GetCommentsResponse,
  emptyComments,
} from './get_comments_response_type';
import {
  getCachedComments,
  setCachedComments,
  setCachedDocumentText,
  getCachedDocumentText,
} from './script_properties';

export type LLMResponse = {
  thinking: string | null;
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

export const onGotNewLLMComments = (commentsResponse: GetCommentsResponse) => {
  highlightCommentsInDoc(commentsResponse.comments.map((c) => c.quoted_text));
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

  const commentsResponse: GetCommentsResponse = {
    comments: llmResponse.comments.map((c) => ({
      quoted_text: c.quote,
      comment_text: c.comment,
    })),
  };

  onGotNewLLMComments(commentsResponse);

  return commentsResponse;
};

export const docopilotMainLoop = () => {
  // TODO: Every second,
  // if the document text changed, prompt the LLM for comments and save them somewhere accessible for getComments to retrieve. This way getComments can immediately return instead of waiting for the LLM
};

export const getComments = (): GetCommentsResponse => {
  const currentDocumentText = getDocText();
  const cachedDocumentText = getCachedDocumentText();

  if (cachedDocumentText === currentDocumentText) {
    const cachedComments = getCachedComments();
    if (cachedComments) {
      return cachedComments;
    }
  }

  const newComments = getCommentsFromLLM(currentDocumentText);

  setCachedDocumentText(currentDocumentText);
  setCachedComments(newComments);

  return newComments;
};
