import {
  Typography,
  Paper,
  useTheme,
  Button,
  Collapse,
  TextField,
  Box,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { serverFunctions } from '../../utils/serverFunctions';

const Docopilot = () => {
  const theme = useTheme();
  const [comments, setComments] = useState([]);
  const [activeCommentIndex, setActiveCommentIndex] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [promptInput, setPromptInput] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState('');

  const fetchComments = () => {
    serverFunctions
      .getComments()
      .then((response) => setComments(response.comments))
      .catch((err) => {
        console.error('Error fetching comments:', err);
        alert(`Error fetching comments: ${err.message || err}`);
      });
  };

  const fetchCurrentPrompt = () => {
    serverFunctions
      .getCurrentPrompt()
      .then(setCurrentPrompt)
      .catch((err) => {
        console.error('Error fetching current prompt:', err);
        alert(`Error fetching current prompt: ${err.message || err}`);
      });
  };

  useEffect(() => {
    fetchComments();
    fetchCurrentPrompt();
  }, []);

  const toggleSettings = () => {
    setSettingsOpen(!settingsOpen);
  };

  const handleSaveApiKey = () => {
    serverFunctions
      .setGeminiApiKey(apiKeyInput)
      .then(() => {
        alert('API Key saved successfully!');
        setApiKeyInput(''); // Clear input after saving
      })
      .catch((err) => {
        console.error('Error saving API key:', err);
        alert(`Error saving API key: ${err.message || err}`);
      });
  };

  const handleSavePrompt = () => {
    serverFunctions
      .setUserPrompt(promptInput)
      .then(() => {
        alert('Prompt saved successfully!');
        fetchCurrentPrompt(); // Re-fetch the current prompt to update display
        // Optionally clear input: setPromptInput('');
      })
      .catch((err) => {
        console.error('Error saving prompt:', err);
        alert(`Error saving prompt: ${err.message || err}`);
      });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Docopilot
      </Typography>

      {/* Settings Section */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1,
          cursor: 'pointer',
          borderBottom: `1px solid ${theme.palette.divider}`,
          pb: 1,
        }}
        onClick={toggleSettings}
      >
        <Typography variant="subtitle1">
          {settingsOpen ? '[-] Settings' : '[+] Settings'}
        </Typography>
      </Box>
      <Collapse in={settingsOpen}>
        <Box sx={{ mb: 2, pl: 1, pr: 1 }}>
          <Typography variant="body2" gutterBottom>
            Gemini API Key
          </Typography>
          <TextField
            fullWidth
            type="password"
            size="small"
            variant="outlined"
            placeholder="Enter your Gemini API Key"
            value={apiKeyInput}
            onChange={(e) => setApiKeyInput(e.target.value)}
            sx={{ mb: 1 }}
          />
          <Button
            variant="contained"
            size="small"
            onClick={handleSaveApiKey}
            disabled={!apiKeyInput}
          >
            Save Key
          </Button>
        </Box>
        <Box sx={{ mb: 2, pl: 1, pr: 1 }}>
          <Typography variant="body2" gutterBottom>
            Custom Prompt
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            size="small"
            variant="outlined"
            placeholder="Enter custom prompt (leave blank for default)"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            sx={{ mb: 1 }}
          />
          <Button variant="contained" size="small" onClick={handleSavePrompt}>
            Save Prompt
          </Button>
        </Box>
        <Box sx={{ mb: 2, pl: 1, pr: 1 }}>
          <Typography variant="body2" gutterBottom>
            Current Active Prompt:
          </Typography>
          <Paper
            variant="outlined"
            sx={{ p: 1, backgroundColor: theme.palette.background.default }}
          >
            <Typography
              variant="caption"
              sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
            >
              {currentPrompt || 'Using default prompt'}
            </Typography>
          </Paper>
        </Box>
      </Collapse>

      {/* Comments Section */}
      <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
        Comments
      </Typography>
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

export default Docopilot;
