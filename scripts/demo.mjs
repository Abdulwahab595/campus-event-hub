import { spawn } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { setTimeout as delay } from 'node:timers/promises'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const serverDir = join(root, 'server')
const children = new Set()
let stopping = false

function stop(code = 0) {
  if (stopping) return
  stopping = true
  for (const child of children) child.kill()
  process.exitCode = code
}

function launch(command, args, options = {}) {
  const child = spawn(command, args, { cwd: root, stdio: 'inherit', windowsHide: true, ...options })
  children.add(child)
  child.once('exit', () => children.delete(child))
  child.once('error', () => children.delete(child))
  return child
}

function run(command, args, options) {
  return new Promise((resolve, reject) => {
    if (stopping) return reject(new Error('Demo stopped.'))
    const child = launch(command, args, options)
    child.once('error', reject)
    child.once('exit', (code) => {
      if (stopping) reject(new Error('Demo stopped.'))
      else resolve(code ?? 1)
    })
  })
}

async function main() {
  if (!existsSync(join(root, 'node_modules/vite/bin/vite.js')) || !existsSync(join(serverDir, 'node_modules/dotenv'))) {
    throw new Error('Install dependencies first: npm ci, then npm --prefix server ci.')
  }
  if (!existsSync(join(serverDir, '.env'))) {
    throw new Error('Create server/.env using server/.env.example before starting the demo.')
  }

  const require = createRequire(join(serverDir, 'package.json'))
  const settings = require('dotenv').parse(readFileSync(join(serverDir, '.env')))
  for (const key of ['MONGO_URI', 'JWT_SECRET', 'VERIFICATION_SECRET']) {
    if (!(process.env[key] || settings[key])) throw new Error(`Set ${key} in server/.env.`)
  }
  const mongoUri = process.env.MONGO_URI || settings.MONGO_URI
  const port = Number(process.env.PORT || settings.PORT || 5000)
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Set PORT to a valid port number in server/.env.')

  // Only start the bundled database when this project is configured to use it.
  if (/^mongodb:\/\/(127\.0\.0\.1|localhost):27017\//.test(mongoUri)) {
    let dockerReady
    try {
      dockerReady = await run('docker', ['info', '--format', '{{.ServerVersion}}'], { stdio: 'ignore' }) === 0
    } catch {
      throw new Error('Docker Desktop is required for local MongoDB. Install it, then run npm run demo again.')
    }
    if (!dockerReady && process.platform === 'win32') {
      console.log('Starting Docker Desktop...')
      if (await run('docker', ['desktop', 'start', '--timeout', '60']) !== 0) {
        throw new Error('Open Docker Desktop and wait for Engine running, then run npm run demo again.')
      }
      dockerReady = await run('docker', ['info', '--format', '{{.ServerVersion}}'], { stdio: 'ignore' }) === 0
    }
    if (!dockerReady) throw new Error('Docker is unavailable. Open Docker Desktop and check that your terminal can run docker info.')

    console.log('Starting MongoDB (the first run may need to download its image)...')
    if (await run('docker', ['compose', 'up', '-d', '--wait', '--wait-timeout', '60']) !== 0) {
      throw new Error('MongoDB did not start. Check the Docker output above; port 27017 may already be in use.')
    }
  }

  console.log('Starting backend...')
  const backend = launch(process.execPath, ['index.js'], { cwd: serverDir })
  backend.once('error', (error) => { console.error(error.message); stop(1) })
  backend.once('exit', (code) => stop(code || 1))

  let ready = false
  for (let attempt = 0; attempt < 60 && !stopping; attempt++) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/`, { signal: AbortSignal.timeout(1000) })
      const result = await response.json()
      if (response.ok && result.message === 'Campus Event Hub API is running') { ready = true; break }
    } catch { /* Wait for the backend to connect to MongoDB. */ }
    await delay(250)
  }
  if (stopping) return
  if (!ready) throw new Error('The backend did not become ready. Check its output above.')

  console.log('\nBackend ready. Starting frontend at http://localhost:5173. Press Ctrl+C to stop both servers.\n')
  const frontend = launch(process.execPath, [join(root, 'node_modules/vite/bin/vite.js'), '--port', '5173', '--strictPort'], {
    env: { ...process.env, VITE_API_URL: `http://localhost:${port}` },
  })
  frontend.once('error', (error) => { console.error(error.message); stop(1) })
  frontend.once('exit', (code) => stop(code || 1))
}

process.once('SIGINT', () => stop())
process.once('SIGTERM', () => stop())
main().catch((error) => {
  if (stopping) return
  console.error(`\nDemo could not start: ${error.message}`)
  stop(1)
})
