import { getDocText, highlightCommentsInDoc } from './doc';

import {
  queryLLM,
  getGeminiApiKey,
  getCurrentPrompt,
  getGeminiModel,
} from './llms';
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
import { refreshCursorPosition } from './doc_cursor';

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

const DEFAULT_MODEL = 'gemini-2.0-flash-thinking-exp-1219';

export const onGotNewLLMComments = (commentsResponse: GetCommentsResponse) => {
  const quotes = commentsResponse.comments.map((c) => c.quoted_text);
  refreshCursorPosition();

  const quoteInFocus = null; // We didn't check yet if anything is in focus

  highlightCommentsInDoc(quotes, quoteInFocus);
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
  const selectedModel = getGeminiModel();
  const model = selectedModel || DEFAULT_MODEL;

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

export const getComments = (): GetCommentsResponse => {
  const cachedComments = getCachedComments();

  if (!cachedComments) {
    return emptyComments;
  }

  return cachedComments;
};

export const refreshCommentsIfNeeded = (): GetCommentsResponse => {
  const cachedDocument = getCachedDocumentText();
  const currentDocumentText = getDocText();

  // If the document CHANGED in the last 500 ms then debounce (wait for next time)
  if (
    cachedDocument &&
    cachedDocument.updated_at > Date.now() - 500 &&
    cachedDocument.text !== currentDocumentText
  ) {
    const cachedComments = getCachedComments();
    if (cachedComments) {
      return cachedComments;
    }
  }

  if (cachedDocument && cachedDocument.text === currentDocumentText) {
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

// The frontend will call this every second or so
export const docopilotTick = () => {
  console.log('docopilotTick');
  refreshCursorPosition();
  refreshCommentsIfNeeded();
};
