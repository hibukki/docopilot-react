import { Typography, Paper, useTheme, Box, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { serverFunctions } from '../../utils/serverFunctions';

const Comments = ({ onError }) => {
  const theme = useTheme();
  const [comments, setComments] = useState([]);
  const [activeCommentIndex, setActiveCommentIndex] = useState(null);
  const [quoteOverrideBySidebar, setQuoteOverrideBySidebar] = useState(null);

  const fetchTick = () => {
    console.log('Fetching comments and focused quote');
    Promise.all([
      serverFunctions.getComments(),
      serverFunctions.getCursorQuote(),
    ])
      .then(([commentsResponse, focusedQuoteFromServer]) => {
        setComments(commentsResponse.comments);

        if (quoteOverrideBySidebar) {
          if (focusedQuoteFromServer === quoteOverrideBySidebar) {
            setQuoteOverrideBySidebar(null); // The server got updated by the sidebar click, nothing more to remember, the server is the source of truth again
          } else {
            return; // Ignore the quote from the server, it isn't updated by the sidebar click
          }
        }

        if (focusedQuoteFromServer) {
          const index = commentsResponse.comments.findIndex(
            (c) => c.quoted_text === focusedQuoteFromServer
          );
          setActiveCommentIndex(index !== -1 ? index : null);
        } else {
          setActiveCommentIndex(null);
        }
      })
      .catch((err) => {
        onError(err);
      });
  };

  const docopilotTick = () => {
    serverFunctions.docopilotTick();
  };

  useEffect(() => {
    fetchTick(); // Fetch immediately on mount
    const commentsIntervalId = setInterval(fetchTick, 1000); // Fetch every second
    const tickIntervalId = setInterval(docopilotTick, 1000); // Call every second (because this backend can't trigger itself)

    return () => {
      clearInterval(commentsIntervalId);
      clearInterval(tickIntervalId);
    };
  }, [quoteOverrideBySidebar, activeCommentIndex]);

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
          Comments
        </Typography>
        <Button variant="outlined" size="small" onClick={fetchTick}>
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
            onClick={() => {
              console.log('onClick', comment.quoted_text);
              setQuoteOverrideBySidebar(comment.quoted_text); // The sidebar is deciding a quote which is different from the server, and it will take the server a moment to update, so remember which quote this is
              setActiveCommentIndex(i);
              setQuoteOverrideBySidebar(comment.quoted_text);
              serverFunctions.onSidebarCommentSetFocus(comment.quoted_text);
            }}
            variant="outlined"
            sx={{
              p: 1.5,
              mb: 1,
              borderLeft: `4px solid ${theme.palette.divider}`,
              border: '1px solid transparent',
              borderRadius: theme.shape.borderRadius,
              cursor: 'pointer',
              transition:
                'transform 0.1s ease-in-out, background-color 0.1s ease-in-out, border 0.1s ease-in-out, box-shadow 0.1s ease-in-out',
              ...(activeCommentIndex === i && {
                border: `1px solid ${theme.palette.primary.main}`,
                borderLeftWidth: '4px',
                borderLeftColor: theme.palette.primary.main,
                backgroundColor: theme.palette.action.selected,
              }),
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
                transform: 'scale(1.01)',
                boxShadow: theme.shadows[2],
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
