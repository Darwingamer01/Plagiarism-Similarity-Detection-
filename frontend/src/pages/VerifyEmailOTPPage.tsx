import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { userService } from '../services/userService'
import { useAuthStore } from '../stores/authStore'
import { Button } from '../components/ui/button'
import { ArrowLeft } from 'lucide-react'
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '../components/ui/input-otp'

export default function VerifyEmailOTPPage() {
    const navigate = useNavigate()
    const { setUser } = useAuthStore()
    const [otp, setOtp] = useState('')
    const pendingEmail = localStorage.getItem('pendingEmail') || ''

    const verifyMutation = useMutation({
        mutationFn: async () => {
            const updatedUser = await userService.verifyEmailChange(pendingEmail, otp)
            return updatedUser
        },
        onSuccess: (updatedUser) => {
            setUser(updatedUser)
            localStorage.removeItem('pendingEmail')
            toast.success('Email updated successfully!')
            navigate('/settings')
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
            toast.error(error.response?.data?.error?.message || 'Invalid or expired code')
        },
    })

    const resendMutation = useMutation({
        mutationFn: async () => {
            await userService.requestEmailChange(pendingEmail)
        },
        onSuccess: () => {
            toast.success('New verification code sent!')
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
            toast.error(error.response?.data?.error?.message || 'Failed to resend code')
        },
    })

    const handleVerify = () => {
        if (otp.length !== 6) {
            toast.error('Please enter a 6-digit code')
            return
        }
        verifyMutation.mutate()
    }

    const handleBack = () => {
        localStorage.removeItem('pendingEmail')
        navigate('/settings')
    }

    if (!pendingEmail) {
        navigate('/settings')
        return null
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <button
                        onClick={handleBack}
                        className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to Settings
                    </button>
                    <h2 className="text-3xl font-bold text-gray-900">Verify Your Email</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        We've sent a 6-digit verification code to{' '}
                        <span className="font-semibold">{pendingEmail}</span>.
                        <br />
                        Please check your spam folder as well.
                    </p>
                </div>

                <div className="card">
                    <div className="space-y-6">
                        <div className="flex flex-col items-center gap-4">
                            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                                Verification Code
                            </label>
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
                        </div>

                        <Button
                            onClick={handleVerify}
                            disabled={verifyMutation.isPending || otp.length !== 6}
                            className="w-full btn-primary"
                        >
                            {verifyMutation.isPending ? 'Verifying...' : 'Verify Email'}
                        </Button>

                        <div className="text-center">
                            <button
                                onClick={() => resendMutation.mutate()}
                                disabled={resendMutation.isPending}
                                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                            >
                                {resendMutation.isPending ? 'Sending...' : 'Resend Code'}
                            </button>
                        </div>
                    </div>
                </div>

                <p className="text-xs text-center text-gray-500">
                    The verification code will expire in 10 minutes
                </p>
            </div>
        </div>
    )
}
