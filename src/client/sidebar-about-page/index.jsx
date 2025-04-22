import { createRoot } from 'react-dom/client';
import Docopilot from './components/Docopilot';

const container = document.getElementById('index');
const root = createRoot(container);
root.render(<Docopilot />);
