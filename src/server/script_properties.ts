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

// Means document text that we generated comments for.
export const setCachedDocumentText = (text: string): void => {
  const scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty('lastDocumentTextCache', text);
};

export const getCachedDocumentText = (): string | null => {
  const scriptProperties = PropertiesService.getScriptProperties();
  return scriptProperties.getProperty('lastDocumentTextCache');
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
