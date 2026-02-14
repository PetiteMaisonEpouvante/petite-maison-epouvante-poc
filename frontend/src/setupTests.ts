// src/setupTests.ts
import '@testing-library/jest-dom/vitest'
import { afterEach, beforeAll, afterAll, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// Nettoyage RTL
afterEach(() => cleanup())

/**
 * ✅ 0) Mock axios (important)
 * Ton app fait des appels via apiClient = axios.create(...)
 * On mock create() pour renvoyer une instance fake -> pas de réseau, pas de XHR, pas de fetch.
 */
beforeAll(() => {
  vi.mock('axios', async () => {
    const actual = await vi.importActual<any>('axios')

    const instance = {
      get: vi.fn(async () => ({ data: [] })),
      post: vi.fn(async () => ({ data: {} })),
      put: vi.fn(async () => ({ data: {} })),
      patch: vi.fn(async () => ({ data: {} })),
      delete: vi.fn(async () => ({ data: {} })),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    }

    return {
      default: {
        ...(actual?.default ?? actual),
        create: vi.fn(() => instance),
      },
    }
  })
})

/**
 * ✅ 1) Bloque fetch (si jamais un composant l’utilise)
 */
beforeAll(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn(() => Promise.reject(new Error('Network disabled in tests (fetch)')))
  )
})

/**
 * ✅ 2) Optionnel: empêche jsdom de “charger” des ressources via Image()
 */
beforeAll(() => {
  vi.stubGlobal(
    'Image',
    class {
      onload: null | (() => void) = null
      onerror: null | (() => void) = null
      set src(_v: string) {
        queueMicrotask(() => this.onload?.())
      }
    } as any
  )
})

/**
 * ✅ 3) Fail si unhandledrejection (mais sans Node "process" -> on utilise l’event browser)
 */
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
        unhandled.map((e) => String((e as any)?.stack || e)).join('\n\n')
    )
  }
})
