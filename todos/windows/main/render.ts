import '../shared/global.css'

import React from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './router'

const root = createRoot(document.body)

root.render(
  React.createElement(
    React.StrictMode,
    null,
    React.createElement(RouterProvider, { router })
  )
)
