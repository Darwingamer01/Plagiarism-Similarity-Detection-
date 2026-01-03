import { useState } from 'react'
import PageTransition from '../components/layout/PageTransition'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Label } from '../components/ui/label'
import { Mail, Send } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { LandingHeader } from '../components/layout/LandingHeader'
import { LandingFooter } from '../components/layout/LandingFooter'
import { motion } from 'framer-motion'

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))

        toast.success('Message sent! We will get back to you soon.')
        setIsSubmitting(false)
    }

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    }

    return (
        <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
            <LandingHeader />
            <div className="flex-grow pt-32 pb-20">
                <PageTransition>
                    <div className="container mx-auto px-4 md:px-6 max-w-6xl">
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="text-center mb-16"
                        >
                            <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-bold tracking-tight mb-6 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">Get in Touch</motion.h1>
                            <motion.p variants={itemVariants} className="text-muted-foreground text-lg max-w-2xl mx-auto">
                                Have questions about our services or need support? We're here to help.
                                Send us a message and we'll respond as soon as possible.
                            </motion.p>
                        </motion.div>

                        <div className="grid md:grid-cols-5 gap-12 items-start">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="md:col-span-2 space-y-8"
                            >
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4 p-6 rounded-xl bg-card border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all">
                                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                            <Mail className="h-6 w-6" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg mb-1">Email Us</h3>
                                            <p className="text-muted-foreground text-sm mb-3">For general inquiries and support</p>
                                            <div className="flex flex-col gap-1">
                                                <a href="mailto:utkarsh11980@gmail.com" className="text-primary font-medium hover:underline break-all">utkarsh11980@gmail.com</a>
                                                <a href="mailto:darwingamer11980@gmail.com" className="text-primary font-medium hover:underline break-all">darwingamer11980@gmail.com</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-muted/50 to-muted/20 rounded-2xl p-8 border border-border/50">
                                    <h3 className="font-semibold text-lg mb-3">Frequently Asked Questions</h3>
                                    <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                                        Check out our documentation for quick answers to common questions about usage, billing, and API limits.
                                    </p>
                                    <Button variant="outline" className="w-full" onClick={() => window.location.href = '/documentation'}>
                                        Visit Documentation
                                    </Button>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="md:col-span-3"
                            >
                                <Card className="border shadow-lg shadow-primary/5">
                                    <CardHeader>
                                        <CardTitle className="text-2xl">Send us a Message</CardTitle>
                                        <CardDescription>
                                            Fill out the form below and our team will reach out.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="firstName">First Name</Label>
                                                    <Input id="firstName" placeholder="John" required className="h-11" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="lastName">Last Name</Label>
                                                    <Input id="lastName" placeholder="Doe" required className="h-11" />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email</Label>
                                                <Input id="email" type="email" placeholder="john@example.com" required className="h-11" />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="message">Message</Label>
                                                <Textarea
                                                    id="message"
                                                    placeholder="How can we help you?"
                                                    className="min-h-[160px] resize-none"
                                                    required
                                                />
                                            </div>

                                            <Button type="submit" className="w-full h-11 text-base" disabled={isSubmitting}>
                                                {isSubmitting ? (
                                                    'Sending...'
                                                ) : (
                                                    <>
                                                        <Send className="mr-2 h-4 w-4" /> Send Message
                                                    </>
                                                )}
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    </div>
                </PageTransition>
            </div>
            <LandingFooter />
        </div>
    )
}
