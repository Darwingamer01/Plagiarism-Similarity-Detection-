import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { ArrowLeft, Shield } from 'lucide-react'
import { motion } from 'framer-motion'
import { LandingHeader } from '../components/layout/LandingHeader'
import { LandingFooter } from '../components/layout/LandingFooter'

export default function TermsPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const isMinimal = new URLSearchParams(location.search).get('minimal') === 'true'

    const Content = () => (
        <div className="w-full max-w-[1920px] mx-auto px-4 md:px-8 py-12">
            {!isMinimal ? (
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-6">
                        <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <Shield className="h-8 w-8" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight mb-4">Terms of Service</h1>
                    <p className="text-muted-foreground">Last updated: {new Date().getFullYear()}</p>
                </div>
            ) : (
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="mb-8 hover:bg-transparent pl-0 hover:pl-2 transition-all"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
            )}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
            >
                {isMinimal && (
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">Terms of Service and Privacy Policy</h1>
                        <p className="text-muted-foreground">Last updated: November 22, 2025</p>
                    </div>
                )}

                <div className="prose prose-gray dark:prose-invert max-w-none space-y-6 text-muted-foreground">
                    <p>
                        Welcome to Plagiarism Detector. By accessing or using our service, you agree to be bound by these Terms.
                    </p>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
                        <p>By creating an account or using our services, you acknowledge that you have read, understood, and agree to be bound by these terms.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">2. User Accounts</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                            <li>You must provide accurate and complete information when creating an account.</li>
                            <li>We reserve the right to terminate accounts that violate our policies.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">3. Document Privacy</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Your documents are processed securely and are not shared with third parties without consent.</li>
                            <li>We use industry-standard encryption to protect your data during transmission and storage.</li>
                            <li>You retain full ownership of the content you upload.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">4. Usage Limits</h2>
                        <p>We may impose limits on the number of documents you can process or the size of files to ensure fair usage for all users.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">5. Prohibited Conduct</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>You may not use the service for any illegal or unauthorized purpose.</li>
                            <li>You may not attempt to reverse engineer or interfere with the service's operation.</li>
                            <li>Harassment or abuse of other users or staff is strictly prohibited.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">6. Intellectual Property</h2>
                        <p>The service and its original content, features, and functionality are owned by Plagiarism Detector and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.</p>
                    </section>
                </div>
            </motion.div>
        </div>
    )

    if (isMinimal) {
        return (
            <div className="min-h-screen bg-background p-8">
                <Content />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <LandingHeader />
            <div className="flex-grow pt-20">
                <div className="container mx-auto px-4 md:px-6">
                    <Content />
                </div>
            </div>
            <LandingFooter />
        </div>
    )
}
