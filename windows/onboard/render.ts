/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.ts` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import '../shared/css/global.css'

import { init as SentryInit } from '@sentry/electron/renderer'
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

SentryInit({
  // Adds request headers and IP for users, for more info visit:
  // https://docs.sentry.io/platforms/javascript/guides/electron/configuration/options/#sendDefaultPii
  // sendDefaultPii: true,
  integrations: [],
})

const root = createRoot(document.body)

root.render(
  React.createElement(React.StrictMode, null, React.createElement(App, null))
)
