import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LandingHeader } from '../components/layout/LandingHeader'
import { LandingFooter } from '../components/layout/LandingFooter'
import PageTransition from '../components/layout/PageTransition'
import { Plus, Minus, HelpCircle, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'

const faqs = [
    {
        question: "How does the plagiarism detection work?",
        answer: "Our system chops your text into small 'chunks' and creates unique digital fingerprints (hashes) for each. We then compare these fingerprints against our massive database of web content and academic papers using a high-speed Vector Database. This allows us to find matches even if a few words are changed."
    },
    {
        question: "Is my data check secure?",
        answer: "Yes, absolutely. We prioritize your privacy. We use industry-standard encryption for data in transit and at rest. Your documents are processed in memory for the scan and are NOT added to our public database."
    },
    {
        question: "What file formats do you support?",
        answer: "We currently support .txt (plain text) and pasting text directly. PDF and Word document support is being actively rolled out."
    },
    {
        question: "Do you detect AI-generated content?",
        answer: "AI Detection is currently in *Beta* development. We are training our own models on the latest LLM outputs (GPT-4, Claude 3) to give you a probability score, but this feature is experimental."
    },
    {
        question: "How do I upgrade my plan?",
        answer: "You can view our pricing tiers in the dashboard. We offer 'Pay as you go' credits so you only pay for what you scan."
    },
    {
        question: "Can I use the API for my own application?",
        answer: "Yes! We expose the exact same API that our dashboard uses. You can generate an API Key in your settings and start sending text for analysis programmatically."
    }
]

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    return (
        <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
            <LandingHeader />
            <div className="flex-grow pt-32 pb-20">
                <PageTransition>
                    <div className="w-full max-w-[1920px] mx-auto px-4 md:px-8">
                        <div className="text-center mb-16">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="inline-flex items-center justify-center p-3 mb-6 bg-primary/10 rounded-2xl text-primary">
                                    <HelpCircle className="w-8 h-8" />
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                                    Frequently Asked Questions
                                </h1>
                                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                                    Find answers to common questions about our platform, features, and pricing.
                                </p>
                            </motion.div>
                        </div>

                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="border border-border/50 rounded-xl bg-card overflow-hidden hover:border-primary/20 transition-colors"
                                >
                                    <button
                                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                        className="flex items-center justify-between w-full p-6 text-left"
                                    >
                                        <span className="text-lg font-medium pr-8">{faq.question}</span>
                                        <div className={`p-2 rounded-full transition-colors ${openIndex === index ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                            {openIndex === index ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                        </div>
                                    </button>
                                    <AnimatePresence>
                                        {openIndex === index && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                            >
                                                <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
                                                    {faq.answer}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 text-center"
                        >
                            <div className="inline-flex items-center justify-center p-3 mb-4 bg-background rounded-full shadow-sm">
                                <MessageCircle className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Still have questions?</h3>
                            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                                Can't find the answer you're looking for? Please chat to our friendly team.
                            </p>
                            <Link to="/contact">
                                <Button size="lg" className="h-12 px-8 text-base">
                                    Get in Touch
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </PageTransition>
            </div>
            <LandingFooter />
        </div>
    )
}
