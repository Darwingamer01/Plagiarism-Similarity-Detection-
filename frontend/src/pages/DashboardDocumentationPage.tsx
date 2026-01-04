import PageTransition from '../components/layout/PageTransition'
import { DashboardDocumentationContent } from '../components/documentation/DashboardDocumentationContent'

export default function DashboardDocumentationPage() {
    return (
        <PageTransition>
            <div className="w-full">
                <DashboardDocumentationContent />
            </div>
        </PageTransition>
    )
}
