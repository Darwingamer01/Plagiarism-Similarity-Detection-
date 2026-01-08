import PageTransition from '../components/layout/PageTransition'
import { Shield } from 'lucide-react'
import { LandingHeader } from '../components/layout/LandingHeader'
import { LandingFooter } from '../components/layout/LandingFooter'

export default function PrivacyPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <LandingHeader />
            <div className="flex-grow pt-20">
                <div className="container mx-auto px-4 md:px-6">
                <PageTransition>
                    <div className="w-full max-w-[1920px] mx-auto px-4 md:px-8 py-12">
                        <div className="text-center mb-12">
                            <div className="flex justify-center mb-6">
                                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Shield className="h-8 w-8" />
                                </div>
                            </div>
                            <h1 className="text-4xl font-bold tracking-tight mb-4">Privacy Policy</h1>
                            <p className="text-muted-foreground">Last updated: {new Date().getFullYear()}</p>
                        </div>

                        <div className="mb-12 space-y-8">
                            <section className="space-y-4">
                                <h2 className="text-2xl font-semibold">1. Introduction</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    Welcome to Plagiarism Detector. We respect your privacy and are committed to protecting your personal data.
                                    This privacy policy will inform you as to how we look after your personal data when you visit our website
                                    and tell you about your privacy rights and how the law protects you.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-semibold">2. Data We Collect</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                                    <li>Identity Data includes first name, last name, username or similar identifier.</li>
                                    <li>Contact Data includes email address and telephone number.</li>
                                    <li>Technical Data includes internet protocol (IP) address, your login data, browser type and version.</li>
                                    <li>Usage Data includes information about how you use our website, products and services.</li>
                                </ul>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-semibold">3. How We Use Your Data</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                                    <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                                    <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                                    <li>Where we need to comply with a legal or regulatory obligation.</li>
                                </ul>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-semibold">4. Data Security</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-semibold">5. Contact Us</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    If you have any questions about this privacy policy or our privacy practices, please contact us at: support@plagiarismdetector.com
                                </p>
                            </section>
                        </div>
                    </div>
                </PageTransition>
                </div>
            </div>
            <LandingFooter />
        </div>
    )
}
