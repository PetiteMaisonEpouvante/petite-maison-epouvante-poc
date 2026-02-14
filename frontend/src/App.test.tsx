import { vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

vi.mock('@auth0/auth0-react', () => ({
  Auth0Provider: ({ children }: any) => children,
  useAuth0: () => ({
    isAuthenticated: false,
    user: null,
    loginWithRedirect: vi.fn(),
    logout: vi.fn(),
    getAccessTokenSilently: vi.fn(),
  }),
}))

describe('App', () => {
  it('renders application title', async () => {
    render(<App />)
    expect(await screen.findByText(/Espace communautaire de troc et/i)).toBeInTheDocument()
  })
})
