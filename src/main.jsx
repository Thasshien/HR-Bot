import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App_Context_Provider from './context/Context.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
   
      
       <App_Context_Provider><App /></App_Context_Provider>
    </BrowserRouter>
  </StrictMode>,
)
