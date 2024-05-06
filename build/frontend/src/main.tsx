import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { AuthProvider } from './context.js'

console.log(document.getElementById('root')); // Check if the element exists
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
	<AuthProvider>
    	<App />
	</AuthProvider>
  </React.StrictMode>,
)
