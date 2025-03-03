import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// Disable React Router warnings about future changes
const originalWarn = console.warn;
console.warn = (...args) => {
  if (args[0]?.includes?.('React Router')) return;
  originalWarn.apply(console, args);
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL || '/'}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)