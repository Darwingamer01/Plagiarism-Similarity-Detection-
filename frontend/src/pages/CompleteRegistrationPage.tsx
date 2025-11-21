import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { authService } from '../services/authService'
import { useAuthStore } from '../stores/authStore'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { Label } from '../components/ui/label'
import { Shield } from 'lucide-react'

export default function CompleteRegistrationPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setUser, setTokens } = useAuthStore()

  const oauthData = location.state?.oauthData

  const [email] = useState(oauthData?.email || '')
  const [fullName, setFullName] = useState(oauthData?.fullName || '')

  useEffect(() => {
    if (!oauthData) {
      toast.error('Invalid OAuth session')
      navigate('/register')
    }
  }, [oauthData, navigate])

  const completeMutation = useMutation({
    mutationFn: authService.completeOAuthRegistration,
    onSuccess: (data) => {
      setUser(data.user)
      setTokens(data.tokens.accessToken, data.tokens.refreshToken)
      toast.success('Registration complete!')
      navigate('/dashboard')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Registration failed')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !fullName) {
      toast.error('Please fill in all fields')
      return
    }

    completeMutation.mutate({
      email,
      fullName,
      provider: oauthData.provider,
      providerId: oauthData.providerId,
    })
  }

  if (!oauthData) {
    return <Navigate to="/register" />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center h-14 w-14 rounded-full bg-primary mb-4">
            <Shield className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Almost there!</h1>
          <p className="text-muted-foreground mt-2">Complete your registration</p>
        </div>

        <Card className="border-2">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Complete Registration</CardTitle>
            <CardDescription>
              Confirm your details to finish setting up your account
            </CardDescription>
          </CardHeader>
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
                  className="h-11 bg-muted"
                  disabled
                  readOnly
                />
              </div>
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
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                disabled={completeMutation.isPending}
                className="w-full h-11"
                size="lg"
              >
                {completeMutation.isPending ? 'Completing registration...' : 'Complete Registration'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
