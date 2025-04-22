export const DEFAULT_PROMPT = `Please review the following document text and find comments that might be helpful to the user. They will be displayed in a sidebar.

First, provide your reasoning or thought process in a 'thinking' field. Then, provide the comments in a 'comments' field.

Present your output STRICTLY as a single JSON object with two keys: "thinking" (containing your thought process as a string) and "comments" (containing a JSON array of comment objects). Each comment object in the array must have a "quote" key (containing the exact text phrase) and a "comment" key (containing your feedback).

Example format:
{
  "thinking": "The document seems to be about X. The user might struggle with Y and Z.",
  "comments": [
    {
      "quote": "This is a sentence to comment on.",
      "comment": "This sentence could be clearer."
    },
    {
      "quote": "Another phrase needing feedback.",
      "comment": "Consider rephrasing this part."
    }
  ]
}

Do not include any text outside of this single JSON object structure.

Document Text:
---
{docText}
---`;
