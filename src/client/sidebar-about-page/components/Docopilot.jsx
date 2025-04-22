import { Typography, Paper, useTheme } from '@mui/material';
import { useState, useEffect } from 'react';
import { serverFunctions } from '../../utils/serverFunctions';

const Docopilot = () => {
  const theme = useTheme();
  const [comments, setComments] = useState([]);
  const [activeCommentIndex, setActiveCommentIndex] = useState(null);

  useEffect(() => {
    serverFunctions
      .getComments()
      .then((response) => setComments(response.comments))
      .catch((err) => {
        console.error(err);
        alert(err);
      });
  }, []);

  return (
    <div>
      <p>
        <b>Docopilot - get comments on your doc from an LLM</b>
      </p>
      <Typography variant="h5" gutterBottom>
        Comments
      </Typography>
      {comments.length === 0 ? (
        <Typography variant="body2" color="textSecondary">
          No comments
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
      <Typography variant="h4" gutterBottom>
        MUI demo!
      </Typography>
    </div>
  );
};

export default Docopilot;
