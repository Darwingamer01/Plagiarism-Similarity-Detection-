import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { authService } from '../services/authService'
import { userService } from '../services/userService'
import { useAuthStore } from '../stores/authStore'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Pencil, Copy } from 'lucide-react'
import PageTransition from '../components/layout/PageTransition'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from '../components/ui/alert-dialog'

export default function SettingsPage() {
  const navigate = useNavigate()
  const { user, setUser } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [fullName, setFullName] = useState(user?.fullName || '')
  const [email, setEmail] = useState(user?.email || '')
  const [showApiKeyModal, setShowApiKeyModal] = useState(false)
  const [generatedApiKey, setGeneratedApiKey] = useState('')

  const generateKeyMutation = useMutation({
    mutationFn: authService.generateApiKey,
    onSuccess: (apiKey) => {
      setGeneratedApiKey(apiKey)
      setShowApiKeyModal(true)
      toast.success('API key generated successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to generate API key')
    },
  })

  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      const nameChanged = fullName !== user?.fullName
      const emailChanged = email !== user?.email

      if (nameChanged) {
        const updatedUser = await userService.updateProfile(fullName)
        setUser(updatedUser)
      }

      if (emailChanged) {
        await userService.requestEmailChange(email)
        localStorage.setItem('pendingEmail', email)
        navigate('/verify-email-otp')
      }

      return { nameChanged, emailChanged }
    },
    onSuccess: ({ nameChanged, emailChanged }) => {
      if (nameChanged && !emailChanged) {
        toast.success('Profile updated successfully')
        setIsEditing(false)
      } else if (emailChanged) {
        toast.success('Verification code sent to your new email')
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to update profile')
    },
  })

  const handleCancel = () => {
    setFullName(user?.fullName || '')
    setEmail(user?.email || '')
    setIsEditing(false)
  }

  const handleSubmit = () => {
    if (!fullName.trim()) {
      toast.error('Full name is required')
      return
    }
    if (!email.trim()) {
      toast.error('Email is required')
      return
    }
    updateProfileMutation.mutate()
  }

  const copyApiKey = () => {
    navigator.clipboard.writeText(generatedApiKey)
    toast.success('API key copied to clipboard!')
  }

  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="animate-fade-in">
          <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and API preferences
          </p>
        </div>

        <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </div>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Full Name</label>
            <Input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              readOnly={!isEditing}
              className={!isEditing ? "bg-muted" : ""}
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              readOnly={!isEditing}
              className={!isEditing ? "bg-muted" : ""}
            />
          </div>

          {isEditing && (
            <div className="flex justify-end gap-3 mt-4">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={updateProfileMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending ? 'Saving...' : 'Submit'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Key Management</CardTitle>
          <CardDescription>
            Generate an API key to use the plagiarism detection API programmatically.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => generateKeyMutation.mutate()}
            disabled={generateKeyMutation.isPending}
          >
            {generateKeyMutation.isPending ? 'Generating...' : 'Generate New API Key'}
          </Button>
        </CardContent>
      </Card>

      {/* API Key Modal using AlertDialog */}
      <AlertDialog open={showApiKeyModal} onOpenChange={setShowApiKeyModal}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl">Your API Key</AlertDialogTitle>
            <AlertDialogDescription>
              Keep this key secure and never share it publicly. You won't be able to see it again.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-6 mt-4">
            {/* API Key display */}
            <div className="bg-muted border rounded-lg p-4">
              <div className="flex items-center justify-between gap-4">
                <code className="text-sm font-mono break-all flex-1">
                  {generatedApiKey}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={copyApiKey}
                  title="Copy to clipboard"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Usage instructions */}
            <div className="space-y-4">
              <h4 className="font-semibold">How to Use Your API Key</h4>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Include your API key in the request header when making API calls:
                </p>
                <div className="bg-slate-950 text-slate-50 rounded-md p-4 overflow-x-auto">
                  <pre className="text-xs font-mono">
                    {`curl -X POST https://api.example.com/check-similarity \\
  -H "X-API-KEY: ${generatedApiKey}" \\
  -F "file=@document.pdf"`}
                  </pre>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-foreground">Available Endpoints:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><code className="text-xs bg-muted px-1 py-0.5 rounded">POST /api/documents/upload</code> - Upload documents</li>
                    <li><code className="text-xs bg-muted px-1 py-0.5 rounded">POST /api/similarity/check</code> - Check similarity</li>
                    <li><code className="text-xs bg-muted px-1 py-0.5 rounded">GET /api/documents</code> - List documents</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Close button */}
            <div className="flex justify-end pt-2">
              <Button onClick={() => setShowApiKeyModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
    </PageTransition>
  )
}
