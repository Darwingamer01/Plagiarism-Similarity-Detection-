// Removed unused import

// Removed unused GoogleLoginResponse type
// Type guard for error with response structure
function isAxiosErrorWithMessage(error: unknown): error is { response: { data: { error?: { message?: string } } } } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as { response?: unknown }).response === 'object' &&
    (error as { response: { data?: unknown } }).response.data !== undefined
  );
}
import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useGoogleLogin } from '@react-oauth/google'
import { authService } from '../services/authService'
import { useAuthStore } from '../stores/authStore'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { Label } from '../components/ui/label'
import { Separator } from '../components/ui/separator'
import { Shield, Eye, EyeOff, User as UserIcon, X } from 'lucide-react'
import { Checkbox } from '../components/ui/checkbox'
import { motion } from 'framer-motion'

interface SavedAccount {
  email: string;
  password: string; // In a real app, never store passwords in localStorage. This is for demo purposes as requested.
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

export default function LoginPage() {
  const navigate = useNavigate()
  const { setUser, setTokens } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem('saved_accounts')
    if (saved) {
      try {
        setSavedAccounts(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse saved accounts', e)
      }
    }

    // Click outside to close dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setUser(data.user)
      setTokens(data.tokens.accessToken, data.tokens.refreshToken)

      if (rememberMe) {
        const newAccount = { email, password }
        // Remove existing if present to avoid duplicates/update password
        const updatedAccounts = savedAccounts.filter(acc => acc.email !== email)
        updatedAccounts.push(newAccount)
        setSavedAccounts(updatedAccounts)
        localStorage.setItem('saved_accounts', JSON.stringify(updatedAccounts))
      }

      toast.success('Login successful!')
      navigate('/dashboard')
    },
    onError: (error: unknown) => {
      if (
        isAxiosErrorWithMessage(error) &&
        typeof error.response.data.error?.message === 'string'
      ) {
        toast.error(error.response.data.error.message);
      } else {
        toast.error('Login failed');
      }
    },
  })

  const googleLoginMutation = useMutation({
    mutationFn: (token: string) => authService.googleLogin(token),
    onSuccess: (result) => {
      console.log('Google login mutation result:', result);
      // The backend response is nested: result.data.data.user, result.data.data.tokens
      const data = result.data;
      if (result.isNewUser) {
        const profile = data?.profile;
        navigate('/complete-registration', {
          state: {
            oauthData: {
              email: profile?.email || '',
              fullName: profile?.fullName || profile?.name || '',
              provider: 'google',
              providerId: profile?.providerId || '',
            }
          }
        });
        return;
      }
      if (data && data.user && data.tokens?.accessToken && data.tokens?.refreshToken) {
        setUser(data.user);
        setTokens(data.tokens.accessToken, data.tokens.refreshToken);
        toast.success('Login successful!');
        navigate('/dashboard');
      } else {
        toast.error('Invalid login response from server.');
        console.log('Google login response:', result);
      }
    },
    onError: (error: unknown) => {
      if (
        isAxiosErrorWithMessage(error) &&
        typeof error.response.data.error?.message === 'string'
      ) {
        toast.error(error.response.data.error.message);
      } else {
        toast.error('Google login failed');
      }
    },
  })



const googleLogin = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
    googleLoginMutation.mutate(tokenResponse.access_token);
  },
  onError: () => {
    toast.error('Google login failed');
  },
});
const handleGoogleLogin = () => {
  if (!GOOGLE_CLIENT_ID) {
    toast.error('Google OAuth is not configured');
    return;
  }
  googleLogin();
};



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    loginMutation.mutate({ email, password })
  }

  const handleAccountSelect = (account: SavedAccount) => {
    setEmail(account.email)
    setPassword(account.password)
    setShowDropdown(false)
  }

  const removeAccount = (e: React.MouseEvent, emailToRemove: string) => {
    e.stopPropagation()
    const updated = savedAccounts.filter(acc => acc.email !== emailToRemove)
    setSavedAccounts(updated)
    localStorage.setItem('saved_accounts', JSON.stringify(updated))
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4"
    >
      <div className="w-full max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col items-center mb-8"
        >
          <div className="flex items-center justify-center h-14 w-14 rounded-full bg-primary mb-4 animate-scale-in">
            <Shield className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Plagiarism Detection</h1>
          <p className="text-muted-foreground mt-2">Secure document verification</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-2">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2 relative" ref={dropdownRef}>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setShowDropdown(true)}
                  className="h-11"
                  autoComplete="off"
                />

                {/* Custom Dropdown */}
                {showDropdown && savedAccounts.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-popover border rounded-md shadow-md animate-in fade-in-0 zoom-in-95">
                    <div className="p-1">
                      {savedAccounts.map((account) => (
                        <div
                          key={account.email}
                          className="flex items-center justify-between p-2 hover:bg-accent hover:text-accent-foreground rounded-sm cursor-pointer group"
                          onClick={() => handleAccountSelect(account)}
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <UserIcon className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex flex-col overflow-hidden">
                              <span className="text-sm font-medium truncate">{account.email}</span>
                              <span className="text-xs text-muted-foreground truncate">••••••••</span>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => removeAccount(e, account.email)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
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
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </Label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full h-11"
                size="lg"
              >
                {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
              </Button>

              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    New here?
                  </span>
                </div>
              </div>

              <Button variant="outline" className="w-full h-11" asChild>
                <Link to="/register">
                  Create an account
                </Link>
              </Button>

              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => handleGoogleLogin()}
                disabled={googleLoginMutation.isPending}
                className="w-full h-11"
              >
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>
            </CardFooter>
          </form>
        </Card>
        </motion.div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </motion.div>
  )
}
