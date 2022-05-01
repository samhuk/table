import express from 'express'
import path from 'path'
import * as fs from 'fs'
import { addHotReloadingMiddleware } from './appFeatures'
import { env } from './env'

/* eslint-disable no-console */

const app = express()

// Hot-reloading
addHotReloadingMiddleware(app)

// We use the backend to serve client files
const clientDir = path.resolve(__dirname, '../client')

app
  .get('*', (req, res) => {
    const clientFilePath = path.resolve(clientDir, `./${req.url}`)
    // If the client file exists, serve it
    if (fs.existsSync(clientFilePath))
      res.sendFile(req.url, { root: clientDir })
    // Else send index.html
    else
      res.sendFile('/', { root: clientDir })
  })

app.listen(env.port, '0.0.0.0', () => {
  const url = `http://localhost:${env.port}`
  console.log(`API started. Access via ${url}.`)
})
