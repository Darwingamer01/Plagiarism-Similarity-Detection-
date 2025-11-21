import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { documentService } from '../services/documentService'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Alert, AlertDescription } from '../components/ui/alert'
import { Upload, FileText, X, CheckCircle2 } from 'lucide-react'
import PageTransition from '../components/layout/PageTransition'

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([])
  const queryClient = useQueryClient()

  const uploadMutation = useMutation({
    mutationFn: documentService.ingestDocuments,
    onSuccess: (data) => {
      toast.success(`Successfully uploaded ${data.processedFiles.length} files`)
      setFiles([])
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
      queryClient.invalidateQueries({ queryKey: ['recent-activity'] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Upload failed')
    },
  })

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: 5242880, // 5MB
    maxFiles: 10,
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles)
    },
  })

  const handleUpload = () => {
    if (files.length === 0) {
      toast.error('Please select files to upload')
      return
    }
    uploadMutation.mutate(files)
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="animate-fade-in">
          <h1 className="text-4xl font-bold tracking-tight">Upload Documents</h1>
          <p className="text-muted-foreground mt-2">
            Add documents to your library for plagiarism detection
          </p>
        </div>

        <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Document Upload
          </CardTitle>
          <CardDescription>
            Drag and drop files or click to browse. Maximum 10 files, 5MB each.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
                <Upload className={`h-8 w-8 ${isDragActive ? 'text-primary animate-bounce' : 'text-muted-foreground'}`} />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium">
                  {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
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

          {files.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Selected Files</h3>
                <Badge variant="outline">{files.length} file{files.length > 1 ? 's' : ''}</Badge>
              </div>

              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
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
                      onClick={() => removeFile(index)}
                      className="ml-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button
                onClick={handleUpload}
                disabled={uploadMutation.isPending}
                className="w-full h-11"
                size="lg"
              >
                {uploadMutation.isPending ? (
                  <>Uploading...</>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Upload {files.length} file{files.length > 1 ? 's' : ''}
                  </>
                )}
              </Button>
            </div>
          )}

          <Alert>
            <AlertDescription className="text-sm">
              <strong>Note:</strong> Uploaded documents will be processed and indexed for plagiarism detection.
              This may take a few moments depending on file size.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
    </PageTransition>
  )
}
