import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { globalUtil } from './utils/global-util.ts'

globalUtil.init()

const strictApp = (
  <StrictMode>
    <App />
  </StrictMode>
)

const app = <App />

createRoot(document.getElementById('root')).render(strictApp)
