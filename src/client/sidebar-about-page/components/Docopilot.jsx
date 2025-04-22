import { Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { serverFunctions } from '../../utils/serverFunctions';

const Docopilot = () => {
  const [query] = useState('');
  const [response, setResponse] = useState('');

  useEffect(() => {
    serverFunctions.queryLLM(query).then(setResponse).catch(alert);
  }, [query]);

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
      <p>Query response: {response}</p>
      <Typography variant="h4" gutterBottom>
        MUI demo!
      </Typography>
    </div>
  );
};

export default Docopilot;
