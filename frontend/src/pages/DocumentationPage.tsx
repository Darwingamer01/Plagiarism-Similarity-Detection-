import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LandingHeader } from '../components/layout/LandingHeader'
import { LandingFooter } from '../components/layout/LandingFooter'
import { Search, Book, Code, ChevronRight, Menu, X, Shield, Zap, BarChart, Lock, Globe, ArrowRight } from 'lucide-react'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { ScrollArea } from '../components/ui/scroll-area'
import { useLocation, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'

const sections = [
    {
        id: 'getting-started',
        title: 'Getting Started',
        icon: <Book className="w-4 h-4" />,
        description: "Essential guides to get you up and running quickly.",
        items: [
            { id: 'introduction', label: 'Introduction', desc: "Overview of the platform capabilities." },
            { id: 'installation', label: 'Installation', desc: "Setup instructions for Node.js and Python." },
            { id: 'quick-start', label: 'Quick Start', desc: "Your first API call in 5 minutes." }
        ]
    },
    {
        id: 'core-concepts',
        title: 'Core Concepts',
        icon: <Shield className="w-4 h-4" />,
        description: "Deep dive into how our detection engine works.",
        items: [
            { id: 'plagiarism-detection', label: 'Plagiarism Detection', desc: "Understanding the similarity matching engine." },
            { id: 'ai-analysis', label: 'AI Analysis', desc: "How we detect machine-generated content." },
            { id: 'reports', label: 'Understanding Reports', desc: "Interpreting scoring and metrics." }
        ]
    },
    {
        id: 'api-reference',
        title: 'API Reference',
        icon: <Code className="w-4 h-4" />,
        description: "Detailed documentation for all API endpoints.",
        items: [
            { id: 'authentication', label: 'Authentication', desc: "Secure your requests with Bearer tokens." },
            { id: 'endpoints', label: 'Endpoints', desc: "Complete list of available resources." }
        ]
    }
]

export default function DocumentationPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [activeSection, setActiveSection] = useState<string | null>('root')
    const [activeItem, setActiveItem] = useState('docs-home')

    const location = useLocation()
    const navigate = useNavigate()

    // Sync state with URL hash on mount and hash change
    useEffect(() => {
        const hash = location.hash.replace('#', '')
        if (!hash) {
            setActiveSection('root')
            setActiveItem('docs-home')
            return
        }

        // Check if hash matches a section ID (for Section Overviews)
        const matchedSection = sections.find(s => s.id === hash)
        if (matchedSection) {
            setActiveSection(matchedSection.id)
            setActiveItem(matchedSection.id) // render section overview
            return
        }

        // Check if hash matches a specific item ID
        for (const section of sections) {
            const item = section.items.find(i => i.id === hash)
            if (item) {
                setActiveSection(section.id)
                setActiveItem(item.id)
                return
            }
        }
    }, [location.hash])

    const handleItemClick = (sectionId: string | null, itemId: string) => {
        setActiveSection(sectionId)
        setActiveItem(itemId)
        if (itemId === 'docs-home') {
            navigate('/documentation') // Clear hash for root
        } else {
            navigate(`#${itemId}`)
        }
        setIsSidebarOpen(false)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleBreadcrumbClick = (type: 'root' | 'section') => {
        if (type === 'root') {
            handleItemClick('root', 'docs-home')
        } else if (type === 'section' && activeSection) {
            handleItemClick(activeSection, activeSection) // Go to section overview
        }
    }

    const sidebarVariants = {
        hidden: { x: "-100%", opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } }
    }

    const contentVariants = {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
        exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: "easeIn" } }
    }

    const renderContent = () => {
        // Wrapper for consistent transitions
        const pageWrapper = (content: React.ReactNode) => (
            <motion.div
                key={activeItem}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={contentVariants}
                className="space-y-8 min-h-[60vh]"
            >
                {content}
            </motion.div>
        )

        // 1. Docs Home Page
        if (activeItem === 'docs-home') {
            return pageWrapper(
                <>
                    <div className="mb-12">
                        <h1 className="text-5xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">Documentation</h1>
                        <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                            Everything you need to integrate Plagiarism Detector into your applications.
                            Explore our guides, reference docs, and tutorials.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sections.map(section => (
                            <Card
                                key={section.id}
                                className="group cursor-pointer border-border/50 hover:border-primary/50 transition-all hover:shadow-lg bg-card/50 backdrop-blur-sm"
                                onClick={() => handleItemClick(section.id, section.id)}
                            >
                                <CardHeader>
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors text-primary">
                                            {section.icon}
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                    </div>
                                    <CardTitle className="text-xl mb-2">{section.title}</CardTitle>
                                    <CardDescription className="text-base line-clamp-2">
                                        {section.description}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </>
            )
        }

        // 2. Section Overview Pages (e.g. "Getting Started")
        // Check if activeItem matches a section ID
        const currentOverviewSection = sections.find(s => s.id === activeItem)
        if (currentOverviewSection) {
            return pageWrapper(
                <>
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4 text-primary">
                            {currentOverviewSection.icon}
                            <span className="text-sm font-semibold tracking-wide uppercase">Section Overview</span>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight mb-4">{currentOverviewSection.title}</h1>
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            {currentOverviewSection.description}
                        </p>
                    </div>
                    <div className="grid gap-4">
                        {currentOverviewSection.items.map(item => (
                            <div
                                key={item.id}
                                onClick={() => handleItemClick(currentOverviewSection.id, item.id)}
                                className="group flex items-center p-4 rounded-xl border border-border/40 bg-card hover:bg-muted/50 cursor-pointer transition-all"
                            >
                                <div className="flex-1">
                                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                                        {item.label}
                                        <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                                    </h3>
                                    <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )
        }

        // 3. Specific Pages (Item Content)
        switch (activeItem) {
            // --- Getting Started ---
            case 'introduction':
                return pageWrapper(
                    <>
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">Introduction</h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                Welcome to the Plagiarism Detector. Our platform leverages advanced AI to verify content originality and detect potential copyright infringements.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="border-border/50 bg-card hover:border-primary/20 transition-all">
                                <CardHeader>
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                                        <Zap className="w-5 h-5 text-primary" />
                                    </div>
                                    <CardTitle>Lightning Fast</CardTitle>
                                    <CardDescription>
                                        Get similarity reports in seconds using our optimized vector search engine.
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                            <Card className="border-border/50 bg-card hover:border-primary/20 transition-all">
                                <CardHeader>
                                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-2">
                                        <Globe className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <CardTitle>Global Coverage</CardTitle>
                                    <CardDescription>
                                        Scan against billions of web pages, academic papers, and journals worldwide.
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </div>
                    </>
                )
            case 'installation':
                return pageWrapper(
                    <>
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">Installation</h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                Get started by installing our client SDKs for your preferred platform.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Node.js / TypeScript</h3>
                                <div className="rounded-xl bg-slate-950 p-4 border border-border/50 relative group shadow-sm">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs text-slate-400">Terminal</span>
                                        <div className="flex gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
                                        </div>
                                    </div>
                                    <pre className="text-sm font-mono text-slate-50 font-medium overflow-x-auto">npm install @plagiarism-detector/sdk</pre>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Python</h3>
                                <div className="rounded-xl bg-slate-950 p-4 border border-border/50 relative group shadow-sm">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs text-slate-400">Terminal</span>
                                        <div className="flex gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
                                        </div>
                                    </div>
                                    <pre className="text-sm font-mono text-slate-50 font-medium overflow-x-auto">pip install plagiarism-detector</pre>
                                </div>
                            </div>
                        </div>
                    </>
                )
            case 'quick-start':
                return pageWrapper(
                    <>
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">Quick Start</h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                Perform your first scan in under 5 minutes using our JavaScript SDK.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold">1. Initialize the client</h3>
                            <div className="rounded-xl bg-slate-950 p-6 border border-border/50 overflow-hidden">
                                <pre className="text-sm font-mono text-slate-300 overflow-x-auto">
                                    {`import { PlagiarismClient } from '@plagiarism-detector/sdk'

const client = new PlagiarismClient({
  apiKey: process.env.PLAGIARISM_API_KEY
})`}
                                </pre>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold">2. Submit text for analysis</h3>
                            <div className="rounded-xl bg-slate-950 p-6 border border-border/50 overflow-hidden">
                                <pre className="text-sm font-mono text-slate-300 overflow-x-auto">
                                    {`const report = await client.check({
  text: "The rapid advancement of artificial intelligence...",
  includeAiCheck: true
})

console.log(report.similarityScore) // 0.12`}
                                </pre>
                            </div>
                        </div>
                    </>
                )

            // --- Core Concepts ---
            case 'plagiarism-detection':
                return pageWrapper(
                    <>
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">Plagiarism Detection Engine</h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                Our multi-layered approach to identifying unoriginal content.
                            </p>
                        </div>
                        <div className="grid gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Fingerprinting</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        We use advanced winnowing algorithms to create unique digital signatures for documents. This allows us to detect exact matches even if small parts of the text have been modified.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Semantic Analysis</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        Beyond simple keyword matching, our vector-based models understand the <em>meaning</em> of text. This helps identify paraphrasing where words are changed but the core idea remains stolen.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </>
                )
            case 'ai-analysis':
                return pageWrapper(
                    <>
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">AI Analysis</h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                Detecting machine-generated content in an era of LLMs.
                            </p>
                        </div>
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20">
                            <h3 className="text-xl font-semibold mb-4 text-foreground">How it works</h3>
                            <p className="text-muted-foreground leading-relaxed mb-6">
                                We analyze text for statistical irregularities typical of Large Language Models (LLMs). Key metrics include:
                            </p>
                            <ul className="grid sm:grid-cols-2 gap-4">
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                                        <div className="w-2 h-2 rounded-full bg-purple-500" />
                                    </div>
                                    <div>
                                        <span className="font-medium text-foreground block">Perplexity</span>
                                        <span className="text-sm text-muted-foreground">Measure of text randomness.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                                    </div>
                                    <div>
                                        <span className="font-medium text-foreground block">Burstiness</span>
                                        <span className="text-sm text-muted-foreground">Variation in sentence structure.</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </>
                )
            case 'reports':
                return pageWrapper(
                    <>
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">Understanding Reports</h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                Interpreting the comprehensive data returned by our API.
                            </p>
                        </div>
                        <div className="flex flex-col gap-6">
                            <div className="border border-border/50 rounded-xl p-6 bg-card">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-red-500/10 text-red-500 rounded-lg">
                                        <BarChart className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Similarity Score</h3>
                                        <p className="text-sm text-muted-foreground">0% - 100%</p>
                                    </div>
                                </div>
                                <p className="text-muted-foreground">
                                    The aggregate percentage of content that matches external sources. High scores (e.g., &gt;20%) typically indicate significant copying.
                                </p>
                            </div>

                            <div className="border border-border/50 rounded-xl p-6 bg-card">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-yellow-500/10 text-yellow-500 rounded-lg">
                                        <Zap className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">AI Probability</h3>
                                        <p className="text-sm text-muted-foreground">0% - 100%</p>
                                    </div>
                                </div>
                                <p className="text-muted-foreground">
                                    The likelihood that the text was generated by AI. This is a separate metric from the similarity score.
                                </p>
                            </div>
                        </div>
                    </>
                )

            // --- API Reference ---
            case 'authentication':
                return pageWrapper(
                    <>
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">Authentication</h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                Securing your API requests with Bearer tokens.
                            </p>
                        </div>
                        <div className="p-6 border border-red-500/20 bg-red-500/5 rounded-xl">
                            <div className="flex items-center gap-3 mb-2 text-red-600 dark:text-red-400 font-semibold">
                                <Lock className="w-5 h-5" />
                                Security Best Practice
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Never expose your API keys in client-side code (browsers, mobile apps). Always route requests through your own backend server.
                            </p>
                        </div>
                        <div className="mt-6">
                            <p className="mb-4">Include the header in all requests:</p>
                            <div className="rounded-xl bg-slate-950 p-4 border border-border/50">
                                <pre className="text-sm font-mono text-slate-50">Authorization: Bearer sk_live_...</pre>
                            </div>
                        </div>
                    </>
                )
            case 'endpoints':
                return pageWrapper(
                    <>
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">Endpoints</h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                Complete API resource reference.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="group rounded-xl border border-border/50 bg-card hover:border-border transition-colors overflow-hidden">
                                <div className="border-b border-border/50 p-4 bg-muted/30 flex items-center gap-3">
                                    <span className="px-2.5 py-1 rounded-md bg-green-500/10 text-green-600 text-xs font-bold border border-green-500/20">POST</span>
                                    <code className="text-sm font-mono">/v1/documents/check</code>
                                </div>
                                <div className="p-6">
                                    <p className="text-muted-foreground text-sm">Initiates a new plagiarism check. Supports plain text or file upload.</p>
                                </div>
                            </div>
                            <div className="group rounded-xl border border-border/50 bg-card hover:border-border transition-colors overflow-hidden">
                                <div className="border-b border-border/50 p-4 bg-muted/30 flex items-center gap-3">
                                    <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-600 text-xs font-bold border border-blue-500/20">GET</span>
                                    <code className="text-sm font-mono">/v1/documents/:id</code>
                                </div>
                                <div className="p-6">
                                    <p className="text-muted-foreground text-sm">Retrieves the full analysis report for a specific document ID.</p>
                                </div>
                            </div>
                        </div>
                    </>
                )

            default:
                // Fallback or 404
                return (
                    <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                        <h2 className="text-2xl font-bold mb-2">Page not found</h2>
                        <p className="text-muted-foreground mb-6">The requested documentation page could not be found.</p>
                        <Button onClick={() => handleItemClick('root', 'docs-home')}>Go to Docs Home</Button>
                    </div>
                )
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <LandingHeader />

            <div className="lg:hidden fixed bottom-6 right-6 z-50">
                <Button
                    size="icon"
                    className="h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    {isSidebarOpen ? <X /> : <Menu />}
                </Button>
            </div>

            <div className="flex flex-col">
                <div className="container mx-auto flex gap-6 lg:gap-12 pt-24 px-4 md:px-8">
                    <aside className="hidden lg:block w-72 shrink-0 border-r border-border/40 relative">
                        <div className="sticky top-24 h-[calc(100vh-6rem)] flex flex-col pb-6">
                            <div className="mb-6">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Search docs..." className="pl-9 bg-muted/50 focus-visible:bg-background" />
                                </div>
                            </div>
                            <ScrollArea className="flex-1 pr-3">
                                <div className="space-y-8 pb-4">
                                    {sections.map(section => (
                                        <div key={section.id}>
                                            <button
                                                onClick={() => handleItemClick(section.id, section.id)}
                                                className="flex items-center gap-2 font-semibold mb-3 text-sm text-foreground/90 hover:text-primary transition-colors text-left w-full"
                                            >
                                                {section.icon}
                                                {section.title}
                                            </button>
                                            <div className="space-y-1 ml-1.5 border-l border-border/40 pl-3">
                                                {section.items.map(item => (
                                                    <button
                                                        key={item.id}
                                                        onClick={() => handleItemClick(section.id, item.id)}
                                                        className={`flex items-center w-full text-left px-3 py-1.5 text-sm rounded-md transition-all ${activeItem === item.id
                                                            ? 'bg-primary/10 text-primary font-medium'
                                                            : 'text-muted-foreground hover:text-foreground hover:translate-x-1'
                                                            }`}
                                                    >
                                                        {item.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    </aside>

                    <AnimatePresence>
                        {isSidebarOpen && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
                                />
                                <motion.aside
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    variants={sidebarVariants}
                                    className="fixed inset-y-0 left-0 w-3/4 max-w-sm bg-background border-r z-50 lg:hidden flex flex-col pt-20 shadow-2xl"
                                >
                                    <div className="p-6 pb-2">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input placeholder="Search docs..." className="pl-9 bg-muted/50" />
                                        </div>
                                    </div>
                                    <ScrollArea className="flex-1 px-6 pb-6">
                                        <div className="space-y-8 mt-4">
                                            {sections.map(section => (
                                                <div key={section.id}>
                                                    <button
                                                        onClick={() => handleItemClick(section.id, section.id)}
                                                        className="flex items-center gap-2 font-semibold mb-3 text-sm text-foreground/90 hover:text-primary transition-colors text-left w-full"
                                                    >
                                                        {section.icon}
                                                        {section.title}
                                                    </button>
                                                    <div className="space-y-1 ml-1.5 border-l border-border/40 pl-3">
                                                        {section.items.map(item => (
                                                            <button
                                                                key={item.id}
                                                                onClick={() => handleItemClick(section.id, item.id)}
                                                                className={`flex items-center w-full text-left px-3 py-1.5 text-sm rounded-md transition-all ${activeItem === item.id
                                                                    ? 'bg-primary/10 text-primary font-medium'
                                                                    : 'text-muted-foreground hover:text-foreground hover:translate-x-1'
                                                                    }`}
                                                            >
                                                                {item.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </motion.aside>
                            </>
                        )}
                    </AnimatePresence>

                    <main className="flex-1 min-w-0 pb-12">
                        <div className="max-w-4xl mx-auto w-full">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8 overflow-x-auto whitespace-nowrap pb-2">
                                <button
                                    onClick={() => handleBreadcrumbClick('root')}
                                    className={`hover:text-foreground transition-colors hover:underline underline-offset-4 ${activeItem === 'docs-home' ? 'font-medium text-foreground' : ''}`}
                                >
                                    Docs
                                </button>
                                {activeSection && activeSection !== 'root' && (
                                    <>
                                        <ChevronRight className="h-4 w-4 shrink-0" />
                                        <button
                                            onClick={() => handleBreadcrumbClick('section')}
                                            className={`hover:text-foreground transition-colors hover:underline underline-offset-4 ${activeItem === activeSection ? 'font-medium text-foreground' : ''}`}
                                        >
                                            {sections.find(s => s.id === activeSection)?.title}
                                        </button>
                                    </>
                                )}
                                {activeItem && activeItem !== 'docs-home' && activeItem !== activeSection && (
                                    <>
                                        <ChevronRight className="h-4 w-4 shrink-0" />
                                        <span className="text-foreground font-medium pointer-events-none">
                                            {sections.find(s => s.id === activeSection)?.items.find(i => i.id === activeItem)?.label}
                                        </span>
                                    </>
                                )}
                            </div>

                            <AnimatePresence mode="wait">
                                {renderContent()}
                            </AnimatePresence>
                        </div>
                    </main>
                </div>
                <LandingFooter />
            </div>
        </div>
    )
}
