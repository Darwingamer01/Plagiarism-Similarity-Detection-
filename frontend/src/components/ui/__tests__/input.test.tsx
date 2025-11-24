import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@/test/utils'
import { Input } from '../input'

describe('Input', () => {
    it('renders correctly', () => {
        render(<Input placeholder="Enter text" />)
        const input = screen.getByPlaceholderText('Enter text')
        expect(input).toBeInTheDocument()
    })

    it('handles value changes', () => {
        const handleChange = vi.fn()
        render(<Input onChange={handleChange} />)
        const input = screen.getByRole('textbox')

        fireEvent.change(input, { target: { value: 'test' } })
        expect(handleChange).toHaveBeenCalled()
    })

    it('can be disabled', () => {
        render(<Input disabled />)
        const input = screen.getByRole('textbox')
        expect(input).toBeDisabled()
    })

    it('renders different types', () => {
        const { rerender } = render(<Input type="password" placeholder="Password" />)
        expect(screen.getByPlaceholderText('Password')).toHaveAttribute('type', 'password')

        rerender(<Input type="email" placeholder="Email" />)
        expect(screen.getByPlaceholderText('Email')).toHaveAttribute('type', 'email')
    })

    it('applies custom className', () => {
        render(<Input className="custom-class" />)
        const input = screen.getByRole('textbox')
        expect(input).toHaveClass('custom-class')
    })
})
