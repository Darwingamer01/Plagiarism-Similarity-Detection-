import { Outlet } from 'react-router-dom'
import Header from './Header'

export default function HeaderOnlyLayout() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header with no menu toggle needed since there's no sidebar */}
            <Header />

            <main className="flex-1 flex items-center justify-center p-4 w-full">
                <div className="w-full max-w-5xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}
