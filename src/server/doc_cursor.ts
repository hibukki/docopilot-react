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
  const cursorOffset = cursor.getOffset();
  const body = DocumentApp.getActiveDocument().getBody();

  for (let i = 0; i < quotes.length; i += 1) {
    const quote = quotes[i];
    if (quote) {
      // Only search if the quote is not empty
      let searchResult = body.findText(quote);
      while (searchResult !== null) {
        const foundElement = searchResult.getElement();
        const startOffset = searchResult.getStartOffset();
        const endOffset = searchResult.getEndOffsetInclusive();

        // Check if the cursor is within the bounds of this found text range
        // Offset is the position *before* the cursor
        if (
          foundElement.getType() === cursorElement.getType() &&
          foundElement.asText().getText() ===
            cursorElement.asText().getText() && // Ensure it's the exact same element
          cursorOffset > startOffset &&
          cursorOffset <= endOffset + 1
        ) {
          return i; // Cursor is within this quote occurrence
        }

        // Find the next occurrence
        searchResult = body.findText(quote, searchResult);
      }
    }
  }

  return -1; // No matching quote found at cursor position
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

export const refreshCursorPosition = (): void => {
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

export const onSidebarCommentSetFocus = (quote: string) => {
  setCachedCursorPosition({ quote, source: 'sidebar' });

  // Move cursor on the doc to the beginning of the quote
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  const rangeElement = body.findText(quote);
  if (rangeElement) {
    const element = rangeElement.getElement();
    const startOffset = rangeElement.getStartOffset();
    // Create a position at the start of the found text
    const position = doc.newPosition(element, startOffset);
    doc.setCursor(position);
  }
};
