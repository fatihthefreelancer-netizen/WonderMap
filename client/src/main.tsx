import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { unlockSfx } from './lib/sfx';
import App from './App';
import './styles/index.css';

// Browsers only allow audio after a gesture, so arm the engine on the first one.
for (const evt of ['pointerdown', 'keydown', 'touchstart'] as const) {
  window.addEventListener(evt, () => unlockSfx(), { once: false, passive: true });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
