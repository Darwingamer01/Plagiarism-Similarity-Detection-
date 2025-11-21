import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { authService } from '../services/authService'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { Label } from '../components/ui/label'
import { Shield, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [isSubmitted, setIsSubmitted] = useState(false)

    const forgotPasswordMutation = useMutation({
        mutationFn: authService.forgotPassword,
        onSuccess: () => {
            setIsSubmitted(true)
            toast.success('Reset link sent to your email')
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error?.message || 'Failed to send reset link')
        },
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        forgotPasswordMutation.mutate(email)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
            <div className="w-full max-w-md">
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center justify-center h-14 w-14 rounded-full bg-primary mb-4">
                        <Shield className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Plagiarism Detection</h1>
                </div>

                <Card className="border-2">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold">Forgot password?</CardTitle>
                        <CardDescription>
                            {isSubmitted
                                ? 'Check your email for the reset link'
                                : 'Enter your email address and we\'ll send you a link to reset your password'}
                        </CardDescription>
                    </CardHeader>

                    {isSubmitted ? (
                        <CardContent className="space-y-4">
                            <div className="bg-muted/50 p-4 rounded-lg text-sm text-center">
                                We have sent a password reset link to <strong>{email}</strong>.
                                Please check your email inbox and spam folder.
                            </div>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => setIsSubmitted(false)}
                            >
                                Try another email
                            </Button>
                        </CardContent>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <CardContent className="space-y-4">
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
                            </CardContent>
                            <CardFooter className="flex flex-col gap-4">
                                <Button
                                    type="submit"
                                    disabled={forgotPasswordMutation.isPending}
                                    className="w-full h-11"
                                    size="lg"
                                >
                                    {forgotPasswordMutation.isPending ? 'Sending link...' : 'Send reset link'}
                                </Button>
                            </CardFooter>
                        </form>
                    )}

                    <CardFooter className="flex justify-center border-t p-4">
                        <Link
                            to="/login"
                            className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to sign in
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
