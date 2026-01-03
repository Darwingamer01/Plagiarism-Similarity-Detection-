import { Shield } from 'lucide-react'

export function LandingFooter() {
    return (
        <footer className="py-12 bg-primary text-primary-foreground border-t border-primary-foreground/10">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-8">
                    {/* Logo - Left aligned on desktop, centered on mobile */}
                    <div className="flex items-center justify-center md:justify-start gap-2 font-bold opacity-90">
                        <div className="h-8 w-8 rounded-lg bg-primary-foreground/10 flex items-center justify-center text-primary-foreground">
                            <Shield className="h-5 w-5" />
                        </div>
                        <span className="text-lg tracking-tight">Plagiarism Detector</span>
                    </div>

                    {/* Links - Centered */}
                    <div className="flex justify-center gap-8 text-sm font-medium text-primary-foreground/60">
                        <FooterLink href="/faq">FAQ</FooterLink>
                        <FooterLink href="/terms">Terms</FooterLink>
                        <FooterLink href="/privacy">Privacy</FooterLink>
                        <FooterLink href="/contact">Contact</FooterLink>
                    </div>

                    {/* Copyright - Right aligned on desktop, centered on mobile */}
                    <div className="text-center md:text-right">
                        <p className="text-sm text-primary-foreground/50">
                            © {new Date().getFullYear()} Plagiarism Detector.
                        </p>
                    </div>
                </div>
            </div>
        </footer >
    )
}

function FooterLink({ href, children }: { href: string, children: React.ReactNode }) {
    return (
        <a href={href} className="hover:text-primary-foreground transition-colors relative group">
            {children}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-foreground/50 transition-all duration-300 group-hover:w-full" />
        </a>
    )
}
