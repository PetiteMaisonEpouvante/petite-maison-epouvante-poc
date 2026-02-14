import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders application title', () => {
    render(<App />)
    expect(screen.getByText(/Espace communautaire de troc et/i)).toBeInTheDocument()
  })
})
