import '../shared/global.css'

import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

const root = createRoot(document.body)

root.render(
  React.createElement(React.StrictMode, null, React.createElement(App, null))
)
