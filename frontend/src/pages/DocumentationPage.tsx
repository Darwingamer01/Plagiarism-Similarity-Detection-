import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion'
import { Button } from '../components/ui/button'
import { FileText, Search, History, Settings, Shield, Upload, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PageTransition from '../components/layout/PageTransition'

export default function DocumentationPage() {
    const navigate = useNavigate()

    return (
        <PageTransition>
            <div className="space-y-8">
                <div className="animate-fade-in">
                    <h1 className="text-4xl font-bold tracking-tight">Documentation</h1>
                    <p className="text-muted-foreground mt-2">
                        Learn how to use the Plagiarism Detection System effectively.
                    </p>
                </div>

                <Tabs defaultValue="getting-started" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
                    <TabsTrigger value="how-it-works">How It Works</TabsTrigger>
                    <TabsTrigger value="features">Features</TabsTrigger>
                    <TabsTrigger value="faq">FAQ</TabsTrigger>
                </TabsList>

                <TabsContent value="getting-started" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Start Guide</CardTitle>
                            <CardDescription>
                                Follow these simple steps to check your documents for plagiarism.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-3">
                                <div className="flex flex-col items-center text-center space-y-2 p-4 border rounded-lg bg-muted/50">
                                    <div className="p-3 bg-primary/10 rounded-full text-primary">
                                        <Upload className="h-8 w-8" />
                                    </div>
                                    <h3 className="font-semibold">1. Upload Documents</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Upload your reference documents (PDF or TXT) to build your knowledge base.
                                    </p>
                                    <Button variant="link" onClick={() => navigate('/upload')} className="mt-2">
                                        Go to Upload <ArrowRight className="ml-1 h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="flex flex-col items-center text-center space-y-2 p-4 border rounded-lg bg-muted/50">
                                    <div className="p-3 bg-primary/10 rounded-full text-primary">
                                        <Search className="h-8 w-8" />
                                    </div>
                                    <h3 className="font-semibold">2. Check Similarity</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Enter text or upload a file to check against your knowledge base.
                                    </p>
                                    <Button variant="link" onClick={() => navigate('/similarity-check')} className="mt-2">
                                        Go to Check <ArrowRight className="ml-1 h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="flex flex-col items-center text-center space-y-2 p-4 border rounded-lg bg-muted/50">
                                    <div className="p-3 bg-primary/10 rounded-full text-primary">
                                        <FileText className="h-8 w-8" />
                                    </div>
                                    <h3 className="font-semibold">3. View Results</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Get detailed analysis with similarity scores and highlighted matches.
                                    </p>
                                    <Button variant="link" onClick={() => navigate('/history')} className="mt-2">
                                        View History <ArrowRight className="ml-1 h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="how-it-works" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Under the Hood</CardTitle>
                            <CardDescription>
                                Understanding the technology behind our plagiarism detection.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="mt-1">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-background">
                                            1
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Vector Embeddings</h3>
                                        <p className="text-muted-foreground mt-1">
                                            When you upload a document, our AI converts the text into high-dimensional vector embeddings.
                                            These embeddings capture the semantic meaning of the text, not just keyword matching.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="mt-1">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-background">
                                            2
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">FAISS Indexing</h3>
                                        <p className="text-muted-foreground mt-1">
                                            We use FAISS (Facebook AI Similarity Search) to efficiently store and index these vectors.
                                            This allows for lightning-fast similarity searches even with a large database of documents.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="mt-1">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-background">
                                            3
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Semantic Search</h3>
                                        <p className="text-muted-foreground mt-1">
                                            When you perform a check, the system compares the semantic meaning of your input against
                                            the indexed documents. This detects paraphrasing and rewritten content that simple
                                            text matching might miss.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="features" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <History className="h-5 w-5" /> History Tracking
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    All your similarity checks are saved automatically. You can revisit past results,
                                    track changes over time, and manage your check history.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Settings className="h-5 w-5" /> API Integration
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Developers can generate API keys in the Settings page to integrate our
                                    detection engine directly into their own applications.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5" /> Secure & Private
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Your documents are processed securely. We use industry-standard encryption
                                    and strict access controls to ensure your data remains private.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" /> Document Management
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Easily manage your reference database. Upload multiple files at once,
                                    view document details, and delete outdated materials.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="faq" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Frequently Asked Questions</CardTitle>
                            <CardDescription>
                                Common questions about the system.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>What file formats are supported?</AccordionTrigger>
                                    <AccordionContent>
                                        Currently, we support PDF (.pdf) and Text (.txt) files for document uploads.
                                        For similarity checks, you can also paste raw text directly.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger>Is there a limit to file size?</AccordionTrigger>
                                    <AccordionContent>
                                        Yes, the current limit is 10MB per file to ensure optimal processing speed.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-3">
                                    <AccordionTrigger>How accurate is the detection?</AccordionTrigger>
                                    <AccordionContent>
                                        Our semantic analysis is highly accurate at detecting rewritten or paraphrased content.
                                        However, like all AI systems, it's designed to be a tool to assist human judgment,
                                        not replace it.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-4">
                                    <AccordionTrigger>Can I delete my data?</AccordionTrigger>
                                    <AccordionContent>
                                        Yes, you have full control. You can delete individual documents from the Documents page
                                        and clear your history from the History page.
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
        </PageTransition>
    )
}
