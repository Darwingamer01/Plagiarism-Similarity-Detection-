import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { similarityService } from '../services/similarityService'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Alert, AlertDescription } from '../components/ui/alert'
import { Search, FileText, X, Info } from 'lucide-react'
import PageTransition from '../components/layout/PageTransition'

export default function SimilarityCheckPage() {
  const navigate = useNavigate()
  const [file, setFile] = useState<File | null>(null)
  const queryClient = useQueryClient()

  const checkMutation = useMutation({
    mutationFn: () => similarityService.checkSimilarity(file!, 0.88, 5),
    onSuccess: (data) => {
      toast.success('Similarity check completed!')
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['similarity-history'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
      queryClient.invalidateQueries({ queryKey: ['recent-activity'] })
      navigate(`/results/${data.checkId}`)
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Check failed')
    },
  })

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: 5242880,
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0])
    },
  })

  const handleCheck = () => {
    if (!file) {
      toast.error('Please select a file')
      return
    }
    checkMutation.mutate()
  }

  const removeFile = () => {
    setFile(null)
  }

  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="animate-fade-in">
          <h1 className="text-4xl font-bold tracking-tight">Check Similarity</h1>
          <p className="text-muted-foreground mt-2">
            Upload a document to check for plagiarism against your library
          </p>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Plagiarism Detection
            </CardTitle>
            <CardDescription>
              Upload a document to analyze. We'll compare it against all indexed documents.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!file ? (
              <>
                <div
                  {...getRootProps()}
                  className={`relative border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all duration-200 ${isDragActive
                    ? 'border-primary bg-primary/5 scale-[1.02]'
                    : 'border-border hover:border-primary/50 hover:bg-accent/50'
                    }`}
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-4">
                      <Search className={`h-8 w-8 ${isDragActive ? 'text-primary animate-bounce' : 'text-muted-foreground'}`} />
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg font-medium">
                        {isDragActive ? 'Drop file here' : 'Drag & drop file here'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        or click to browse from your computer
                      </p>
                    </div>
                    <div className="flex gap-2 flex-wrap justify-center">
                      <Badge variant="secondary">.txt</Badge>
                      <Badge variant="secondary">.pdf</Badge>
                      <Badge variant="secondary">.docx</Badge>
                    </div>
                  </div>
                </div>

                <Alert>
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      <strong>Note:</strong> Only one file can be checked at a time. Maximum file size is 5MB.
                    </AlertDescription>
                  </div>
                </Alert>
              </>
            ) : (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-base font-semibold">Selected File</div>
                    <Badge variant="outline">Ready to check</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="rounded-md bg-primary/10 p-2">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="font-medium truncate">{file.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                      className="ml-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Button
                    onClick={handleCheck}
                    disabled={checkMutation.isPending}
                    className="w-full h-11"
                    size="lg"
                  >
                    {checkMutation.isPending ? (
                      <>
                        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Check for Plagiarism
                      </>
                    )}
                  </Button>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      Analysis may take 10-30 seconds depending on document size and library complexity.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border border-dashed bg-muted/30">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-primary/10 p-2 mt-1">
                <Info className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="font-semibold">How it works</h3>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Your document is analyzed and compared against the indexed library</li>
                  <li>AI-powered semantic similarity detection identifies potential matches</li>
                  <li>Results show similarity scores and highlighted matching sections</li>
                  <li>Adjust threshold for stricter or more lenient detection</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  )
}
