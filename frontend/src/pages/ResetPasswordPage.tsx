import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { authService } from '../services/authService'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { Label } from '../components/ui/label'
import { Shield, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { Alert, AlertDescription } from '../components/ui/alert'

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const resetPasswordMutation = useMutation({
        mutationFn: authService.resetPassword,
        onSuccess: () => {
            setIsSuccess(true)
            toast.success('Password reset successfully')
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error?.message || 'Failed to reset password')
        },
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!token) {
            toast.error('Invalid reset link')
            return
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        resetPasswordMutation.mutate({ token, password })
    }

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
                <Card className="w-full max-w-md border-2 border-destructive/50">
                    <CardHeader>
                        <CardTitle className="text-destructive">Invalid Link</CardTitle>
                        <CardDescription>
                            This password reset link is invalid or missing the token.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button asChild className="w-full">
                            <Link to="/forgot-password">Request new link</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
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
                        <CardTitle className="text-2xl font-bold">Reset password</CardTitle>
                        <CardDescription>
                            Enter your new password below
                        </CardDescription>
                    </CardHeader>

                    {isSuccess ? (
                        <CardContent className="space-y-6">
                            <div className="flex flex-col items-center justify-center text-center space-y-4 py-4">
                                <div className="h-12 w-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                    <CheckCircle2 className="h-6 w-6" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-lg">Password Reset Complete</h3>
                                    <p className="text-muted-foreground text-sm">
                                        Your password has been successfully updated. You can now sign in with your new password.
                                    </p>
                                </div>
                            </div>
                            <Button asChild className="w-full h-11" size="lg">
                                <Link to="/login">Sign in</Link>
                            </Button>
                        </CardContent>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password">New Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            required
                                            minLength={8}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="h-11 pr-10"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-muted-foreground" />
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        required
                                        minLength={8}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="h-11"
                                    />
                                </div>

                                <Alert>
                                    <AlertDescription className="text-xs text-muted-foreground">
                                        Password must be at least 8 characters with uppercase, lowercase, number and special character
                                    </AlertDescription>
                                </Alert>
                            </CardContent>
                            <CardFooter className="flex flex-col gap-4">
                                <Button
                                    type="submit"
                                    disabled={resetPasswordMutation.isPending}
                                    className="w-full h-11"
                                    size="lg"
                                >
                                    {resetPasswordMutation.isPending ? 'Resetting password...' : 'Reset password'}
                                </Button>
                            </CardFooter>
                        </form>
                    )}
                </Card>
            </div>
        </div>
    )
}
