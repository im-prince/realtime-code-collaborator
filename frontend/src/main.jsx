import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import * as monaco from 'monaco-editor';
import { loader } from '@monaco-editor/react';
import editorWorker from '../node_modules/monaco-editor/esm/vs/editor/editor.worker.js?worker';
import App from './App.jsx';
import './index.css';

self.MonacoEnvironment = {
  getWorker: () => new editorWorker(),
};

loader.config({ monaco });

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);