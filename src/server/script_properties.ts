import { GetCommentsResponse } from './get_comments_response_type';

export type CursorSource = 'document' | 'sidebar';

export interface CursorPosition {
  offset?: number;
  quote?: string;
  source: CursorSource;
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

export const setCachedCursorPosition = (position: CursorPosition): void => {
  const scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty(
    'lastCursorPositionCache',
    JSON.stringify(position)
  );
};

export const getCachedCursorPosition = (): CursorPosition | null => {
  const scriptProperties = PropertiesService.getScriptProperties();
  const cachedCursorPositionString = scriptProperties.getProperty(
    'lastCursorPositionCache'
  );
  if (!cachedCursorPositionString) {
    return null;
  }
  // TODO: Add validation for the parsed object
  return JSON.parse(cachedCursorPositionString) as CursorPosition;
};
