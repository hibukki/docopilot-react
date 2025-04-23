import { DEFAULT_PROMPT } from './default_prompt';

const GEMINI_API_KEY_PROPERTY_NAME = 'GEMINI_API_KEY';
const USER_PROMPT_PROPERTY_NAME = 'USER_PROMPT';
const GEMINI_MODEL_PROPERTY_NAME = 'GEMINI_MODEL';

// Define a type for the payload
interface GeminiPayload {
  contents: { parts: { text: string }[] }[];
  generationConfig?: {
    responseMimeType: 'application/json';
    responseSchema: object;
  };
}

export const queryLLM = (
  prompt: string,
  apiKey: string,
  model: string,
  schema?: object
) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const payload: GeminiPayload = {
    contents: [{ parts: [{ text: prompt }] }],
  };

  if (schema) {
    payload.generationConfig = {
      responseMimeType: 'application/json',
      responseSchema: schema,
    };
  }

  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: false, // Let errors propagate
  };

  const response = UrlFetchApp.fetch(url, options);
  const responseText = response.getContentText();
  const jsonResponse = JSON.parse(responseText);

  return jsonResponse.candidates[0].content.parts[0].text;
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

export const getGeminiModel = (): string | null => {
  return PropertiesService.getScriptProperties().getProperty(
    GEMINI_MODEL_PROPERTY_NAME
  );
};

export const setGeminiModel = (model: string) => {
  PropertiesService.getScriptProperties().setProperty(
    GEMINI_MODEL_PROPERTY_NAME,
    model
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

// Define an interface for the model object returned by the API
interface GeminiModelInfo {
  name: string;
  displayName: string;
  supportedGenerationMethods: string[];
}

// Function to list available Gemini models suitable for generateContent
export const listAvailableModels = () => {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error('API key must be set to list models.');
  }
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  const options = {
    method: 'get',
    contentType: 'application/json',
    muteHttpExceptions: false, // Let errors propagate
  };

  const response = UrlFetchApp.fetch(url, options);
  const responseText = response.getContentText();
  const jsonResponse = JSON.parse(responseText);

  // Filter models that support 'generateContent' method
  const availableModels = jsonResponse.models
    .filter((model: GeminiModelInfo) =>
      model.supportedGenerationMethods.includes('generateContent')
    )
    .map((model: GeminiModelInfo) => {
      // console.log(model);
      return model;
    })
    .map((model: GeminiModelInfo) => ({
      name: model.name.replace('models/', ''), // Store simplified name e.g. 'gemini-1.5-flash-latest'
      displayName: model.displayName,
    }));

  return availableModels;
};
