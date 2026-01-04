import { PublicDocumentationContent } from '../components/documentation/PublicDocumentationContent'
import { LandingHeader } from '../components/layout/LandingHeader'


export default function DocumentationPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <LandingHeader />
            <div className="flex-1">
                <PublicDocumentationContent />
            </div>
        </div>
    )
}
