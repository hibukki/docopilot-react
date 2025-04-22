// Google Docs functionality
export const getDocText = () => {
  const doc = DocumentApp.getActiveDocument();
  const text = doc.getBody().getText();
  return text;
};

export const getCursorPosition = (): GoogleAppsScript.Document.Position => {
  const doc = DocumentApp.getActiveDocument();
  const cursor = doc.getCursor();
  return cursor;
};

const HIGHLIGHT_COLOR = '#FFF8C4'; // Light yellow/orange
const FOCUSED_HIGHLIGHT_COLOR = '#FFD54F'; // A slightly more orange/yellow, similar to Docs focus

// Helper function to apply highlight
const applyHighlight = (
  body: GoogleAppsScript.Document.Body,
  searchText: string,
  color: string
) => {
  let searchResult = body.findText(searchText);
  while (searchResult) {
    const element = searchResult.getElement();
    // Ensure the found element is a Text element
    if (element.getType() === DocumentApp.ElementType.TEXT) {
      const textElement = element.asText();
      const start = searchResult.getStartOffset();
      const end = searchResult.getEndOffsetInclusive();
      // Only apply color if it's part of the Text element found
      if (start !== -1 && end !== -1) {
        textElement.setBackgroundColor(start, end, color);
      }
    }
    // Continue searching from the position after the current match
    searchResult = body.findText(searchText, searchResult);
  }
};

/**
 * Highlights the specified text segments (quotes) in the document.
 * Optionally highlights one specific quote with a different focus color.
 *
 * @param {string[]} quotesToHighlight An array of quote strings to find and highlight.
 * @param {string | null} [quoteInFocus] Optional. The specific quote string to highlight with the focus color.
 */
export const highlightCommentsInDoc = (
  quotesToHighlight: string[],
  quoteInFocus: string | null = null
) => {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();

  // 1. Clear all existing highlights in the document body
  // Find all text elements and clear their background
  let clearSearchResult = body.findText('.+'); // Use .+ to find any character sequence
  while (clearSearchResult) {
    const element = clearSearchResult.getElement();
    if (element.getType() === DocumentApp.ElementType.TEXT) {
      const textElement = element.asText();
      const start = clearSearchResult.getStartOffset();
      const end = clearSearchResult.getEndOffsetInclusive();
      if (start !== -1 && end !== -1) {
        // Setting background color to null clears it - cast null to any to bypass strict types
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        textElement.setBackgroundColor(start, end, null as any);
      }
    }
    clearSearchResult = body.findText('.+', clearSearchResult);
  }

  // 2. Highlight all quotes with the standard color
  quotesToHighlight.forEach((quote) => {
    // Ensure quote is a non-empty string and not the focused one
    if (
      quote &&
      typeof quote === 'string' &&
      quote.trim() !== '' &&
      quote !== quoteInFocus
    ) {
      applyHighlight(body, quote, HIGHLIGHT_COLOR);
    }
  });

  // 3. Highlight the specific focused quote with the focus color
  if (
    quoteInFocus &&
    typeof quoteInFocus === 'string' &&
    quoteInFocus.trim() !== ''
  ) {
    applyHighlight(body, quoteInFocus, FOCUSED_HIGHLIGHT_COLOR);
  }
};
