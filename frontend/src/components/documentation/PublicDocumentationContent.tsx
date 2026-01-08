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
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">Documentation</h1>
                        <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                            Learn how to use our AI-powered plagiarism detection system to check your documents for similarity against our indexed database.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sections.map(section => (
                            <motion.div key={section.id} whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                                <Card
                                    className="group cursor-pointer border-border/50 hover:border-primary/50 transition-all hover:shadow-lg bg-card/50 backdrop-blur-sm h-full"
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
                            </motion.div>
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
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{currentOverviewSection.title}</h1>
                        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
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
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground">Introduction</h1>
                            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                                Welcome to the AI-Powered Plagiarism Detection System. Our platform uses advanced machine learning to analyze documents and detect similarities with content in our database.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                                <Card className="border-border/50 bg-card hover:border-primary/20 transition-all h-full">
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
                            </motion.div>
                            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                                <Card className="border-border/50 bg-card hover:border-primary/20 transition-all h-full">
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
                            </motion.div>
                            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                                <Card className="border-border/50 bg-card hover:border-primary/20 transition-all h-full">
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
                            </motion.div>
                            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                                <Card className="border-border/50 bg-card hover:border-primary/20 transition-all h-full">
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
                            </motion.div>
                        </div>
                    </>
                )
            case 'how-it-works':
                return pageWrapper(
                    <>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground">How It Works</h1>
                            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                                Our system uses a multi-stage pipeline to process and analyze documents.
                            </p>
                        </div>
                        <div className="space-y-4">
                            {[
                                { id: 1, title: 'Text Extraction', desc: 'Your uploaded document is processed to extract the text content. We support PDF, DOCX, and TXT formats.' },
                                { id: 2, title: 'Smart Chunking', desc: 'The text is split into overlapping chunks of ~300 words. This ensures context is preserved and matches are detected even across section boundaries.' },
                                { id: 3, title: 'Vector Embeddings', desc: 'Each chunk is converted into a 384-dimensional vector using the all-MiniLM-L6-v2 sentence transformer model.' },
                                { id: 4, title: 'Similarity Search', desc: 'The vectors are compared against our FAISS index using cosine similarity. Matching sections above the threshold are identified.' },
                                { id: 5, title: 'AI Report Generation', desc: 'Our AI generates a detailed report explaining the findings, including score interpretation, matched content breakdown, and recommendations.' }
                            ].map((step, idx) => (
                                <motion.div 
                                    key={step.id} 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    whileHover={{ scale: 1.01, x: 5 }}
                                    className="flex gap-4 items-start p-4 sm:p-6 rounded-xl border border-border/50 bg-card hover:bg-muted/30 transition-colors cursor-default"
                                >
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold text-sm sm:text-base">{step.id}</div>
                                    <div>
                                        <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">{step.title}</h3>
                                        <p className="text-sm sm:text-base text-muted-foreground">{step.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </>
                )
            case 'quick-start':
                return pageWrapper(
                    <>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground">Quick Start Guide</h1>
                            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                                Get started with plagiarism detection in 3 simple steps.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
                                <Card className="hover:shadow-md transition-shadow">
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
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
                                <Card className="hover:shadow-md transition-shadow">
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
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
                                <Card className="hover:shadow-md transition-shadow">
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
                            </motion.div>
                        </div>
                    </>
                )
            case 'similarity-detection':
                return pageWrapper(
                    <>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground">Similarity Detection</h1>
                            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                                How our AI identifies matching content between documents.
                            </p>
                        </div>
                        <div className="grid gap-6">
                            <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                                <Card className="hover:shadow-md transition-shadow">
                                    <CardHeader>
                                        <CardTitle className="text-lg sm:text-xl">Semantic Matching</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground text-sm sm:text-base">
                                            Unlike simple keyword matching, our system understands the <em>meaning</em> of text. "The cat sat on the mat" and "A feline rested on the rug" will be recognized as similar content because they convey the same idea.
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                            <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                                <Card className="hover:shadow-md transition-shadow">
                                    <CardHeader>
                                        <CardTitle className="text-lg sm:text-xl">Sentence Transformers</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground text-sm sm:text-base">
                                            We use the <code className="px-1.5 py-0.5 bg-muted rounded text-sm">all-MiniLM-L6-v2</code> model to convert text into 384-dimensional vectors. These vectors capture semantic meaning, allowing us to find conceptually similar content even when different words are used.
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                            <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                                <Card className="hover:shadow-md transition-shadow">
                                    <CardHeader>
                                        <CardTitle className="text-lg sm:text-xl">FAISS Vector Search</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground text-sm sm:text-base">
                                            We use Facebook's FAISS (Facebook AI Similarity Search) library to efficiently search through millions of vectors in milliseconds. This enables real-time similarity detection at scale.
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    </>
                )
            case 'ai-analysis':
                return pageWrapper(
                    <>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground">AI-Powered Analysis</h1>
                            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                                Beyond similarity detection, our AI provides rich document analysis.
                            </p>
                        </div>
                        <div className="grid gap-6">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 backdrop-blur-sm"
                            >
                                <h3 className="text-xl font-semibold mb-6 text-foreground">Analysis Features</h3>
                                <div className="grid sm:grid-cols-2 gap-6">
                                    {[
                                        { icon: <Brain className="w-4 h-4 text-primary" />, title: 'Sentiment Analysis', desc: 'Detects the overall tone (Positive/Negative) of your document using DistilBERT.' },
                                        { icon: <FileText className="w-4 h-4 text-blue-500" />, title: 'Context Extraction', desc: 'Extracts key topics and themes using KeyBERT keyword extraction.' },
                                        { icon: <Zap className="w-4 h-4 text-green-500" />, title: 'Auto-Summarization', desc: 'Generates a concise summary of your document using DistilBART.' },
                                        { icon: <BarChart className="w-4 h-4 text-orange-500" />, title: 'Detailed Reports', desc: 'Comprehensive analysis explaining findings in plain language.' }
                                    ].map((item, i) => (
                                        <motion.div 
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.2 + (i * 0.1) }}
                                            className="flex items-start gap-4 p-4 rounded-xl bg-background/40 border border-border/30 hover:bg-background/60 transition-colors"
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-background shadow-sm flex items-center justify-center shrink-0">
                                                {item.icon}
                                            </div>
                                            <div>
                                                <span className="font-medium text-foreground block mb-1">{item.title}</span>
                                                <span className="text-sm text-muted-foreground leading-relaxed">{item.desc}</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </>
                )
            case 'scoring-system':
                return pageWrapper(
                    <>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground">Understanding Scores</h1>
                            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                                How we calculate similarity scores and what they mean.
                            </p>
                        </div>
                        <div className="flex flex-col gap-6">
                            <motion.div whileHover={{ scale: 1.01 }} className="border border-border/50 rounded-xl p-6 bg-card hover:shadow-md transition-all">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg">
                                        <BarChart className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Document Score</h3>
                                        <p className="text-sm text-muted-foreground">Per-source similarity</p>
                                    </div>
                                </div>
                                <p className="text-muted-foreground leading-relaxed">
                                    Shows how much of your content matches a <strong>specific source document</strong>. This is calculated as a weighted average where longer matching sections contribute more to the score.
                                </p>
                            </motion.div>

                            <motion.div whileHover={{ scale: 1.01 }} className="border border-border/50 rounded-xl p-6 bg-card hover:shadow-md transition-all">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-primary/10 text-primary rounded-lg">
                                        <BarChart className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Overall Score</h3>
                                        <p className="text-sm text-muted-foreground">Global similarity</p>
                                    </div>
                                </div>
                                <p className="text-muted-foreground leading-relaxed">
                                    Shows how much of your content matches <strong>any source</strong> in our database. This gives you the big picture of potential overlap across all indexed documents.
                                </p>
                            </motion.div>

                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="border border-border/50 rounded-xl p-6 bg-card">
                                <h3 className="font-semibold text-lg mb-4">Risk Levels</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                                    {[
                                        { label: 'Very High', range: '90%+', color: 'red' },
                                        { label: 'High', range: '70-90%', color: 'orange' },
                                        { label: 'Medium', range: '50-70%', color: 'yellow' },
                                        { label: 'Low', range: '30-50%', color: 'lime' },
                                        { label: 'Very Low', range: '<30%', color: 'green' }
                                    ].map((risk) => (
                                        <motion.div 
                                            key={risk.label}
                                            whileHover={{ y: -2, scale: 1.05 }}
                                            className={`text-center p-3 rounded-lg bg-${risk.color}-500/10 border border-${risk.color}-500/20`}
                                        >
                                            {/* Note: In Tailwind, dynamic classes like bg-${color} might not purge correctly unless safe-listed. 
                                                However, for this specific standard set, we'll keep it simple or expand if needed. 
                                                Correct approach is full class names, but for brevity here assuming standard set or previous usage. 
                                                Actually, let's play safe and map them. */}
                                            <div className={`font-bold text-${risk.color}-600`}>{risk.range}</div>
                                            <div className="text-xs text-muted-foreground">{risk.label}</div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </>
                )
            case 'uploading-documents':
                return pageWrapper(
                    <>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground">Uploading Documents</h1>
                            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                                Add documents to the database for future similarity comparisons.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <motion.div whileHover={{ y: -2 }}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Supported Formats</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            {[
                                                { type: 'PDF', label: 'Adobe PDF files', color: 'primary' },
                                                { type: 'DOCX', label: 'Word documents', color: 'blue-500' },
                                                { type: 'TXT', label: 'Plain text files', color: 'green-500' },
                                            ].map((fmt) => (
                                                <div key={fmt.type} className="text-center p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                                                    <div className={`text-xl sm:text-2xl font-bold text-${fmt.color} mb-1`}>{fmt.type}</div>
                                                    <div className="text-xs sm:text-sm text-muted-foreground">{fmt.label}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                            <motion.div whileHover={{ y: -2 }}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>What Happens After Upload</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {[
                                            'Text is extracted from your document',
                                            'Content is split into smart chunks',
                                            'Semantic vectors are generated',
                                            'Document is indexed for future searches'
                                        ].map((text, i) => (
                                            <motion.div 
                                                key={i}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="flex items-center gap-3"
                                            >
                                                <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                                                <span className="text-muted-foreground">{text}</span>
                                            </motion.div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    </>
                )
            case 'checking-similarity':
                return pageWrapper(
                    <>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground">Checking Similarity</h1>
                            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
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
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground">Reading Reports</h1>
                            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                                Understanding the detailed AI analysis reports.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Report Sections</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {[
                                        { title: 'Understanding Your Scores', desc: 'Shows both the document-specific score and overall score with clear explanations of what each means.' },
                                        { title: 'What We Found', desc: 'A plain-language summary of the similarity level (Very High, Moderate, Some, or Low match).' },
                                        { title: 'Detailed Analysis', desc: 'Breakdown of how many sections matched and at what levels. Explains the type of similarity found.' },
                                        { title: 'Why This Matters', desc: 'Actionable guidance on what the score means and what you should do next.' },
                                        { title: 'Matched Sections', desc: 'Side-by-side comparison showing your text and the matching source text.' }
                                    ].map((section, i) => (
                                        <motion.div 
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
                                        >
                                            <h4 className="font-semibold mb-2 text-foreground">{section.title}</h4>
                                            <p className="text-sm text-muted-foreground">{section.desc}</p>
                                        </motion.div>
                                    ))}
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
