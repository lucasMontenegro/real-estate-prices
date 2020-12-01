import { render, screen } from '@testing-library/react'
import React from 'react'
import Page from './Page'
it('should render', () => {
  render(<Page> it renders </Page>)
  expect(screen.getByText(/it renders/)).toBeInTheDocument()
  expect(screen.getByText(/terrenos charata/i)).toBeInTheDocument()
  expect(screen.getByText(/terrenos\.charata/i)).toBeInTheDocument()
})
