import { getCursorPosition, highlightCommentsInDoc } from './doc';
import {
  //   getCachedCursorPosition,
  getCachedComments,
  CursorSource,
  getCachedCursorPosition,
  setCachedCursorPosition,
  CursorPosition,
  //   setCachedCursorPosition,
} from './script_properties';

// Returns the index of the matching quote, or -1 if no match
const findQuoteIndexAtCursor = (
  quotes: string[],
  cursor: GoogleAppsScript.Document.Position
): number => {
  const cursorElement = cursor.getElement();
  if (cursorElement.getType() !== DocumentApp.ElementType.TEXT) {
    return -1;
  }
  const cursorTextElement = cursorElement.asText();
  const cursorText = cursorTextElement.getText();

  // Check if any of the quotes contain or are contained by the cursor text
  for (let i = 0; i < quotes.length; i += 1) {
    const quote = quotes[i];
    if (cursorText.includes(quote)) {
      return i;
    }
  }
  return -1;
};

export const onCursorChanged = (
  newCursor: GoogleAppsScript.Document.Position,
  source: CursorSource
) => {
  const cachedComments = getCachedComments();
  if (!cachedComments) {
    return;
  }
  const quotes = cachedComments.comments.map((c) => c.quoted_text);

  const quoteIndex = findQuoteIndexAtCursor(quotes, newCursor);

  const quoteInFocus = quoteIndex !== -1 ? quotes[quoteIndex] : null;
  const currentCursorPosition: CursorPosition = {
    quote: quoteInFocus ?? undefined,
    offset: newCursor.getOffset(),
    source,
  };

  const previousCursorPosition = getCachedCursorPosition();
  if (previousCursorPosition === currentCursorPosition) {
    return;
  }

  highlightCommentsInDoc(quotes, quoteInFocus);
  setCachedCursorPosition(currentCursorPosition);
};

export const refreshCursorPosition = () => {
  const cursor = getCursorPosition();
  //   const cachedCursorPosition = getCachedCursorPosition();
  //   if (cachedCursorPosition === cursor) {
  //     // return;
  //   }
  //   setCachedCursorPosition(cursor);
  onCursorChanged(cursor, 'document');
};

export const getCursorQuote = (): string | undefined => {
  const cachedCursorPosition = getCachedCursorPosition();
  if (!cachedCursorPosition) {
    return undefined;
  }
  return cachedCursorPosition.quote;
};
