import { onOpen, openAboutSidebar, openDialogMUI } from './ui';

import {
  queryLLM,
  getGeminiApiKey,
  setGeminiApiKey,
  getUserPrompt,
  setUserPrompt,
  getCurrentPrompt,
  listAvailableModels,
  getGeminiModel,
  setGeminiModel,
} from './llms';
import { getComments, docopilotTick } from './docopilot';
import {
  onSidebarCommentSetFocus,
  getCursorQuote,
  refreshCursorPosition,
} from './doc_cursor';

// Public functions must be exported as named exports
export {
  onOpen,
  openDialogMUI,
  openAboutSidebar,
  queryLLM,
  getComments,
  getGeminiApiKey,
  setGeminiApiKey,
  getUserPrompt,
  setUserPrompt,
  getCurrentPrompt,
  docopilotTick,
  getCursorQuote,
  onSidebarCommentSetFocus,
  listAvailableModels,
  getGeminiModel,
  setGeminiModel,
  refreshCursorPosition,
};
