import { render, screen } from "@testing-library/react"
import { AuthModal } from "../components/AuthModal"

test('renders auth modal', () => {
  render(<AuthModal open={true} setOpen={() => { }} />)
  const toggleEle = screen.getAllByText('signup')
  expect(toggleEle).toBeInTheDocument();
})