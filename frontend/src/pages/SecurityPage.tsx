import { motion } from 'framer-motion'
import { LandingHeader } from '../components/layout/LandingHeader'
import { LandingFooter } from '../components/layout/LandingFooter'
import PageTransition from '../components/layout/PageTransition'
import { Shield, Lock, Server, Eye, Key, Database, CheckCircle2, ArrowRight } from 'lucide-react'
import { Button } from '../components/ui/button'
import { useNavigate } from 'react-router-dom'

const securityFeatures = [
    {
        icon: <Shield className="h-8 w-8" />,
        title: "End-to-End Encryption",
        description: "All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption.",
        badge: "AES-256"
    },
    {
        icon: <Server className="h-8 w-8" />,
        title: "Private Infrastructure",
        description: "Your documents never leave your environment. All processing happens within your isolated instance.",
        badge: "Self-Hosted"
    },
    {
        icon: <Eye className="h-8 w-8" />,
        title: "Zero Data Sharing",
        description: "We never share, sell, or expose your documents to third parties. Your data remains exclusively yours.",
        badge: "Zero-Trust"
    },
    {
        icon: <Key className="h-8 w-8" />,
        title: "RBAC Access Control",
        description: "Fine-grained role-based access control ensures only authorized users can access specific documents.",
        badge: "Enterprise"
    },
    {
        icon: <Database className="h-8 w-8" />,
        title: "Isolated Vector Database",
        description: "Each organization gets a completely isolated FAISS index. Cross-tenant data leakage is impossible.",
        badge: "Isolated"
    },
    {
        icon: <Lock className="h-8 w-8" />,
        title: "Secure Authentication",
        description: "JWT-based authentication with refresh tokens, rate limiting, and optional OAuth2/OIDC integration.",
        badge: "OAuth2"
    }
]

const complianceItems = [
    "GDPR Compliant Data Handling",
    "SOC 2 Type II Ready Architecture",
    "HIPAA Compatible Deployment",
    "Data Residency Controls",
    "Audit Logging & Monitoring",
    "Automatic Session Management"
]

export default function SecurityPage() {
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

    return (
        <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20 overflow-x-hidden">
            <LandingHeader />
            <div className="flex-grow pt-24 pb-12 sm:pt-28 sm:pb-16 md:pt-32 md:pb-20">
                <PageTransition>
                    {/* Hero Section */}
                    <section className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 mb-16 sm:mb-20 md:mb-24">
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="text-center"
                        >
                            <motion.div
                                variants={itemVariants}
                                className="inline-flex items-center justify-center p-3 sm:p-4 mb-6 sm:mb-8 bg-green-500/10 rounded-xl sm:rounded-2xl text-green-500"
                            >
                                <Shield className="w-8 h-8 sm:w-10 sm:h-10" />
                            </motion.div>
                            
                            <motion.h1
                                variants={itemVariants}
                                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight mb-6 sm:mb-8 bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent leading-tight"
                            >
                                Security First.<br />Always.
                            </motion.h1>
                            
                            <motion.p
                                variants={itemVariants}
                                className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto mb-8 sm:mb-10 md:mb-12 px-2"
                            >
                                Your documents contain sensitive information. We've built our platform from the ground up with security as the foundation, not an afterthought.
                            </motion.p>

                            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
                                <Button
                                    size="lg"
                                    className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg rounded-full shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                                    onClick={() => navigate('/register')}
                                >
                                    Start Secure Trial
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg rounded-full border-2 hover:bg-muted/50 transition-all hover:scale-105 active:scale-95"
                                    onClick={() => navigate('/contact')}
                                >
                                    Contact Security Team
                                </Button>
                            </motion.div>
                        </motion.div>
                    </section>

                    {/* Security Features Grid */}
                    <section className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 mb-20 sm:mb-24 md:mb-32">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-10 sm:mb-12 md:mb-16"
                        >
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">Enterprise-Grade Protection</h2>
                            <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-xs sm:max-w-lg md:max-w-2xl mx-auto px-2">
                                Every layer of our stack is designed to protect your most sensitive documents.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                            {securityFeatures.map((feature, index) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="group relative p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-card border border-border hover:border-green-500/50 transition-all duration-500 shadow-sm hover:shadow-xl sm:hover:shadow-2xl hover:shadow-green-500/10 cursor-pointer overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                                            <div className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-xl sm:rounded-2xl bg-green-500/10 group-hover:bg-green-500/20 flex items-center justify-center text-green-500 transition-all duration-500 group-hover:scale-110">
                                                {feature.icon}
                                            </div>
                                            <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] sm:text-xs font-mono font-semibold">
                                                {feature.badge}
                                            </span>
                                        </div>
                                        <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 group-hover:text-green-500 transition-colors duration-300">
                                            {feature.title}
                                        </h3>
                                        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* Architecture Section */}
                    <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-[#0a0a0a] text-white relative overflow-hidden">
                        <div className="absolute inset-0 bg-grid-white/[0.03]" />
                        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
                            <div className="flex flex-col lg:flex-row items-center gap-10 sm:gap-12 md:gap-16 lg:gap-20">
                                <motion.div
                                    initial={{ opacity: 0, x: -50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="lg:w-1/2 text-center lg:text-left"
                                >
                                    <div className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-xs sm:text-sm font-semibold mb-4 sm:mb-6">
                                        ARCHITECTURE
                                    </div>
                                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
                                        Built for<br />Zero Trust
                                    </h2>
                                    <p className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-8 max-w-md mx-auto lg:mx-0">
                                        Our architecture assumes no implicit trust. Every request is authenticated, every action is logged, and every data access is verified at runtime.
                                    </p>
                                    <ul className="space-y-3 sm:space-y-4 text-left max-w-md mx-auto lg:mx-0">
                                        {["No plaintext storage", "Encrypted vector embeddings", "Secure inter-service communication", "Automatic key rotation"].map((item, i) => (
                                            <motion.li
                                                key={i}
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: i * 0.1 }}
                                                className="flex items-center gap-2 sm:gap-3 text-gray-300 text-sm sm:text-base"
                                            >
                                                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                                                {item}
                                            </motion.li>
                                        ))}
                                    </ul>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="lg:w-1/2 w-full"
                                >
                                    <div className="relative rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 md:p-8 backdrop-blur-md">
                                        <div className="absolute -top-6 sm:-top-10 -right-6 sm:-right-10 w-24 sm:w-32 md:w-40 h-24 sm:h-32 md:h-40 bg-green-500/20 rounded-full blur-2xl sm:blur-3xl" />
                                        <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white">Data Flow</h3>
                                        <div className="space-y-3 sm:space-y-4">
                                            {[
                                                { step: "1", label: "Upload", desc: "TLS 1.3 encrypted transfer" },
                                                { step: "2", label: "Process", desc: "In-memory only, no disk writes" },
                                                { step: "3", label: "Vectorize", desc: "Encrypted embedding generation" },
                                                { step: "4", label: "Store", desc: "AES-256 encrypted at rest" }
                                            ].map((item, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ delay: i * 0.15 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-black/40 border border-white/5 hover:border-green-500/30 active:bg-green-500/5 transition-colors cursor-pointer"
                                                >
                                                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold text-sm sm:text-base flex-shrink-0">
                                                        {item.step}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="font-semibold text-white text-sm sm:text-base">{item.label}</div>
                                                        <div className="text-xs sm:text-sm text-gray-400 truncate sm:whitespace-normal">{item.desc}</div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </section>

                    {/* Compliance Section */}
                    <section className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-16 sm:py-20 md:py-24 lg:py-32">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-10 sm:mb-12 md:mb-16"
                        >
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">Compliance Ready</h2>
                            <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-xs sm:max-w-lg md:max-w-2xl mx-auto px-2">
                                Our platform is designed to help you meet your regulatory requirements.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-4xl mx-auto">
                            {complianceItems.map((item, index) => (
                                <motion.div
                                    key={item}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-muted/50 border border-border hover:border-primary/30 active:bg-muted transition-all cursor-pointer"
                                >
                                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                                    <span className="font-medium text-sm sm:text-base">{item}</span>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pb-8 sm:pb-12">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="relative p-8 sm:p-10 md:p-16 lg:p-20 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-transparent border border-green-500/20 text-center overflow-hidden"
                        >
                            <div className="absolute -top-12 sm:-top-16 md:-top-20 -right-12 sm:-right-16 md:-right-20 w-32 sm:w-40 md:w-60 h-32 sm:h-40 md:h-60 bg-green-500/10 rounded-full blur-2xl sm:blur-3xl" />
                            <div className="absolute -bottom-12 sm:-bottom-16 md:-bottom-20 -left-12 sm:-left-16 md:-left-20 w-32 sm:w-40 md:w-60 h-32 sm:h-40 md:h-60 bg-emerald-500/10 rounded-full blur-2xl sm:blur-3xl" />
                            <div className="relative z-10">
                                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">Ready to protect your documents?</h2>
                                <p className="text-muted-foreground text-sm sm:text-base md:text-lg mb-6 sm:mb-8 md:mb-10 max-w-xs sm:max-w-lg md:max-w-2xl mx-auto px-2">
                                    Start your secure document comparison journey today. No credit card required.
                                </p>
                                <Button
                                    size="lg"
                                    className="w-full sm:w-auto h-12 sm:h-14 px-8 sm:px-10 text-base sm:text-lg rounded-full shadow-xl sm:shadow-2xl hover:scale-105 active:scale-95 transition-all group"
                                    onClick={() => navigate('/register')}
                                >
                                    Get Started Free
                                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        </motion.div>
                    </section>
                </PageTransition>
            </div>
            <LandingFooter />
        </div>
    )
}
