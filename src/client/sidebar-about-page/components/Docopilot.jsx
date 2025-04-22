import { Typography, Paper, useTheme } from '@mui/material';
import { useState, useEffect } from 'react';
import { serverFunctions } from '../../utils/serverFunctions';

const Docopilot = () => {
  const theme = useTheme();
  const [comments, setComments] = useState([]);

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
        <b>☀️ React app inside a sidebar! omg3 ☀️</b>
      </p>
      <a
        href="https://www.github.com/enuchi/React-Google-Apps-Script"
        target="_blank"
        rel="noopener noreferrer"
      >
        React + Google Apps Script
      </a>
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
            variant="outlined"
            sx={{
              p: 1,
              mb: 1,
              borderLeft: `4px solid ${theme.palette.primary.main}`,
            }}
          >
            <Typography variant="subtitle2" gutterBottom>
              {comment.quoted_text}
            </Typography>
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
