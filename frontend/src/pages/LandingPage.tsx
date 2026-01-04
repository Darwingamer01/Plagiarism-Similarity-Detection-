import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/button'
import { Zap, Lock, Search } from 'lucide-react'
import { LandingHeader } from '../components/layout/LandingHeader'
import { LandingFooter } from '../components/layout/LandingFooter'

export default function LandingPage() {
    const navigate = useNavigate()

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" },
        },
    }

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
    }

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden selection:bg-primary/20">
            {/* Navbar */}
            <LandingHeader />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                    <motion.div
                        className="w-full max-w-[1920px] mx-auto px-4 md:px-12 text-center relative z-10"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div
                            variants={itemVariants}
                            className="mb-8 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm"
                        >
                            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                            Now with advanced AI detection
                        </motion.div>

                        <motion.h1
                            variants={itemVariants}
                            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent"
                        >
                            Originality, <br className="hidden md:block" /> Guaranteed.
                        </motion.h1>

                        <motion.p
                            variants={itemVariants}
                            className="text-xl md:text-2xl text-muted-foreground/80 max-w-2xl mx-auto mb-12 leading-relaxed"
                        >
                            Ensure the authenticity of your content with our state-of-the-art plagiarism detection system. <span className="text-foreground font-medium">Fast, accurate, and secure.</span>
                        </motion.p>

                        <motion.div
                            variants={itemVariants}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            <Button
                                size="lg"
                                className="h-14 px-8 text-lg rounded-full shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 hover:shadow-2xl hover:shadow-primary/30"
                                onClick={() => navigate('/register')}
                            >
                                Start Checking for Free
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="h-14 px-8 text-lg rounded-full border-2 hover:bg-muted/50 transition-all hover:scale-105 active:scale-95"
                                onClick={() => navigate('/documentation')}
                            >
                                Read Documentation
                            </Button>
                        </motion.div>

                        {/* Dashboard Preview Image */}
                        <motion.div
                            variants={fadeInUp}
                            className="mt-20 mx-auto w-full max-w-[95%] xl:max-w-7xl rounded-xl border border-border/50 bg-card/50 backdrop-blur shadow-2xl overflow-hidden relative group"
                        >
                            <img
                                src="/dashboard-mockup.png"
                                alt="Dashboard Interface"
                                className="w-full h-auto object-cover"
                            />
                            {/* Overlay for depth */}
                            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
                        </motion.div>

                    </motion.div>

                    {/* Background Elements */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[120px] -z-10 animate-pulse-slow" />
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] -z-10" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] -z-10" />
                </section>

                {/* Features Section */}
                <section className="py-32 bg-muted/30 relative">
                    <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
                    <div className="w-full max-w-[1920px] mx-auto px-6 md:px-12 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-20"
                        >
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">Why Choose Us?</h2>
                            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Build with precision and care, our tools are designed to give you the confidence you need.</p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <FeatureCard
                                icon={<Zap className="h-6 w-6" />}
                                title="Lightning Fast"
                                description="Get results in seconds. Our optimized algorithms scan millions of documents instantly to provide real-time feedback."
                                delay={0.1}
                            />
                            <FeatureCard
                                icon={<Search className="h-6 w-6" />}
                                title="Deep Search"
                                description="We go beyond simple text matching. Our AI understands context and semantics to detect even paraphrased content."
                                delay={0.2}
                            />
                            <FeatureCard
                                icon={<Lock className="h-6 w-6" />}
                                title="Secure & Private"
                                description="Your data is yours. We use enterprise-grade encryption to ensure your documents remain confidential and secure."
                                delay={0.3}
                            />
                        </div>
                    </div>
                </section>

                {/* How it Works */}
                <section className="py-32">
                    <div className="w-full max-w-[1920px] mx-auto px-6 md:px-12">
                        <div className="text-center mb-20">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">How It Works</h2>
                            <p className="text-muted-foreground text-lg">Three simple steps to verify your content</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-[1920px] mx-auto">
                            <StepCard number="1" title="Upload Document" description="Supported formats: PDF, DOCX, TXT. Simply drag and drop your file." />
                            <StepCard number="2" title="Run Analysis" description="Our system compares your text against a vast database of sources." />
                            <StepCard number="3" title="Get Report" description="Receive a detailed similarity report with highlighted matches and sources." />
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
                    <div className="w-full px-6 md:px-12 text-center relative z-10">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to ensure originality?</h2>
                        <p className="text-xl md:text-2xl opacity-90 mb-10 max-w-2xl mx-auto">Join thousands of students and professionals who trust our plagiarism detection.</p>
                        <Button
                            size="lg"
                            variant="secondary"
                            className="h-14 px-10 text-lg rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all"
                            onClick={() => navigate('/register')}
                        >
                            Get Started Now
                        </Button>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <LandingFooter />
        </div>
    )
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="group p-8 rounded-3xl bg-background border border-border/50 hover:border-primary/20 transition-all shadow-sm hover:shadow-xl hover:shadow-primary/5"
        >
            <div className="h-14 w-14 rounded-2xl bg-primary/5 group-hover:bg-primary/10 flex items-center justify-center mb-6 text-primary transition-colors duration-300">
                {icon}
            </div>
            <h3 className="text-2xl font-bold mb-4">{title}</h3>
            <p className="text-muted-foreground leading-relaxed">
                {description}
            </p>
        </motion.div>
    )
}

function StepCard({ number, title, description }: { number: string, title: string, description: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center p-6"
        >
            <div className="h-20 w-20 rounded-[2rem] bg-muted flex items-center justify-center mb-8 text-2xl font-bold text-foreground border-4 border-background shadow-lg relative z-10">
                {number}
                <div className="absolute -inset-1 rounded-[2.2rem] bg-gradient-to-br from-primary/20 to-transparent -z-10 blur-sm" />
            </div>
            <h3 className="text-2xl font-bold mb-3">{title}</h3>
            <p className="text-muted-foreground leading-relaxed max-w-xs">{description}</p>
        </motion.div>
    )
}


