export type Comment = {
  quoted_text: string;
  comment_text: string;
};

export type GetCommentsResponse = {
  comments: Comment[];
};

export const emptyComments: GetCommentsResponse = { comments: [] };
