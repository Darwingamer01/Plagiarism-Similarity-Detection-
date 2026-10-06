
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { authService } from '../services/authService'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { ArrowLeft, Loader2 } from 'lucide-react'
import AuthLayout from '../components/layout/AuthLayout'
import { motion } from 'framer-motion'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [isSubmitted, setIsSubmitted] = useState(false)

    const forgotPasswordMutation = useMutation({
        mutationFn: authService.forgotPassword,
        onSuccess: () => {
            setIsSubmitted(true)
            toast.success('Reset link sent to your email')
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
            toast.error(error.response?.data?.error?.message || 'Failed to send reset link')
        },
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        forgotPasswordMutation.mutate(email)
    }

    return (
        <AuthLayout
            title="Reset your password"
            subtitle="Secure account recovery to get you back on track."
            image="/auth-background.png"
        >
            <div className="space-y-2 text-center mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Forgot password?</h1>
                <p className="text-muted-foreground">
                    {isSubmitted 
                        ? "Check your email for the reset link" 
                        : "Enter your email address to reset your password"
                    }
                </p>
            </div>

            {isSubmitted ? (
                 <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6"
                 >
                    <div className="bg-muted/50 p-6 rounded-lg text-sm text-center border-2 border-dashed">
                        We have sent a password reset link to <br/>
                        <span className="font-semibold text-primary block mt-1 text-lg">{email}</span>
                        <br />
                        Please check your inbox and <strong>spam folder</strong>.
                    </div>
                    
                    <Button
                        variant="outline"
                        className="w-full h-11"
                        onClick={() => setIsSubmitted(false)}
                    >
                        Try another email
                    </Button>
                </motion.div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-11"
                        />
                    </div>
                    
                    <Button
                        type="submit"
                        disabled={forgotPasswordMutation.isPending}
                        className="w-full h-11 text-base font-semibold"
                        size="lg"
                    >
                        {forgotPasswordMutation.isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Send reset link
                    </Button>
                </form>
            )}

            <div className="mt-6 text-center">
                <Link
                    to="/login"
                    className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to sign in
                </Link>
            </div>
        </AuthLayout>
    )
}
