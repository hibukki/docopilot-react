import { DEFAULT_PROMPT } from './default_prompt';

const GEMINI_API_KEY_PROPERTY_NAME = 'GEMINI_API_KEY';
const USER_PROMPT_PROPERTY_NAME = 'USER_PROMPT';

export const queryLLM = (prompt: string) => {
  return `dummy response for ${prompt}`;
};

export const getGeminiApiKey = () => {
  return PropertiesService.getScriptProperties().getProperty(
    GEMINI_API_KEY_PROPERTY_NAME
  );
};

export const setGeminiApiKey = (apiKey: string) => {
  PropertiesService.getScriptProperties().setProperty(
    GEMINI_API_KEY_PROPERTY_NAME,
    apiKey
  );
};

export const getUserPrompt = () => {
  return PropertiesService.getScriptProperties().getProperty(
    USER_PROMPT_PROPERTY_NAME
  );
};

export const setUserPrompt = (prompt: string) => {
  PropertiesService.getScriptProperties().setProperty(
    USER_PROMPT_PROPERTY_NAME,
    prompt
  );
};

export const getCurrentPrompt = () => {
  const userPrompt = getUserPrompt();
  const defaultPrompt = DEFAULT_PROMPT;
  return userPrompt || defaultPrompt;
};
