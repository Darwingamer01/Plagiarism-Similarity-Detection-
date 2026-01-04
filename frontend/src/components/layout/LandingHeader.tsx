import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../ui/button'
import { Shield, Menu, X } from 'lucide-react'

export function LandingHeader() {
    const navigate = useNavigate()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed top-0 w-full z-50 bg-background/70 backdrop-blur-xl border-b border-border/40 supports-[backdrop-filter]:bg-background/60"
        >
            <div className="w-full px-4 md:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-lg md:text-xl cursor-pointer" onClick={() => navigate('/')}>
                    <div className="flex items-center justify-center h-8 w-8 md:h-9 md:w-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/20">
                        <Shield className="h-4 w-4 md:h-5 md:w-5" />
                    </div>
                    <span>Plagiarism Detector</span>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-4">
                    <Button variant="ghost" onClick={() => navigate('/login')} className="hover:bg-primary/5">
                        Sign In
                    </Button>
                    <Button
                        onClick={() => navigate('/register')}
                        className="bg-primary hover:bg-primary/90 shadow-md shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                    >
                        Get Started
                    </Button>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu & Backdrop - Portalled to escape transform context */}
            {createPortal(
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <div className="fixed top-16 left-0 right-0 bottom-0 z-[100] md:hidden">
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="absolute inset-0 bg-black/40 backdrop-blur-md"
                                onClick={() => setIsMobileMenuOpen(false)}
                            />

                            {/* Menu Content */}
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute top-0 left-0 right-0 bg-background/90 backdrop-blur-xl border-t border-border/40 shadow-2xl overflow-hidden rounded-b-xl"
                            >
                                <div className="p-4 space-y-4 flex flex-col items-center">
                                    <Button variant="ghost" onClick={() => { navigate('/login'); setIsMobileMenuOpen(false) }} className="w-full justify-center">
                                        Sign In
                                    </Button>
                                    <Button onClick={() => { navigate('/register'); setIsMobileMenuOpen(false) }} className="w-full justify-center">
                                        Get Started
                                    </Button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </motion.nav>
    )
}
