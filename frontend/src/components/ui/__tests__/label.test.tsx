import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/utils'
import { Label } from '../label'

describe('Label', () => {
    it('renders correctly', () => {
        render(<Label>Test Label</Label>)
        expect(screen.getByText('Test Label')).toBeInTheDocument()
    })

    it('supports htmlFor attribute', () => {
        render(<Label htmlFor="test-input">Input Label</Label>)
        // Label with htmlFor usually corresponds to a label role, but let's check attribute directly
        const label = screen.getByText('Input Label')
        expect(label).toHaveAttribute('for', 'test-input')
    })

    it('applies custom className', () => {
        render(<Label className="custom-label">Label</Label>)
        expect(screen.getByText('Label')).toHaveClass('custom-label')
    })
})
