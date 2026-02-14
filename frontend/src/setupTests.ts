import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => cleanup())

// Empêche les vraies requêtes réseau pendant les tests
vi.stubGlobal('fetch', vi.fn(() =>
  Promise.reject(new Error('fetch is disabled in tests'))
) as any)
