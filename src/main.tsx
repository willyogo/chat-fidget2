import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Filter out specific Zustand deprecation warnings from content scripts
const originalWarn = console.warn;
console.warn = (...args) => {
  // Filter out specific Zustand deprecation warnings
  if (
    args[0]?.includes?.('[DEPRECATED] `getStorage`, `serialize` and `deserialize`') ||
    args[0]?.includes?.('[DEPRECATED] Default export is deprecated. Instead use import { createStore }') ||
    args[0]?.includes?.('[DEPRECATED] Default export is deprecated. Instead use `import { create }') ||
    args[0]?.includes?.('[DEPRECATED] Passing a vanilla store will be unsupported')
  ) {
    return;
  }
  originalWarn.apply(console, args);
};

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);