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
                            Now with Local Vector Database Support
                        </motion.div>

                        <motion.h1
                            variants={itemVariants}
                            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent"
                        >
                            Intelligent <br className="hidden md:block" /> Document Comparison.
                        </motion.h1>

                        <motion.p
                            variants={itemVariants}
                            className="text-xl md:text-2xl text-muted-foreground/80 max-w-2xl mx-auto mb-12 leading-relaxed"
                        >
                            Securely analyze document similarity within your organization using advanced AI embeddings. <span className="text-foreground font-medium">Private. Semantic. Accurate.</span>
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
                                Start Comparing
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="h-14 px-8 text-lg rounded-full border-2 hover:bg-muted/50 transition-all hover:scale-105 active:scale-95"
                                onClick={() => navigate('/documentation')}
                            >
                                View Documentation
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
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">Why Choose Our Platform?</h2>
                            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Built for privacy-first organizations that need reliable document comparison without data exposure.</p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <FeatureCard
                                icon={<Zap className="h-6 w-6" />}
                                title="High-Speed Indexing"
                                description="Instantly index and compare documents using FAISS vector search. Handle 100+ document chunks with millisecond latency."
                                delay={0.1}
                            />
                            <FeatureCard
                                icon={<Search className="h-6 w-6" />}
                                title="Semantic Understanding"
                                description="Detects similarity even when words are changed. Our Transformer models understand context, not just keyword matching."
                                delay={0.2}
                            />
                            <FeatureCard
                                icon={<Lock className="h-6 w-6" />}
                                title="Private & Secure"
                                description="Your data never leaves your infrastructure. Compare documents against your own private repository, not the open internet."
                                delay={0.3}
                            />
                        </div>
                    </div>
                </section>

                {/* Technical Architecture Section */}
                <section className="py-32 relative overflow-hidden">
                    <div className="w-full max-w-[1920px] mx-auto px-6 md:px-12 relative z-10">
                        <div className="text-center mb-24">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="inline-block"
                            >
                                <h2 className="text-3xl md:text-5xl font-bold mb-6">Built on Advanced Vector Search</h2>
                                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                                    We don't just match keywords. We map the <span className="text-primary font-semibold">semantic meaning</span> of your text into high-dimensional vector space.
                                </p>
                            </motion.div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-3xl blur-3xl -z-10" />
                                <div className="bg-card/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl hover:shadow-primary/10 transition-all duration-500">
                                    <h3 className="text-2xl font-bold mb-6">The Smart Pipeline</h3>
                                    <div className="space-y-4">
                                        <motion.div 
                                            whileHover={{ x: 8, scale: 1.02 }}
                                            className="group flex items-center gap-4 p-3 rounded-xl hover:bg-blue-500/10 transition-all duration-300 cursor-pointer"
                                        >
                                            <div className="h-12 w-12 rounded-full bg-blue-500/20 group-hover:bg-blue-500/30 flex items-center justify-center text-blue-400 font-bold transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-500/20">1</div>
                                            <div>
                                                <h4 className="font-semibold group-hover:text-blue-400 transition-colors">Text Extraction</h4>
                                                <p className="text-sm text-muted-foreground">Clean and normalize content from any file type.</p>
                                            </div>
                                        </motion.div>
                                        <div className="h-6 w-0.5 bg-border/50 ml-6"></div>
                                        <motion.div 
                                            whileHover={{ x: 8, scale: 1.02 }}
                                            className="group flex items-center gap-4 p-3 rounded-xl hover:bg-purple-500/10 transition-all duration-300 cursor-pointer"
                                        >
                                            <div className="h-12 w-12 rounded-full bg-purple-500/20 group-hover:bg-purple-500/30 flex items-center justify-center text-purple-400 font-bold transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-purple-500/20">2</div>
                                            <div>
                                                <h4 className="font-semibold group-hover:text-purple-400 transition-colors">Vector Embedding</h4>
                                                <p className="text-sm text-muted-foreground">Generate 384-dimensional dense vectors using Transformer models.</p>
                                            </div>
                                        </motion.div>
                                        <div className="h-6 w-0.5 bg-border/50 ml-6"></div>
                                        <motion.div 
                                            whileHover={{ x: 8, scale: 1.02 }}
                                            className="group flex items-center gap-4 p-3 rounded-xl hover:bg-green-500/10 transition-all duration-300 cursor-pointer"
                                        >
                                            <div className="h-12 w-12 rounded-full bg-green-500/20 group-hover:bg-green-500/30 flex items-center justify-center text-green-400 font-bold transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-green-500/20">3</div>
                                            <div>
                                                <h4 className="font-semibold group-hover:text-green-400 transition-colors">FAISS Indexing</h4>
                                                <p className="text-sm text-muted-foreground">Store and query millions of vectors with millisecond latency.</p>
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                            >
                                <h3 className="text-3xl font-bold mb-6">Why Vectors Win</h3>
                                <ul className="space-y-4">
                                    <motion.li 
                                        whileHover={{ x: 8, scale: 1.02 }}
                                        className="group flex gap-4 p-4 rounded-xl hover:bg-primary/5 transition-all duration-300 cursor-pointer"
                                    >
                                        <div className="flex-shrink-0 mt-1">
                                            <div className="h-8 w-8 rounded-full bg-primary/20 group-hover:bg-primary/30 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20">
                                                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-xl group-hover:text-primary transition-colors">Detects Paraphrasing</h4>
                                            <p className="text-muted-foreground">Finds content even if words are swapped or sentences reordered.</p>
                                        </div>
                                    </motion.li>
                                    <motion.li 
                                        whileHover={{ x: 8, scale: 1.02 }}
                                        className="group flex gap-4 p-4 rounded-xl hover:bg-primary/5 transition-all duration-300 cursor-pointer"
                                    >
                                        <div className="flex-shrink-0 mt-1">
                                            <div className="h-8 w-8 rounded-full bg-primary/20 group-hover:bg-primary/30 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20">
                                                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-xl group-hover:text-primary transition-colors">Language Agnostic</h4>
                                            <p className="text-muted-foreground">Conceptual matching works across similar language structures.</p>
                                        </div>
                                    </motion.li>
                                    <motion.li 
                                        whileHover={{ x: 8, scale: 1.02 }}
                                        className="group flex gap-4 p-4 rounded-xl hover:bg-primary/5 transition-all duration-300 cursor-pointer"
                                    >
                                        <div className="flex-shrink-0 mt-1">
                                            <div className="h-8 w-8 rounded-full bg-primary/20 group-hover:bg-primary/30 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20">
                                                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-xl group-hover:text-primary transition-colors">Zero Data Leakage</h4>
                                            <p className="text-muted-foreground">Comparison happens entirely within your private vector space.</p>
                                        </div>
                                    </motion.li>
                                </ul>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Use Cases Section */}
                <section className="py-32 bg-secondary/5">
                    <div className="w-full max-w-[1920px] mx-auto px-6 md:px-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-20"
                        >
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">Designed for Every Organization</h2>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <UseCaseCard
                                title="Universities"
                                description="Verify student theses and research papers locally without uploading intellectual property to third-party public databases."
                            />
                            <UseCaseCard
                                title="Enterprises"
                                description="Ensure internal code documentation, reports, and marketing materials are unique and protected from accidental duplication."
                            />
                            <UseCaseCard
                                title="Publishers"
                                description="Screen submissions automatically to maintain content integrity and originality before the editorial process begins."
                            />
                        </div>
                    </div>
                </section>

                {/* Privacy Deep Dive */}
                <section className="py-32 bg-[#0a0a0a] text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-white/[0.05]" />
                    <div className="w-full max-w-[1920px] mx-auto px-6 md:px-12 relative z-10">
                        <div className="flex flex-col lg:flex-row items-center gap-20">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="lg:w-1/2"
                            >
                                <div className="inline-block px-4 py-1.5 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-sm font-semibold mb-6">
                                    PRIVACY FIRST
                                </div>
                                <h2 className="text-4xl md:text-6xl font-bold mb-6">Your Data.<br />Your Infrastructure.</h2>
                                <p className="text-gray-400 text-lg leading-relaxed mb-8">
                                    Unlike other tools that send your documents to a global cloud, our system is designed to run in your private environment.
                                    <br /><br />
                                    Your documents are converted to vectors and stored in your own isolated database instance. No third party ever sees your data.
                                </p>
                                <Button
                                    variant="outline"
                                    className="border-green-500/50 bg-green-500/10 hover:bg-green-500/20 hover:border-green-400 text-green-400 h-12 px-8 font-semibold transition-all duration-300 hover:scale-105"
                                    onClick={() => navigate('/security')}
                                >
                                    Learn About Our Security
                                </Button>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="lg:w-1/2"
                            >
                                <div className="relative rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
                                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-500/20 rounded-full blur-3xl" />
                                    <div className="space-y-4">
                                        <motion.div 
                                            whileHover={{ x: 5, scale: 1.02 }}
                                            className="group flex items-center justify-between p-4 rounded-lg bg-black/40 border border-white/5 hover:border-green-500/30 hover:bg-green-500/5 transition-all duration-300 cursor-pointer"
                                        >
                                            <span className="text-gray-300 group-hover:text-white transition-colors">Encryption at Rest</span>
                                            <span className="text-green-400 text-sm font-mono group-hover:scale-110 transition-transform">AES-256</span>
                                        </motion.div>
                                        <motion.div 
                                            whileHover={{ x: 5, scale: 1.02 }}
                                            className="group flex items-center justify-between p-4 rounded-lg bg-black/40 border border-white/5 hover:border-green-500/30 hover:bg-green-500/5 transition-all duration-300 cursor-pointer"
                                        >
                                            <span className="text-gray-300 group-hover:text-white transition-colors">Data Isolation</span>
                                            <span className="text-green-400 text-sm font-mono group-hover:scale-110 transition-transform">Private VPC</span>
                                        </motion.div>
                                        <motion.div 
                                            whileHover={{ x: 5, scale: 1.02 }}
                                            className="group flex items-center justify-between p-4 rounded-lg bg-black/40 border border-white/5 hover:border-green-500/30 hover:bg-green-500/5 transition-all duration-300 cursor-pointer"
                                        >
                                            <span className="text-gray-300 group-hover:text-white transition-colors">Access Control</span>
                                            <span className="text-green-400 text-sm font-mono group-hover:scale-110 transition-transform">RBAC Enforced</span>
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Footer and CTA are handled by LandingFooter and existing CTA section above in original file structure if kept, but I will replace the main content block, so I need to be careful not to lose the closing tags or re-add existing sections if I am replacing the whole block. */}
                {/* Wait, the TargetContent was "How It Works" and "CTA", so I should include those or replace them? */}
                {/* The user wants NEW sections. I should probably insert them or replace a large chunk. */}
                {/* Let's look at the implementation plan again. It says "Add new sections". */}
                {/* I will replace the "How It Works" and "CTA" sections with the IMPROVED versions + the NEW sections in between. */}

                {/* Improved How It Works */}
                <section className="py-32">
                    <div className="w-full max-w-[1920px] mx-auto px-6 md:px-12">
                        <div className="text-center mb-20">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">How It Works</h2>
                            <p className="text-muted-foreground text-lg">Three simple steps to analyze your documents</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-[1920px] mx-auto">
                            <StepCard number="1" title="Upload Document" description="Supported formats: PDF, DOCX, TXT. Securely upload directly to your private database." />
                            <StepCard number="2" title="AI Extraction" description="Our system generates vector embeddings to understand the semantic meaning of your text." />
                            <StepCard number="3" title="Similarity Report" description="Receive a detailed breakdown of similarity percentages against your existing document base." />
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 relative overflow-hidden">
                    <div className="w-full max-w-[1920px] mx-auto px-4 md:px-12">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="relative p-12 md:p-20 rounded-3xl bg-gradient-to-br from-primary/15 via-purple-500/10 to-transparent border border-primary/20 text-center overflow-hidden"
                        >
                            <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/10 rounded-full blur-3xl" />
                            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl" />
                            <div className="relative z-10">
                                <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to secure your documents?</h2>
                                <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
                                    Start your secure document comparison journey today. No credit card required.
                                </p>
                                <Button
                                    size="lg"
                                    className="h-14 px-10 text-lg rounded-full shadow-2xl hover:scale-105 transition-all group"
                                    onClick={() => navigate('/register')}
                                >
                                    Get Started Free
                                    <svg className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                                </Button>
                            </div>
                        </motion.div>
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
            whileHover={{ y: -8, scale: 1.02 }}
            className="group relative p-8 rounded-3xl bg-background border border-border/50 hover:border-primary/40 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-primary/10 cursor-pointer overflow-hidden"
        >
            {/* Gradient glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
                <div className="h-14 w-14 rounded-2xl bg-primary/5 group-hover:bg-primary/15 flex items-center justify-center mb-6 text-primary transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20">
                    {icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">{title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                    {description}
                </p>
            </div>
        </motion.div>
    )
}

function StepCard({ number, title, description }: { number: string, title: string, description: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group flex flex-col items-center text-center p-6 cursor-pointer transition-all duration-300"
        >
            <div className="h-20 w-20 rounded-[2rem] bg-muted group-hover:bg-primary/10 flex items-center justify-center mb-8 text-2xl font-bold text-foreground group-hover:text-primary border-4 border-background shadow-lg relative z-10 transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-primary/20">
                {number}
                <div className="absolute -inset-1 rounded-[2.2rem] bg-gradient-to-br from-primary/20 to-purple-500/20 -z-10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">{title}</h3>
            <p className="text-muted-foreground leading-relaxed max-w-xs">{description}</p>
        </motion.div>
    )
}

function UseCaseCard({ title, description }: { title: string, description: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -10, scale: 1.02 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 300 }}
            className="group relative p-8 rounded-3xl bg-background border border-border hover:border-primary/50 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-primary/15 cursor-pointer overflow-hidden"
        >
            {/* Animated gradient border on hover */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">{title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                    {description}
                </p>
            </div>
        </motion.div>
    )
}


