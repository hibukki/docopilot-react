import { GetCommentsResponse } from './get_comments_response_type';

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
