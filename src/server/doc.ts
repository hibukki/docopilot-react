// Google Docs functionality
export const getDocText = () => {
  const doc = DocumentApp.getActiveDocument();
  const text = doc.getBody().getText();
  return text;
};

export const getCursorPosition = () => {
  const doc = DocumentApp.getActiveDocument();
  const cursor = doc.getCursor();
  return cursor.getOffset();
};
