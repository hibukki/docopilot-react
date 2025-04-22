export type Comment = {
  quoted_text: string;
  comment_text: string;
};

export type GetCommentsResponse = {
  comments: Comment[];
};

export type LLMResponse = {
  thinking: string;
  comments: {
    quote: string;
    comment: string;
  }[];
};

export const getComments = (): GetCommentsResponse => {
  return {
    comments: [
      {
        quoted_text: 'Text being commented on',
        comment_text: 'What I think about this text',
      },
    ],
  };
};

export const docopilotMainLoop = () => {
  // TODO: Every second,
  // if the document text changed, prompt the LLM for comments and save them somewhere accessible for getComments to retrieve
};
