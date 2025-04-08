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

// NOTE: 严格模式，很多信息会打印两次
// createRoot(document.getElementById('root')).render(strictApp)
createRoot(document.getElementById('root')).render(app)
