import { Typography, Box, Paper, Button } from '@mui/material';
import { useState } from 'react';
import Settings from './Settings';
import Comments from './Comments';

const Docopilot = () => {
  const [lastError, setLastError] = useState(null);

  const handleError = (error) => {
    console.error('Docopilot caught error:', error);
    setLastError(error);
  };

  const clearError = () => {
    setLastError(null);
  };

  return (
    <Box
      sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <Typography variant="h6" gutterBottom>
          Docopilot
        </Typography>

        <Settings onError={handleError} />

        <Comments onError={handleError} />
      </Box>

      {lastError && (
        <Paper
          elevation={3}
          sx={{
            p: 2,
            mt: 2,
            backgroundColor: 'error.light',
            color: 'error.contrastText',
            maxHeight: '30%',
            overflowY: 'auto',
            flexShrink: 0,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1,
            }}
          >
            <Typography variant="subtitle2">Last Error:</Typography>
            <Button size="small" onClick={clearError} color="inherit">
              Dismiss
            </Button>
          </Box>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {lastError.message || 'An unknown error occurred'}
          </Typography>
          {lastError.stack && (
            <Typography
              component="pre"
              variant="caption"
              sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}
            >
              {lastError.stack}
            </Typography>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default Docopilot;
