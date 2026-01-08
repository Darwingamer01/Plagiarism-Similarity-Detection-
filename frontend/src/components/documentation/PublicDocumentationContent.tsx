import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Menu, X, Zap, FileText, Brain, BarChart, Upload, Search, CheckCircle, AlertTriangle } from 'lucide-react'
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
                            Learn how to use our AI-powered plagiarism detection system to check your documents for similarity against our indexed database.
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
                                        <ChevronRight className="w-5 h-5 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
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
                                Welcome to the AI-Powered Plagiarism Detection System. Our platform uses advanced machine learning to analyze documents and detect similarities with content in our database.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="border-border/50 bg-card hover:border-primary/20 transition-all">
                                <CardHeader>
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                                        <Brain className="w-5 h-5 text-primary" />
                                    </div>
                                    <CardTitle>Semantic Understanding</CardTitle>
                                    <CardDescription>
                                        Our AI doesn't just match keywords — it understands the meaning of your text using advanced sentence transformers.
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                            <Card className="border-border/50 bg-card hover:border-primary/20 transition-all">
                                <CardHeader>
                                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-2">
                                        <Zap className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <CardTitle>Fast Processing</CardTitle>
                                    <CardDescription>
                                        Get similarity reports in seconds using our optimized FAISS vector search engine.
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                            <Card className="border-border/50 bg-card hover:border-primary/20 transition-all">
                                <CardHeader>
                                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center mb-2">
                                        <FileText className="w-5 h-5 text-green-500" />
                                    </div>
                                    <CardTitle>Multiple Formats</CardTitle>
                                    <CardDescription>
                                        Upload PDF, DOCX, or TXT files. Our system extracts and analyzes text from all supported formats.
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                            <Card className="border-border/50 bg-card hover:border-primary/20 transition-all">
                                <CardHeader>
                                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-2">
                                        <BarChart className="w-5 h-5 text-purple-500" />
                                    </div>
                                    <CardTitle>Detailed Reports</CardTitle>
                                    <CardDescription>
                                        Get comprehensive AI analysis explaining what was found, why scores were given, and what it means.
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </div>
                    </>
                )
            case 'how-it-works':
                return pageWrapper(
                    <>
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">How It Works</h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                Our system uses a multi-stage pipeline to process and analyze documents.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <div className="flex gap-4 items-start p-6 rounded-xl border border-border/50 bg-card">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold">1</div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Text Extraction</h3>
                                    <p className="text-muted-foreground">Your uploaded document is processed to extract the text content. We support PDF, DOCX, and TXT formats.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start p-6 rounded-xl border border-border/50 bg-card">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold">2</div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Smart Chunking</h3>
                                    <p className="text-muted-foreground">The text is split into overlapping chunks of ~300 words. This ensures context is preserved and matches are detected even across section boundaries.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start p-6 rounded-xl border border-border/50 bg-card">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold">3</div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Vector Embeddings</h3>
                                    <p className="text-muted-foreground">Each chunk is converted into a 384-dimensional vector using the <code className="px-1.5 py-0.5 bg-muted rounded text-sm">all-MiniLM-L6-v2</code> sentence transformer model.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start p-6 rounded-xl border border-border/50 bg-card">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold">4</div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Similarity Search</h3>
                                    <p className="text-muted-foreground">The vectors are compared against our FAISS index using cosine similarity. Matching sections above the threshold are identified.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start p-6 rounded-xl border border-border/50 bg-card">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold">5</div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">AI Report Generation</h3>
                                    <p className="text-muted-foreground">Our AI generates a detailed report explaining the findings, including score interpretation, matched content breakdown, and recommendations.</p>
                                </div>
                            </div>
                        </div>
                    </>
                )
            case 'quick-start':
                return pageWrapper(
                    <>
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">Quick Start Guide</h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                Get started with plagiarism detection in 3 simple steps.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                                            <Upload className="w-4 h-4 text-green-500" />
                                        </div>
                                        <CardTitle>Step 1: Upload Documents to the Database</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        Go to the <strong>Upload</strong> page and drag & drop your documents (PDF, DOCX, or TXT). These documents will be indexed and stored in our database for comparison.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                            <Search className="w-4 h-4 text-blue-500" />
                                        </div>
                                        <CardTitle>Step 2: Check Similarity</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        Go to the <strong>Check Similarity</strong> page and upload the document you want to check. Our AI will compare it against all indexed documents in the database.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                            <BarChart className="w-4 h-4 text-purple-500" />
                                        </div>
                                        <CardTitle>Step 3: Review Results</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        View the detailed results page showing your <strong>Overall Score</strong>, matched documents, AI analysis, and specific text sections that were flagged.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </>
                )
            case 'similarity-detection':
                return pageWrapper(
                    <>
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">Similarity Detection</h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                How our AI identifies matching content between documents.
                            </p>
                        </div>
                        <div className="grid gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Semantic Matching</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        Unlike simple keyword matching, our system understands the <em>meaning</em> of text. "The cat sat on the mat" and "A feline rested on the rug" will be recognized as similar content because they convey the same idea.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Sentence Transformers</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        We use the <code className="px-1.5 py-0.5 bg-muted rounded text-sm">all-MiniLM-L6-v2</code> model to convert text into 384-dimensional vectors. These vectors capture semantic meaning, allowing us to find conceptually similar content even when different words are used.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>FAISS Vector Search</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        We use Facebook's FAISS (Facebook AI Similarity Search) library to efficiently search through millions of vectors in milliseconds. This enables real-time similarity detection at scale.
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
                            <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">AI-Powered Analysis</h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                Beyond similarity detection, our AI provides rich document analysis.
                            </p>
                        </div>
                        <div className="grid gap-6">
                            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20">
                                <h3 className="text-xl font-semibold mb-4 text-foreground">Analysis Features</h3>
                                <ul className="grid sm:grid-cols-2 gap-4">
                                    <li className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                            <Brain className="w-4 h-4 text-primary" />
                                        </div>
                                        <div>
                                            <span className="font-medium text-foreground block">Sentiment Analysis</span>
                                            <span className="text-sm text-muted-foreground">Detects the overall tone (Positive/Negative) of your document using DistilBERT.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                                            <FileText className="w-4 h-4 text-blue-500" />
                                        </div>
                                        <div>
                                            <span className="font-medium text-foreground block">Context Extraction</span>
                                            <span className="text-sm text-muted-foreground">Extracts key topics and themes using KeyBERT keyword extraction.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                                            <Zap className="w-4 h-4 text-green-500" />
                                        </div>
                                        <div>
                                            <span className="font-medium text-foreground block">Auto-Summarization</span>
                                            <span className="text-sm text-muted-foreground">Generates a concise summary of your document using DistilBART.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                                            <BarChart className="w-4 h-4 text-orange-500" />
                                        </div>
                                        <div>
                                            <span className="font-medium text-foreground block">Detailed Reports</span>
                                            <span className="text-sm text-muted-foreground">Comprehensive analysis explaining findings in plain language.</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </>
                )
            case 'scoring-system':
                return pageWrapper(
                    <>
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">Understanding Scores</h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                How we calculate similarity scores and what they mean.
                            </p>
                        </div>
                        <div className="flex flex-col gap-6">
                            <div className="border border-border/50 rounded-xl p-6 bg-card">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg">
                                        <BarChart className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Document Score</h3>
                                        <p className="text-sm text-muted-foreground">Per-source similarity</p>
                                    </div>
                                </div>
                                <p className="text-muted-foreground">
                                    Shows how much of your content matches a <strong>specific source document</strong>. This is calculated as a weighted average where longer matching sections contribute more to the score.
                                </p>
                            </div>

                            <div className="border border-border/50 rounded-xl p-6 bg-card">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-primary/10 text-primary rounded-lg">
                                        <BarChart className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Overall Score</h3>
                                        <p className="text-sm text-muted-foreground">Global similarity</p>
                                    </div>
                                </div>
                                <p className="text-muted-foreground">
                                    Shows how much of your content matches <strong>any source</strong> in our database. This gives you the big picture of potential overlap across all indexed documents.
                                </p>
                            </div>

                            <div className="border border-border/50 rounded-xl p-6 bg-card">
                                <h3 className="font-semibold text-lg mb-4">Risk Levels</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                                    <div className="text-center p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                                        <div className="font-bold text-red-600">90%+</div>
                                        <div className="text-xs text-muted-foreground">Very High</div>
                                    </div>
                                    <div className="text-center p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                                        <div className="font-bold text-orange-600">70-90%</div>
                                        <div className="text-xs text-muted-foreground">High</div>
                                    </div>
                                    <div className="text-center p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                                        <div className="font-bold text-yellow-600">50-70%</div>
                                        <div className="text-xs text-muted-foreground">Medium</div>
                                    </div>
                                    <div className="text-center p-3 rounded-lg bg-lime-500/10 border border-lime-500/20">
                                        <div className="font-bold text-lime-600">30-50%</div>
                                        <div className="text-xs text-muted-foreground">Low</div>
                                    </div>
                                    <div className="text-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                                        <div className="font-bold text-green-600">&lt;30%</div>
                                        <div className="text-xs text-muted-foreground">Very Low</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )
            case 'uploading-documents':
                return pageWrapper(
                    <>
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">Uploading Documents</h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                Add documents to the database for future similarity comparisons.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Supported Formats</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="text-center p-4 rounded-lg border border-border/50">
                                            <div className="text-2xl font-bold text-primary mb-1">PDF</div>
                                            <div className="text-sm text-muted-foreground">Adobe PDF files</div>
                                        </div>
                                        <div className="text-center p-4 rounded-lg border border-border/50">
                                            <div className="text-2xl font-bold text-blue-500 mb-1">DOCX</div>
                                            <div className="text-sm text-muted-foreground">Word documents</div>
                                        </div>
                                        <div className="text-center p-4 rounded-lg border border-border/50">
                                            <div className="text-2xl font-bold text-green-500 mb-1">TXT</div>
                                            <div className="text-sm text-muted-foreground">Plain text files</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>What Happens After Upload</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                        <span className="text-muted-foreground">Text is extracted from your document</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                        <span className="text-muted-foreground">Content is split into smart chunks</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                        <span className="text-muted-foreground">Semantic vectors are generated</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                        <span className="text-muted-foreground">Document is indexed for future searches</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </>
                )
            case 'checking-similarity':
                return pageWrapper(
                    <>
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">Checking Similarity</h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                Run a plagiarism check against all indexed documents.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <div className="p-6 border border-yellow-500/20 bg-yellow-500/5 rounded-xl">
                                <div className="flex items-center gap-3 mb-2 text-yellow-600 dark:text-yellow-400 font-semibold">
                                    <AlertTriangle className="w-5 h-5" />
                                    Important Note
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    The similarity check compares your document against documents that have already been uploaded to the database. Make sure source documents are indexed first.
                                </p>
                            </div>
                            <Card>
                                <CardHeader>
                                    <CardTitle>How to Run a Check</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-muted-foreground">
                                        1. Navigate to the <strong>Check Similarity</strong> page from the dashboard.
                                    </p>
                                    <p className="text-muted-foreground">
                                        2. Upload the document you want to check (PDF, DOCX, or TXT).
                                    </p>
                                    <p className="text-muted-foreground">
                                        3. Wait for the AI to process and compare your document.
                                    </p>
                                    <p className="text-muted-foreground">
                                        4. View the detailed results with scores and matched content.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </>
                )
            case 'reading-reports':
                return pageWrapper(
                    <>
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">Reading Reports</h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                Understanding the detailed AI analysis reports.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Report Sections</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="p-4 rounded-lg border border-border/50">
                                        <h4 className="font-semibold mb-2">Understanding Your Scores</h4>
                                        <p className="text-sm text-muted-foreground">Shows both the document-specific score and overall score with clear explanations of what each means.</p>
                                    </div>
                                    <div className="p-4 rounded-lg border border-border/50">
                                        <h4 className="font-semibold mb-2">What We Found</h4>
                                        <p className="text-sm text-muted-foreground">A plain-language summary of the similarity level (Very High, Moderate, Some, or Low match).</p>
                                    </div>
                                    <div className="p-4 rounded-lg border border-border/50">
                                        <h4 className="font-semibold mb-2">Detailed Analysis</h4>
                                        <p className="text-sm text-muted-foreground">Breakdown of how many sections matched and at what levels. Explains the type of similarity found.</p>
                                    </div>
                                    <div className="p-4 rounded-lg border border-border/50">
                                        <h4 className="font-semibold mb-2">Why This Matters</h4>
                                        <p className="text-sm text-muted-foreground">Actionable guidance on what the score means and what you should do next.</p>
                                    </div>
                                    <div className="p-4 rounded-lg border border-border/50">
                                        <h4 className="font-semibold mb-2">Matched Sections</h4>
                                        <p className="text-sm text-muted-foreground">Side-by-side comparison showing your text and the matching source text.</p>
                                    </div>
                                </CardContent>
                            </Card>
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
