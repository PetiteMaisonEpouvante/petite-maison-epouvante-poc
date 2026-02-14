import '@testing-library/jest-dom/vitest'
import { afterEach, beforeAll, afterAll, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => cleanup())

// 1) Bloque fetch
beforeAll(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn(() => Promise.reject(new Error('Network disabled in tests (fetch)')))
  )
})

// 2) Bloque XHR (c’est LUI qui te fait planter)
class BlockedXHR {
  open() {
    throw new Error('Network disabled in tests (XMLHttpRequest.open)')
  }
  send() {
    throw new Error('Network disabled in tests (XMLHttpRequest.send)')
  }
  setRequestHeader() {}
  addEventListener() {}
  removeEventListener() {}
  get responseText() {
    return ''
  }
  get status() {
    return 0
  }
}

beforeAll(() => {
  globalThis.XMLHttpRequest = BlockedXHR as any
})

// 3) Optionnel: évite que jsdom charge des ressources (images/css) et déclenche des requêtes
beforeAll(() => {
  vi.stubGlobal('Image', class {
    onload: null | (() => void) = null
    onerror: null | (() => void) = null
    set src(_v: string) {
      // pas de réseau
      queueMicrotask(() => this.onload?.())
    }
  })
})

// 4) Si un composant déclenche quand même un truc async, on veut pas un “Unhandled Rejection” silencieux
let unhandled: any[] = []

beforeAll(() => {
  const handler = (event: PromiseRejectionEvent) => {
    unhandled.push(event.reason)
  }
  globalThis.addEventListener('unhandledrejection', handler as any)
})

afterAll(() => {
  if (unhandled.length) {
    throw new Error(
      `UnhandledRejection(s) during tests:\n` +
        unhandled.map((e) => String(e?.stack || e)).join('\n\n')
    )
  }
})
