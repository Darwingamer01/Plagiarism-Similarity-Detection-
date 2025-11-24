import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/utils'
import { Button } from '../button'

describe('Button', () => {
    it('renders with default variant', () => {
        render(<Button>Click me</Button>)
        const button = screen.getByRole('button', { name: /click me/i })
        expect(button).toBeInTheDocument()
    })

    it('renders with different variants', () => {
        const { rerender } = render(<Button variant="destructive">Delete</Button>)
        expect(screen.getByRole('button')).toHaveClass('bg-destructive')

        rerender(<Button variant="outline">Outline</Button>)
        expect(screen.getByRole('button')).toHaveClass('border')

        rerender(<Button variant="ghost">Ghost</Button>)
        expect(screen.getByRole('button')).toHaveClass('hover:bg-accent')
    })

    it('handles click events', () => {
        const handleClick = vi.fn()
        render(<Button onClick={handleClick}>Click me</Button>)

        const button = screen.getByRole('button')
        button.click()

        expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('can be disabled', () => {
        const handleClick = vi.fn()
        render(<Button disabled onClick={handleClick}>Disabled</Button>)

        const button = screen.getByRole('button')
        expect(button).toBeDisabled()

        button.click()
        expect(handleClick).not.toHaveBeenCalled()
    })

    it('applies custom className', () => {
        render(<Button className="custom-class">Custom</Button>)
        expect(screen.getByRole('button')).toHaveClass('custom-class')
    })
})
