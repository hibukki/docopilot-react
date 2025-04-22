import {
  getCursorPosition as getDocCursorPosition,
  highlightCommentsInDoc,
} from './doc';
import {
  //   getCachedCursorPosition,
  getCachedComments,
  CursorSource,
  getCachedDocCursorPosition,
  setCachedDocCursorPosition,
  DocCursorPosition,
  getFocusedQuote,
  setFocusedQuote,
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

export const onQuoteChanged = (quote: string | null, source: CursorSource) => {
  const previousFocusedQuote = getFocusedQuote();

  if (previousFocusedQuote) {
    if (previousFocusedQuote.skipNextDocUpdate && source === 'document') {
      // If this is the duplicate update we expect from the doc, then this is the one we had to skip
      if (previousFocusedQuote.quote === quote) {
        setFocusedQuote({
          ...previousFocusedQuote,
          skipNextDocUpdate: false,
        });
      }

      // Anyway don't listen to doc updates until the 'skip' is cleared
      return;
    }
  }

  setFocusedQuote({
    quote,
    source,
    skipNextDocUpdate: source === 'sidebar', // After an update from the sidebar, skip one quote
  });

  const allQuotes =
    getCachedComments()?.comments.map((c) => c.quoted_text) ?? [];

  highlightCommentsInDoc(allQuotes, quote);
};

export const onCursorChangedFromDoc = (
  newCursor: GoogleAppsScript.Document.Position
) => {
  const cachedComments = getCachedComments();
  if (!cachedComments) {
    return;
  }
  const quotes = cachedComments.comments.map((c) => c.quoted_text);

  const quoteIndex = findQuoteIndexAtCursor(quotes, newCursor);

  const quoteInFocus = quoteIndex !== -1 ? quotes[quoteIndex] : null;

  onQuoteChanged(quoteInFocus, 'document');
};

export const refreshCursorPosition = (): void => {
  const cursor = getDocCursorPosition();

  const currentCursorPosition: DocCursorPosition = {
    offset: cursor.getOffset(),
    source: 'document',
  };

  const cachedDocCursorPosition = getCachedDocCursorPosition();

  // If doc cursor didn't change
  if (
    cachedDocCursorPosition &&
    cachedDocCursorPosition.offset === currentCursorPosition.offset
  ) {
    return;
  }
  setCachedDocCursorPosition(currentCursorPosition);

  onCursorChangedFromDoc(cursor);
};

// Used by sidebar
export const getCursorQuote = (): string | null => {
  const focusedQuote = getFocusedQuote();
  if (!focusedQuote) {
    return null;
  }
  return focusedQuote.quote;
};

export const onSidebarCommentSetFocus = (quote: string) => {
  onQuoteChanged(quote, 'sidebar');

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
