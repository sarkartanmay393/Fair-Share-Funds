import { render, screen } from "@testing-library/react"
import { AuthModal } from "../pages/Auth.page"

test('renders auth modal', () => {
  render(<AuthModal />)
  const toggleEle = screen.getAllByText('signup')
  expect(toggleEle).toBeInTheDocument();
})