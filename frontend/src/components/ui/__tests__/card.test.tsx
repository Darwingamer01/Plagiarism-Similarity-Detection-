import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/utils'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../card'

describe('Card', () => {
    it('renders all subcomponents correctly', () => {
        render(
            <Card>
                <CardHeader>
                    <CardTitle>Card Title</CardTitle>
                </CardHeader>
                <CardContent>Card Content</CardContent>
                <CardFooter>Card Footer</CardFooter>
            </Card>
        )

        expect(screen.getByText('Card Title')).toBeInTheDocument()
        expect(screen.getByText('Card Content')).toBeInTheDocument()
        expect(screen.getByText('Card Footer')).toBeInTheDocument()
    })

    it('applies custom className', () => {
           const { container } = render(<Card className="custom-card">Content</Card>)
           // The Card is the root element, so container.firstChild should be the Card div
           expect(container.firstChild).toHaveClass('custom-card')
    })
})
