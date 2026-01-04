import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Menu, X, Zap, BarChart, Lock, Globe, ArrowRight } from 'lucide-react'
import { Button } from '../ui/button'
import { ScrollArea } from '../ui/scroll-area'
import { useNavigate, useLocation } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { LandingFooter } from '../layout/LandingFooter'

import { sections } from '../../utils/documentationSections'

interface DocumentationContentProps {
    basePath?: string
    hideSidebarOnMobile?: boolean
}

export function PublicDocumentationContent({ basePath = '/documentation', hideSidebarOnMobile = false }: DocumentationContentProps) {
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

        const matchedSection = sections.find(s => s.id === hash)
        if (matchedSection) {
            setActiveSection(matchedSection.id)
            setActiveItem(matchedSection.id)
            return
        }

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
            navigate(basePath)
        } else {
            navigate(`${basePath}#${itemId}`)
        }
        setIsSidebarOpen(false)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleBreadcrumbClick = (type: 'root' | 'section') => {
        if (type === 'root') {
            handleItemClick('root', 'docs-home')
        } else if (type === 'section' && activeSection) {
            handleItemClick(activeSection, activeSection)
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
        const pageWrapper = (content: React.ReactNode) => (
            <motion.div
                key={activeItem}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={contentVariants}
                className="space-y-8 min-h-[60vh] pb-12"
            >
                {content}
            </motion.div>
        )

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

        switch (activeItem) {
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
                                    <pre className="text-sm font-mono text-slate-50 font-medium overflow-x-auto">npm install @plagiarism-detector/sdk</pre>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Python</h3>
                                <div className="rounded-xl bg-slate-950 p-4 border border-border/50 relative group shadow-sm">
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
                                    <div>
                                        <span className="font-medium text-foreground block">Perplexity</span>
                                        <span className="text-sm text-muted-foreground">Measure of text randomness.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
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
                return (
                    <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                        <h2 className="text-2xl font-bold mb-2">Page not found</h2>
                        <Button onClick={() => handleItemClick('root', 'docs-home')}>Go to Docs Home</Button>
                    </div>
                )
        }
    }

    return (
        <div className="flex flex-col min-h-screen pt-16">
            <div className="flex flex-1 relative items-start">
                {/* Desktop Sticky Sidebar */}
                {!hideSidebarOnMobile && (
                    <aside className="hidden lg:block w-72 shrink-0 border-r border-border/40 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto bg-background z-30">
                        <div className="p-6">
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
                        </div>
                    </aside>
                )}

                {/* Mobile Sidebar Overlay */}
                {!hideSidebarOnMobile && (
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
                )}

                {/* Mobile Menu Button */}
                {!hideSidebarOnMobile && (
                    <div className="lg:hidden fixed bottom-6 right-6 z-50">
                        <Button
                            size="icon"
                            className="h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            {isSidebarOpen ? <X /> : <Menu />}
                        </Button>
                    </div>
                )}

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col min-w-0">
                    <div className="flex-1 w-full max-w-[1920px] mx-auto p-4 md:p-8 lg:p-12">
                        {/* Breadcrumbs */}
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

            {/* Footer outside Main Flex Container */}
            <LandingFooter />
        </div>
    )
}
