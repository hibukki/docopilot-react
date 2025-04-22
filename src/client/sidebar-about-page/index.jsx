import { createRoot } from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Docopilot from './components/Docopilot';

// Define a Google-inspired theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1a73e8', // Google Blue
    },
    secondary: {
      main: '#ea4335', // Google Red (can be used for accents)
    },
    background: {
      default: '#f8f9fa', // Light grey background
      paper: '#ffffff', // White paper background
    },
    text: {
      primary: '#202124', // Dark grey text
      secondary: '#5f6368', // Lighter grey text
    },
    action: {
      active: 'rgba(0, 0, 0, 0.54)',
      hover: 'rgba(0, 0, 0, 0.04)',
      selected: 'rgba(26, 115, 232, 0.08)', // Light blue for selected/focused
      disabled: 'rgba(0, 0, 0, 0.26)',
      disabledBackground: 'rgba(0, 0, 0, 0.12)',
      focus: 'rgba(26, 115, 232, 0.12)',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    // You might want to adjust font sizes, weights etc. here
  },
  shape: {
    borderRadius: 8, // Slightly rounded corners
  },
});

const container = document.getElementById('index');
const root = createRoot(container);
root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Docopilot />
  </ThemeProvider>
);
