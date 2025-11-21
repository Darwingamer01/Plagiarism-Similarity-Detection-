import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { authService } from '../services/authService'
import { useAuthStore } from '../stores/authStore'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { Shield, Mail } from 'lucide-react'
import { Alert, AlertDescription } from '../components/ui/alert'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../components/ui/input-otp'
import { motion } from 'framer-motion'

export default function VerifyEmailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [otp, setOtp] = useState('')
  const email = location.state?.email || ''

  useEffect(() => {
    if (!email) {
      toast.error('Email not found. Please register again.')
      navigate('/register')
    }
  }, [email, navigate])

  const verifyMutation = useMutation({
    mutationFn: (data: { email: string; otp: string }) => authService.verifyRegister(data),
    onSuccess: (data) => {
      setAuth(data.user, data.tokens.accessToken, data.tokens.refreshToken)
      toast.success('Email verified successfully! Welcome!')
      navigate('/dashboard')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Verification failed')
    },
  })

  const handleVerify = () => {
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit code')
      return
    }
    verifyMutation.mutate({ email, otp })
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
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10">
                <Mail className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">Verify your email</CardTitle>
            <CardDescription className="text-center">
              We've sent a 6-digit code to <strong>{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>

              <Alert className="w-full">
                <AlertDescription className="text-xs text-center">
                  Check your email inbox (and spam folder) for the verification code. The code expires in 10 minutes.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              onClick={handleVerify}
              disabled={verifyMutation.isPending || otp.length !== 6}
              className="w-full h-11"
              size="lg"
            >
              {verifyMutation.isPending ? 'Verifying...' : 'Verify Email'}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Didn't receive the code?{' '}
              <Button
                variant="link"
                className="p-0 h-auto font-normal"
                onClick={() => navigate('/register')}
              >
                Go back to register
              </Button>
            </div>
          </CardFooter>
        </Card>
        </motion.div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Having trouble? Contact support for assistance
        </p>
      </div>
    </motion.div>
  )
}
