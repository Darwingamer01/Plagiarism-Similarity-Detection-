import { ReactNode } from 'react';
import { ShieldCheck } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
  image?: string;
  title?: string;
  subtitle?: string;
}

export default function AuthLayout({ 
  children, 
  image = "/dashboard-mockup.webp", 
  title = "Secure Document Verification",
  subtitle = "Ensure originality and integrity with our advanced AI-powered detection system."
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: Decorative Image/Text Panel */}
      <div className="hidden lg:flex flex-col justify-between bg-zinc-900 text-white p-12 relative overflow-hidden">
        {/* Background Image / Gradient Overlay */}
        <div className="absolute inset-0 z-0">
             <img 
                src={image} 
                alt="Authentication Background" 
                className="w-full h-full object-cover opacity-20 filter blur-sm scale-110"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/80 to-zinc-900/40" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 font-bold text-xl">
             <div className="p-1.5 bg-white rounded-lg">
                <ShieldCheck className="h-5 w-5 text-zinc-900" />
             </div>
             Plagiarism Detection
          </div>
        </div>

        <div className="relative z-10 space-y-6 max-w-md">
           <blockquote className="text-lg font-medium leading-relaxed">
             &ldquo;{subtitle}&rdquo;
           </blockquote>
           <div className="h-1 w-12 bg-white/20 rounded-full" />
           <p className="text-sm text-zinc-400 font-medium tracking-wide">
             {title}
           </p>
        </div>
      </div>

      {/* Right: Form Area */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-[400px] space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
          {children}
        </div>
      </div>
    </div>
  );
}
