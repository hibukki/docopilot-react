import { onOpen, openAboutSidebar, openDialogMUI } from './ui';

import { getSheetsData, addSheet, deleteSheet, setActiveSheet } from './sheets';
import {
  queryLLM,
  getGeminiApiKey,
  setGeminiApiKey,
  getUserPrompt,
  setUserPrompt,
  getCurrentPrompt,
} from './llms';
import {
  getComments,
  docopilotTick,
  getFocusedQuote,
  onSidebarCommentSetFocus,
} from './docopilot';

// Public functions must be exported as named exports
export {
  onOpen,
  openDialogMUI,
  openAboutSidebar,
  getSheetsData,
  addSheet,
  deleteSheet,
  setActiveSheet,
  queryLLM,
  getComments,
  getGeminiApiKey,
  setGeminiApiKey,
  getUserPrompt,
  setUserPrompt,
  getCurrentPrompt,
  docopilotTick,
  getFocusedQuote,
  onSidebarCommentSetFocus,
};
