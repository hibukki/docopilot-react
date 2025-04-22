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
import { getComments, docopilotMainLoop } from './docopilot';

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
  docopilotMainLoop,
  getGeminiApiKey,
  setGeminiApiKey,
  getUserPrompt,
  setUserPrompt,
  getCurrentPrompt,
};
