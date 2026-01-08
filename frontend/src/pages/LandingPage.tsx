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
                <section className="relative pt-24 pb-16 sm:pt-28 sm:pb-20 md:pt-32 lg:pt-48 lg:pb-32 overflow-hidden">
                    <motion.div
                        className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 text-center relative z-10"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div
                            variants={itemVariants}
                            className="mb-6 sm:mb-8 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-medium text-primary backdrop-blur-sm"
                        >
                            <span className="flex h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                            <span className="hidden xs:inline">Now with </span>Local Vector Database Support
                        </motion.div>

                        <motion.h1
                            variants={itemVariants}
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-black tracking-tight mb-6 sm:mb-8 bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent leading-tight"
                        >
                            Intelligent <br className="hidden sm:block" />Document Comparison.
                        </motion.h1>

                        <motion.p
                            variants={itemVariants}
                            className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground/80 max-w-xs sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto mb-8 sm:mb-10 md:mb-12 leading-relaxed px-2"
                        >
                            Securely analyze document similarity within your organization using advanced AI embeddings. <span className="text-foreground font-medium">Private. Semantic. Accurate.</span>
                        </motion.p>

                        <motion.div
                            variants={itemVariants}
                            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
                        >
                            <Button
                                size="lg"
                                className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg rounded-full shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 hover:shadow-2xl hover:shadow-primary/30"
                                onClick={() => navigate('/register')}
                            >
                                Start Comparing
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg rounded-full border-2 hover:bg-muted/50 transition-all hover:scale-105 active:scale-95"
                                onClick={() => navigate('/documentation')}
                            >
                                View Documentation
                            </Button>
                        </motion.div>

                        {/* Dashboard Preview Image */}
                        <motion.div
                            variants={fadeInUp}
                            className="mt-12 sm:mt-16 md:mt-20 mx-auto w-full max-w-[98%] sm:max-w-[95%] xl:max-w-7xl rounded-lg sm:rounded-xl border border-border/50 bg-card/50 backdrop-blur shadow-xl sm:shadow-2xl overflow-hidden relative group"
                        >
                            <img
                                src="/dashboard-mockup.png"
                                alt="Dashboard Interface"
                                width={1200}
                                height={675}
                                fetchPriority="high"
                                className="w-full h-auto object-cover"
                            />
                            {/* Overlay for depth */}
                            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
                        </motion.div>

                    </motion.div>

                    {/* Background Elements - smaller on mobile */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[700px] md:w-[800px] lg:w-[1000px] h-[500px] sm:h-[700px] md:h-[800px] lg:h-[1000px] bg-primary/5 rounded-full blur-[80px] sm:blur-[100px] lg:blur-[120px] -z-10 animate-pulse-slow" />
                    <div className="absolute top-0 right-0 w-[250px] sm:w-[350px] md:w-[400px] lg:w-[500px] h-[250px] sm:h-[350px] md:h-[400px] lg:h-[500px] bg-blue-500/5 rounded-full blur-[60px] sm:blur-[80px] lg:blur-[100px] -z-10" />
                    <div className="absolute bottom-0 left-0 w-[250px] sm:w-[350px] md:w-[400px] lg:w-[500px] h-[250px] sm:h-[350px] md:h-[400px] lg:h-[500px] bg-purple-500/5 rounded-full blur-[60px] sm:blur-[80px] lg:blur-[100px] -z-10" />
                </section>

                {/* Features Section */}
                <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-muted/30 relative">
                    <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
                    <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-12 sm:mb-16 md:mb-20"
                        >
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">Why Choose Our Platform?</h2>
                            <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-xs sm:max-w-lg md:max-w-2xl mx-auto px-2">Built for privacy-first organizations that need reliable document comparison without data exposure.</p>
                        </motion.div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                            <FeatureCard
                                icon={<Zap className="h-5 w-5 sm:h-6 sm:w-6" />}
                                title="High-Speed Indexing"
                                description="Instantly index and compare documents using FAISS vector search. Handle 100+ document chunks with millisecond latency."
                                delay={0.1}
                            />
                            <FeatureCard
                                icon={<Search className="h-5 w-5 sm:h-6 sm:w-6" />}
                                title="Semantic Understanding"
                                description="Detects similarity even when words are changed. Our Transformer models understand context, not just keyword matching."
                                delay={0.2}
                            />
                            <FeatureCard
                                icon={<Lock className="h-5 w-5 sm:h-6 sm:w-6" />}
                                title="Private & Secure"
                                description="Your data never leaves your infrastructure. Compare documents against your own private repository, not the open internet."
                                delay={0.3}
                            />
                        </div>
                    </div>
                </section>

                {/* Technical Architecture Section */}
                <section className="py-16 sm:py-20 md:py-24 lg:py-32 relative overflow-hidden">
                    <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
                        <div className="text-center mb-12 sm:mb-16 md:mb-20 lg:mb-24">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="inline-block"
                            >
                                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">Built on Advanced Vector Search</h2>
                                <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-xs sm:max-w-lg md:max-w-2xl mx-auto px-2">
                                    We don't just match keywords. We map the <span className="text-primary font-semibold">semantic meaning</span> of your text into high-dimensional vector space.
                                </p>
                            </motion.div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 lg:gap-20 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-2xl sm:rounded-3xl blur-2xl sm:blur-3xl -z-10" />
                                <div className="bg-card/50 backdrop-blur-xl border border-white/10 p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl hover:shadow-primary/10 transition-all duration-500">
                                    <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">The Smart Pipeline</h3>
                                    <div className="space-y-3 sm:space-y-4">
                                        <motion.div 
                                            whileHover={{ x: 8, scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="group flex items-center gap-3 sm:gap-4 p-2.5 sm:p-3 rounded-lg sm:rounded-xl hover:bg-blue-500/10 active:bg-blue-500/15 transition-all duration-300 cursor-pointer"
                                        >
                                            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-blue-500/20 group-hover:bg-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-sm sm:text-base transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-500/20 flex-shrink-0">1</div>
                                            <div className="min-w-0">
                                                <h4 className="font-semibold text-sm sm:text-base group-hover:text-blue-400 transition-colors">Text Extraction</h4>
                                                <p className="text-xs sm:text-sm text-muted-foreground truncate sm:whitespace-normal">Clean and normalize content from any file type.</p>
                                            </div>
                                        </motion.div>
                                        <div className="h-4 sm:h-6 w-0.5 bg-border/50 ml-5 sm:ml-6"></div>
                                        <motion.div 
                                            whileHover={{ x: 8, scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="group flex items-center gap-3 sm:gap-4 p-2.5 sm:p-3 rounded-lg sm:rounded-xl hover:bg-purple-500/10 active:bg-purple-500/15 transition-all duration-300 cursor-pointer"
                                        >
                                            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-purple-500/20 group-hover:bg-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-sm sm:text-base transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-purple-500/20 flex-shrink-0">2</div>
                                            <div className="min-w-0">
                                                <h4 className="font-semibold text-sm sm:text-base group-hover:text-purple-400 transition-colors">Vector Embedding</h4>
                                                <p className="text-xs sm:text-sm text-muted-foreground">Generate 384-dimensional dense vectors.</p>
                                            </div>
                                        </motion.div>
                                        <div className="h-4 sm:h-6 w-0.5 bg-border/50 ml-5 sm:ml-6"></div>
                                        <motion.div 
                                            whileHover={{ x: 8, scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="group flex items-center gap-3 sm:gap-4 p-2.5 sm:p-3 rounded-lg sm:rounded-xl hover:bg-green-500/10 active:bg-green-500/15 transition-all duration-300 cursor-pointer"
                                        >
                                            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-green-500/20 group-hover:bg-green-500/30 flex items-center justify-center text-green-400 font-bold text-sm sm:text-base transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-green-500/20 flex-shrink-0">3</div>
                                            <div className="min-w-0">
                                                <h4 className="font-semibold text-sm sm:text-base group-hover:text-green-400 transition-colors">FAISS Indexing</h4>
                                                <p className="text-xs sm:text-sm text-muted-foreground">Query millions of vectors with millisecond latency.</p>
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
                <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-secondary/5">
                    <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-12 sm:mb-16 md:mb-20"
                        >
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">Designed for Every Organization</h2>
                        </motion.div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
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
                <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-[#0a0a0a] text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-white/[0.05]" />
                    <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
                        <div className="flex flex-col lg:flex-row items-center gap-10 sm:gap-12 md:gap-16 lg:gap-20">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="lg:w-1/2 text-center lg:text-left"
                            >
                                <div className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-xs sm:text-sm font-semibold mb-4 sm:mb-6">
                                    PRIVACY FIRST
                                </div>
                                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6">Your Data.<br />Your Infrastructure.</h2>
                                <p className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-8 max-w-md mx-auto lg:mx-0">
                                    Unlike other tools that send your documents to a global cloud, our system is designed to run in your private environment.
                                    <br /><br className="hidden sm:block" />
                                    Your documents are converted to vectors and stored in your own isolated database instance. No third party ever sees your data.
                                </p>
                                <Button
                                    variant="outline"
                                    className="w-full sm:w-auto border-green-500/50 bg-green-500/10 hover:bg-green-500/20 hover:border-green-400 text-green-400 h-11 sm:h-12 px-6 sm:px-8 font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
                                    onClick={() => navigate('/security')}
                                >
                                    Learn About Our Security
                                </Button>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="lg:w-1/2 w-full"
                            >
                                <div className="relative rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 md:p-8 backdrop-blur-md">
                                    <div className="absolute -top-6 sm:-top-10 -right-6 sm:-right-10 w-20 sm:w-28 md:w-32 h-20 sm:h-28 md:h-32 bg-green-500/20 rounded-full blur-2xl sm:blur-3xl" />
                                    <div className="space-y-3 sm:space-y-4">
                                        <motion.div 
                                            whileHover={{ x: 5, scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="group flex items-center justify-between p-3 sm:p-4 rounded-lg bg-black/40 border border-white/5 hover:border-green-500/30 hover:bg-green-500/5 active:bg-green-500/10 transition-all duration-300 cursor-pointer"
                                        >
                                            <span className="text-gray-300 group-hover:text-white transition-colors text-sm sm:text-base">Vector Storage</span>
                                            <span className="text-green-400 text-xs sm:text-sm font-mono group-hover:scale-110 transition-transform">FAISS Index</span>
                                        </motion.div>
                                        <motion.div 
                                            whileHover={{ x: 5, scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="group flex items-center justify-between p-3 sm:p-4 rounded-lg bg-black/40 border border-white/5 hover:border-green-500/30 hover:bg-green-500/5 active:bg-green-500/10 transition-all duration-300 cursor-pointer"
                                        >
                                            <span className="text-gray-300 group-hover:text-white transition-colors text-sm sm:text-base">Local Processing</span>
                                            <span className="text-green-400 text-xs sm:text-sm font-mono group-hover:scale-110 transition-transform">On-Premise</span>
                                        </motion.div>
                                        <motion.div 
                                            whileHover={{ x: 5, scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="group flex items-center justify-between p-3 sm:p-4 rounded-lg bg-black/40 border border-white/5 hover:border-green-500/30 hover:bg-green-500/5 active:bg-green-500/10 transition-all duration-300 cursor-pointer"
                                        >
                                            <span className="text-gray-300 group-hover:text-white transition-colors text-sm sm:text-base">User Accounts</span>
                                            <span className="text-green-400 text-xs sm:text-sm font-mono group-hover:scale-110 transition-transform">JWT Auth</span>
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
                <section className="py-16 sm:py-20 md:py-24 lg:py-32">
                    <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
                        <div className="text-center mb-12 sm:mb-16 md:mb-20">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">How It Works</h2>
                            <p className="text-muted-foreground text-sm sm:text-base md:text-lg">Three simple steps to analyze your documents</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-12 max-w-[1920px] mx-auto">
                            <StepCard number="1" title="Upload Document" description="Supported formats: PDF, DOCX, TXT. Securely upload directly to your private database." />
                            <StepCard number="2" title="AI Extraction" description="Our system generates vector embeddings to understand the semantic meaning of your text." />
                            <StepCard number="3" title="Similarity Report" description="Receive a detailed breakdown of similarity percentages against your existing document base." />
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 sm:py-20 md:py-24 relative overflow-hidden">
                    <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="relative p-8 sm:p-10 md:p-16 lg:p-20 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary/15 via-purple-500/10 to-transparent border border-primary/20 text-center overflow-hidden"
                        >
                            <div className="absolute -top-12 sm:-top-16 md:-top-20 -right-12 sm:-right-16 md:-right-20 w-32 sm:w-40 md:w-60 h-32 sm:h-40 md:h-60 bg-primary/10 rounded-full blur-2xl sm:blur-3xl" />
                            <div className="absolute -bottom-12 sm:-bottom-16 md:-bottom-20 -left-12 sm:-left-16 md:-left-20 w-32 sm:w-40 md:w-60 h-32 sm:h-40 md:h-60 bg-purple-500/10 rounded-full blur-2xl sm:blur-3xl" />
                            <div className="relative z-10">
                                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">Ready to secure your documents?</h2>
                                <p className="text-muted-foreground text-sm sm:text-base md:text-lg mb-6 sm:mb-8 md:mb-10 max-w-xs sm:max-w-lg md:max-w-2xl mx-auto px-2">
                                    Start your secure document comparison journey today. No credit card required.
                                </p>
                                <Button
                                    size="lg"
                                    className="w-full sm:w-auto h-12 sm:h-14 px-8 sm:px-10 text-base sm:text-lg rounded-full shadow-xl sm:shadow-2xl hover:scale-105 active:scale-95 transition-all group"
                                    onClick={() => navigate('/register')}
                                >
                                    Get Started Free
                                    <svg className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
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
            whileTap={{ scale: 0.98 }}
            className="group relative p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-background border border-border/50 hover:border-primary/40 transition-all duration-500 shadow-sm hover:shadow-xl sm:hover:shadow-2xl hover:shadow-primary/10 cursor-pointer overflow-hidden"
        >
            {/* Gradient glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
                <div className="h-11 w-11 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-xl sm:rounded-2xl bg-primary/5 group-hover:bg-primary/15 flex items-center justify-center mb-4 sm:mb-5 md:mb-6 text-primary transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20">
                    {icon}
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 md:mb-4 group-hover:text-primary transition-colors duration-300">{title}</h3>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
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
            whileTap={{ scale: 0.98 }}
            className="group flex flex-col items-center text-center p-4 sm:p-5 md:p-6 cursor-pointer transition-all duration-300"
        >
            <div className="h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 rounded-2xl sm:rounded-[1.5rem] md:rounded-[2rem] bg-muted group-hover:bg-primary/10 flex items-center justify-center mb-5 sm:mb-6 md:mb-8 text-lg sm:text-xl md:text-2xl font-bold text-foreground group-hover:text-primary border-2 sm:border-4 border-background shadow-md sm:shadow-lg relative z-10 transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-primary/20">
                {number}
                <div className="absolute -inset-0.5 sm:-inset-1 rounded-2xl sm:rounded-[1.7rem] md:rounded-[2.2rem] bg-gradient-to-br from-primary/20 to-purple-500/20 -z-10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 group-hover:text-primary transition-colors duration-300">{title}</h3>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-[280px] sm:max-w-xs">{description}</p>
        </motion.div>
    )
}

function UseCaseCard({ title, description }: { title: string, description: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -10, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 300 }}
            className="group relative p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-background border border-border hover:border-primary/50 transition-all duration-500 shadow-sm hover:shadow-xl sm:hover:shadow-2xl hover:shadow-primary/15 cursor-pointer overflow-hidden"
        >
            {/* Animated gradient border on hover */}
            <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 md:mb-4 group-hover:text-primary transition-colors duration-300">{title}</h3>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                    {description}
                </p>
            </div>
        </motion.div>
    )
}


