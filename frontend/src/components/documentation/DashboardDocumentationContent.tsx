import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Lock, Mail, Send, HelpCircle, Book, Code, Terminal, FileText } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import { toast } from 'react-hot-toast'
import { api } from '../../services/api'
import { AxiosError } from 'axios'



export function DashboardDocumentationContent() {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleContactSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            // Get form data
            const form = e.target as HTMLFormElement
            const firstName = (form.elements.namedItem('firstName') as HTMLInputElement).value
            const lastName = (form.elements.namedItem('lastName') as HTMLInputElement).value
            const email = (form.elements.namedItem('email') as HTMLInputElement).value
            const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value

            const response = await api.post('/contact', {
                firstName,
                lastName,
                email,
                message
            })

            if (response.data.success) {
                toast.success('Message sent! We will get back to you soon.')
                form.reset()
            }
        } catch (error) {
            console.error('Error sending message:', error)
            const axiosError = error as AxiosError<{ message: string }>
            toast.error(axiosError.response?.data?.message || 'Failed to send message. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const tabContentVariants = {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
        exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: "easeIn" } }
    }

    const MotionTabsContent = motion(TabsContent)

    return (
        <div className="w-full mx-auto pb-12">
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Dashboard Documentation</h1>
                <p className="text-lg text-muted-foreground max-w-3xl">
                    Welcome to your dedicated resource center. Manage your API keys, understand usage limits, and explore integration guides tailored for your plan.
                </p>
            </div>

            <Tabs defaultValue="getting-started" className="w-full space-y-8">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto p-1 gap-2 bg-muted/50">
                    <TabsTrigger value="getting-started" className="h-10">Getting Started</TabsTrigger>
                    <TabsTrigger value="core-concepts" className="h-10">Core Concepts</TabsTrigger>
                    <TabsTrigger value="api-reference" className="h-10">API Reference</TabsTrigger>
                    <TabsTrigger value="faq" className="h-10">FAQ</TabsTrigger>
                    <TabsTrigger value="support" className="h-10">Support</TabsTrigger>
                </TabsList>

                <AnimatePresence mode="wait">
                    <MotionTabsContent key="getting-started" value="getting-started" variants={tabContentVariants} initial="initial" animate="animate" exit="exit" className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight mb-4 flex items-center gap-2">
                                <Book className="h-6 w-6 text-primary" /> Getting Started
                            </h2>
                            <p className="text-muted-foreground mb-6">Essential guides to get you up and running quickly.</p>

                            <div className="grid gap-6 md:grid-cols-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2"><Zap className="h-5 w-5 text-yellow-500" /> Quick Start</CardTitle>
                                        <CardDescription>Perform your first scan in under 5 minutes.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>1. Initialize Client</Label>
                                            <div className="rounded-md bg-slate-950 p-4 font-mono text-sm text-slate-50">
                                                import {'{'} PlagiarismClient {'}'} from '@plagiarism/sdk'
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2"><Terminal className="h-5 w-5 text-blue-500" /> Installation</CardTitle>
                                        <CardDescription>Install our SDKs for Node.js or Python.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <p className="text-sm text-muted-foreground">We currently recommend using our REST API directly. SDKs are coming soon.</p>
                                            <div className="rounded-md bg-slate-950 p-4 font-mono text-sm text-slate-50">
                                                npm install axios
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </MotionTabsContent>

                    <MotionTabsContent key="core-concepts" value="core-concepts" variants={tabContentVariants} initial="initial" animate="animate" exit="exit" className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight mb-4 flex items-center gap-2">
                                <FileText className="h-6 w-6 text-primary" /> Core Concepts
                            </h2>
                            <p className="text-muted-foreground mb-6">Deep dive into how our detection engine works.</p>

                            <div className="grid gap-6 md:grid-cols-3">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Plagiarism Detection</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            Multi-layered approach using fingerprinting and hashing to detect exact matches and paraphrased content across billions of sources.
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>AI Analysis</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            Analyzes text for statistical irregularities (perplexity, burstiness) typical of LLMs like GPT-4, Claude, and Gemini.
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Reports</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            Comprehensive data including Similarity Score, Sentiment Analysis, Context Tags, and AI Probability with highlighted evidence.
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </MotionTabsContent>

                    <MotionTabsContent key="api-reference" value="api-reference" variants={tabContentVariants} initial="initial" animate="animate" exit="exit" className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight mb-4 flex items-center gap-2">
                                <Code className="h-6 w-6 text-primary" /> API Reference
                            </h2>
                            <p className="text-muted-foreground mb-6">Detailed documentation for all API endpoints.</p>

                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2"><Lock className="h-5 w-5 text-red-500" /> Authentication</CardTitle>
                                        <CardDescription>Secure your API requests with Bearer tokens.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="rounded-md bg-slate-950 p-4 font-mono text-sm text-slate-50">
                                            Authorization: Bearer sk_live_...
                                        </div>
                                    </CardContent>
                                </Card>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Endpoints</h3>
                                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                                        <div className="p-4 border-b bg-muted/30 flex items-center gap-3">
                                            <span className="px-2.5 py-1 rounded-md bg-green-500/10 text-green-600 text-xs font-bold border border-green-500/20">POST</span>
                                            <code className="text-sm font-mono">/v1/documents/check</code>
                                        </div>
                                        <div className="p-4 text-sm text-muted-foreground">
                                            Initiates a new plagiarism check. Supports plain text or file upload.
                                        </div>
                                    </div>
                                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                                        <div className="p-4 border-b bg-muted/30 flex items-center gap-3">
                                            <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-600 text-xs font-bold border border-blue-500/20">GET</span>
                                            <code className="text-sm font-mono">/v1/documents/:id</code>
                                        </div>
                                        <div className="p-4 text-sm text-muted-foreground">
                                            Retrieves the full analysis report for a specific document ID.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </MotionTabsContent>

                    <MotionTabsContent key="faq" value="faq" variants={tabContentVariants} initial="initial" animate="animate" exit="exit" className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight mb-4 flex items-center gap-2">
                                <HelpCircle className="h-6 w-6 text-primary" /> Frequently Asked Questions
                            </h2>
                            <Accordion type="single" collapsible className="w-full space-y-4">
                                <AccordionItem value="item-1" className="bg-card border rounded-xl shadow-sm px-2 hover:border-primary/40 hover:shadow-md transition-all duration-300">
                                    <AccordionTrigger className="px-4 py-4 text-base font-medium hover:no-underline hover:text-primary transition-colors">How is the similarity score calculated?</AccordionTrigger>
                                    <AccordionContent className="px-4 pb-4 text-muted-foreground leading-relaxed">
                                        Our similarity score is an aggregate percentage based on matches found against our extensive database of web pages, academic papers, and journals. It uses both exact text matching and semantic analysis to detect paraphrasing.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2" className="bg-card border rounded-xl shadow-sm px-2 hover:border-primary/40 hover:shadow-md transition-all duration-300">
                                    <AccordionTrigger className="px-4 py-4 text-base font-medium hover:no-underline hover:text-primary transition-colors">Does the system store my uploaded documents?</AccordionTrigger>
                                    <AccordionContent className="px-4 pb-4 text-muted-foreground leading-relaxed">
                                        By default, documents are processed in memory and then discarded. However, you can opt-in to have your documents indexed in your private repository for future comparison within your organization.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-3" className="bg-card border rounded-xl shadow-sm px-2 hover:border-primary/40 hover:shadow-md transition-all duration-300">
                                    <AccordionTrigger className="px-4 py-4 text-base font-medium hover:no-underline hover:text-primary transition-colors">What is the difference between AI Detection and Plagiarism Detection?</AccordionTrigger>
                                    <AccordionContent className="px-4 pb-4 text-muted-foreground leading-relaxed">
                                        Plagiarism detection finds content copied from other sources. AI detection analyzes the text's statistical patterns (perplexity and burstiness) to determine the likelihood it was generated by an AI model like GPT-4 or Claude.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-4" className="bg-card border rounded-xl shadow-sm px-2 hover:border-primary/40 hover:shadow-md transition-all duration-300">
                                    <AccordionTrigger className="px-4 py-4 text-base font-medium hover:no-underline hover:text-primary transition-colors">Can I integrate this into my own LMS?</AccordionTrigger>
                                    <AccordionContent className="px-4 pb-4 text-muted-foreground leading-relaxed">
                                        Yes! We provide a comprehensive REST API and SDKs for Node.js and Python, making it easy to integrate plagiarism checking directly into your Learning Management System or custom application.
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </MotionTabsContent>

                    <MotionTabsContent key="support" value="support" variants={tabContentVariants} initial="initial" animate="animate" exit="exit" className="space-y-8">
                        <div className="grid lg:grid-cols-5 gap-12">
                            <div className="lg:col-span-2 space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold tracking-tight mb-2">Still need help?</h2>
                                    <p className="text-muted-foreground">Our support team is available to assist you with any technical implementation details.</p>
                                </div>

                                <div className="space-y-6">
                                    <Card className="border-border/60 shadow-sm hover:border-primary/20 transition-all">
                                        <CardContent className="p-6 flex items-start gap-4">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                                <Mail className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold mb-1">Email Us</h3>
                                                <p className="text-sm text-muted-foreground mb-3">For general inquiries and support</p>
                                                <div className="flex flex-col gap-1 text-sm">
                                                    <a href="mailto:utkarsh11980@gmail.com" className="text-primary font-medium hover:underline">utkarsh11980@gmail.com</a>
                                                    <a href="mailto:darwingamer11980@gmail.com" className="text-primary font-medium hover:underline">darwingamer11980@gmail.com</a>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>

                            <Card className="lg:col-span-3 border shadow-lg shadow-primary/5">
                                <CardHeader>
                                    <CardTitle>Send us a Message</CardTitle>
                                    <CardDescription>Fill out the form below and our team will reach out.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleContactSubmit} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="firstName">First Name</Label>
                                                <Input id="firstName" placeholder="John" required />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="lastName">Last Name</Label>
                                                <Input id="lastName" placeholder="Doe" required />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input id="email" type="email" placeholder="john@example.com" required />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="message">Message</Label>
                                            <Textarea id="message" placeholder="How can we help you?" className="min-h-[120px] resize-none" required />
                                        </div>

                                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                                            {isSubmitting ? 'Sending...' : <><Send className="mr-2 h-4 w-4" /> Send Message</>}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </MotionTabsContent>
                </AnimatePresence>
            </Tabs>
        </div>
    )
}
