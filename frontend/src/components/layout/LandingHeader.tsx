import { useState } from 'react'
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
            <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
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

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl overflow-hidden"
                    >
                        <div className="p-4 space-y-4 flex flex-col">
                            <Button variant="ghost" onClick={() => { navigate('/login'); setIsMobileMenuOpen(false) }} className="w-full justify-start">
                                Sign In
                            </Button>
                            <Button onClick={() => { navigate('/register'); setIsMobileMenuOpen(false) }} className="w-full">
                                Get Started
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    )
}
