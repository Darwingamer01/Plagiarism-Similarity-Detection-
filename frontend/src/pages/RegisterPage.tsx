
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useGoogleLogin } from '@react-oauth/google'
import { authService } from '../services/authService'
import { useAuthStore } from '../stores/authStore'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Separator } from '../components/ui/separator'
import { Eye, EyeOff, Loader2, Info } from 'lucide-react'
import { Alert, AlertDescription } from '../components/ui/alert'
import AuthLayout from '../components/layout/AuthLayout'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

export default function RegisterPage() {
  const navigate = useNavigate()
  const { setUser, setTokens } = useAuthStore()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const registerMutation = useMutation({
    mutationFn: authService.initiateRegister,
    onSuccess: (data) => {
      toast.success('Verification code sent to your email!')
      navigate('/verify-email', { state: { email: data.email } })
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Registration failed')
    },
  })

  const googleLoginMutation = useMutation({
    mutationFn: (token: string) => authService.googleLogin(token),
    onSuccess: (result) => {
      if (result.isNewUser && result.data.profile) {
        navigate('/complete-registration', {
          state: {
            oauthData: {
              email: result.data.profile.email,
              fullName: result.data.profile.fullName || result.data.profile.name,
              provider: 'google',
              providerId: result.data.profile.providerId || '',
            }
          }
        })
      } else if (result.data.user && result.data.tokens) {
        setUser(result.data.user)
        setTokens(result.data.tokens.accessToken, result.data.tokens.refreshToken)
        toast.success('Login successful!')
        navigate('/dashboard')
      } else {
        toast.error('Sign up failed: Invalid response from server')
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Google sign up failed')
    },
  })

  // Initialize useGoogleLogin
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      googleLoginMutation.mutate(tokenResponse.access_token)
    },
    onError: () => {
      toast.error('Google sign up failed')
    },
  })

  const handleGoogleLogin = () => {
    if (!GOOGLE_CLIENT_ID) {
      toast.error('Google OAuth is not configured')
      return
    }
    googleLogin()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    registerMutation.mutate({ email, password, confirmPassword, fullName })
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join thousands of users ensuring content integrity with our platform."
      image="/auth-background.png"
    >
      <div className="space-y-2 text-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Register</h1>
        <p className="text-muted-foreground">
          Enter your information to get started
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            type="text"
            placeholder="John Doe"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="h-11"
          />
        </div>
        
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

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
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
            <Label htmlFor="confirmPassword">Confirm</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-11 pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <Alert className="bg-muted/50">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-xs text-muted-foreground">
            Must indicate at least 8 chars, uppercase, lowercase, number & special char.
          </AlertDescription>
        </Alert>

        <Button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full h-11 text-base font-semibold"
        >
          {registerMutation.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Create account
        </Button>
      </form>

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <div className="space-y-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleGoogleLogin()}
          disabled={googleLoginMutation.isPending}
          className="w-full h-11 font-medium bg-background hover:bg-muted/50"
        >
          <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
             <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
             <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
             <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
             <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Google
        </Button>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
             <Separator className="w-1/3 mx-auto" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
             <span className="bg-background px-2 text-muted-foreground">Already have an account?</span>
          </div>
        </div>

        <Link to="/login" className="block w-full">
            <Button variant="secondary" className="w-full h-11 font-medium bg-secondary/50 hover:bg-secondary/70">
              Sign in instead
            </Button>
        </Link>
        
        <p className="text-center text-xs text-muted-foreground mt-6">
            By creating an account, you agree to our{' '}
            <Link to="/terms?minimal=true" className="font-medium text-foreground hover:underline underline-offset-4">
              Terms of Service and Privacy Policy
            </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
