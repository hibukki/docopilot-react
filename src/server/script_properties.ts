import { z } from 'zod';
import { GetCommentsResponse } from './get_comments_response_type';

export type CursorSource = 'document' | 'sidebar';

export interface CursorPosition {
  offset?: number;
  quote?: string;
  source: CursorSource;
}

export interface DocCursorPosition extends CursorPosition {
  source: 'document';
}

const CachedDocumentSchema = z.object({
  text: z.string(),
  updated_at: z.number(), // Unix timestamp in milliseconds
});

export type CachedDocument = z.infer<typeof CachedDocumentSchema>;

const LAST_DOCUMENT_CACHE_KEY = 'lastDocumentCache';

// Means document text that we generated comments for.
export const setCachedDocumentText = (text: string): void => {
  const scriptProperties = PropertiesService.getScriptProperties();
  const cachedDoc: CachedDocument = {
    text,
    updated_at: Date.now(),
  };
  scriptProperties.setProperty(
    LAST_DOCUMENT_CACHE_KEY,
    JSON.stringify(cachedDoc)
  );
};

export const getCachedDocumentText = (): CachedDocument | null => {
  const scriptProperties = PropertiesService.getScriptProperties();
  const cachedDocString = scriptProperties.getProperty(LAST_DOCUMENT_CACHE_KEY);
  if (!cachedDocString) {
    return null;
  }
  const parsedJson = JSON.parse(cachedDocString);
  // Zod's parse will throw an error if validation fails
  const cachedDoc = CachedDocumentSchema.parse(parsedJson);
  return cachedDoc;
};

export const getCachedComments = (): GetCommentsResponse | null => {
  const scriptProperties = PropertiesService.getScriptProperties();
  const cachedCommentsString =
    scriptProperties.getProperty('lastCommentsCache');
  if (!cachedCommentsString) {
    return null;
  }
  const cachedComments: GetCommentsResponse = JSON.parse(cachedCommentsString);
  return cachedComments;
};

export const setCachedComments = (comments: GetCommentsResponse): void => {
  const scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty('lastCommentsCache', JSON.stringify(comments));
};

export const setCachedDocCursorPosition = (
  position: DocCursorPosition
): void => {
  const scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty(
    'lastCursorPositionCache',
    JSON.stringify(position)
  );
};

export const getCachedDocCursorPosition = (): DocCursorPosition | null => {
  const scriptProperties = PropertiesService.getScriptProperties();
  const cachedCursorPositionString = scriptProperties.getProperty(
    'lastCursorPositionCache'
  );
  if (!cachedCursorPositionString) {
    return null;
  }
  // TODO: Add validation for the parsed object
  return JSON.parse(cachedCursorPositionString) as DocCursorPosition;
};

export type FocusedQuote = {
  quote: string | null;
  source: CursorSource;
  skipNextDocUpdate: boolean;
};

export const setFocusedQuote = (quote: FocusedQuote): void => {
  const scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty('focusedQuote', JSON.stringify(quote));
};

export const getFocusedQuote = (): FocusedQuote | null => {
  const scriptProperties = PropertiesService.getScriptProperties();
  const focusedQuoteString = scriptProperties.getProperty('focusedQuote');
  if (!focusedQuoteString) {
    return null;
  }
  return JSON.parse(focusedQuoteString) as FocusedQuote;
};
