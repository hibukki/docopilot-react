import { Typography, Paper, useTheme, Box, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { serverFunctions } from '../../utils/serverFunctions';

const Comments = ({ onError }) => {
  const theme = useTheme();
  const [comments, setComments] = useState([]);
  const [activeCommentIndex, setActiveCommentIndex] = useState(null);

  const fetchComments = () => {
    serverFunctions
      .getComments()
      .then((response) => setComments(response.comments))
      .catch((err) => {
        onError(err);
      });
  };

  useEffect(() => {
    fetchComments(); // Fetch immediately on mount
    // const intervalId = setInterval(fetchComments, 1000); // Fetch every second

    // return () => {
    //   clearInterval(intervalId); // Clear interval on unmount
    // };
  });

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
          Comments
        </Typography>
        <Button variant="outlined" size="small" onClick={fetchComments}>
          Refresh
        </Button>
      </Box>
      {comments.length === 0 ? (
        <Typography variant="body2" color="textSecondary">
          No comments found.
        </Typography>
      ) : (
        comments.map((comment, i) => (
          <Paper
            key={i}
            onClick={() => setActiveCommentIndex(i)}
            variant="outlined"
            sx={{
              p: 1,
              mb: 1,
              borderLeft: `4px solid ${theme.palette.primary.main}`,
              borderRadius: theme.shape.borderRadius,
              cursor: 'pointer',
              backgroundColor:
                activeCommentIndex === i
                  ? theme.palette.action.selected
                  : 'transparent',
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <Typography variant="body2">{comment.comment_text}</Typography>
          </Paper>
        ))
      )}
    </Box>
  );
};

export default Comments;
