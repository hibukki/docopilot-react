import {
  Typography,
  Box,
} from '@mui/material';
import Settings from './Settings';
import Comments from './Comments';

const Docopilot = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Docopilot
      </Typography>

      <Settings />

      <Comments />
    </Box>
  );
};

export default Docopilot;
