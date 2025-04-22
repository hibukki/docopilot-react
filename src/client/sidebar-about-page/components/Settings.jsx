import {
  Typography,
  Button,
  Collapse,
  TextField,
  Box,
  Paper,
  useTheme,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { serverFunctions } from '../../utils/serverFunctions';

const Settings = () => {
  const theme = useTheme();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [promptInput, setPromptInput] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState('');

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
    <>
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
    </>
  );
};

export default Settings;
