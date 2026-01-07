import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { documentService } from '../services/documentService'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { Skeleton } from '../components/ui/skeleton'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog'
import { FileText, Trash2, Eye, Calendar, HardDrive } from 'lucide-react'
import PageTransition from '../components/layout/PageTransition'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination"
import { DocumentDetailsModal } from "../components/documents/DocumentDetailsModal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"

export default function DocumentsPage() {
  const queryClient = useQueryClient()
  const [myDocsPage, setMyDocsPage] = useState(1)
  const [communityDocsPage, setCommunityDocsPage] = useState(1)
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null)

  // Query for My Documents
  const { data: myDocsData, isLoading: myDocsLoading } = useQuery({
    queryKey: ['documents', 'mine', myDocsPage],
    queryFn: () => documentService.getDocuments({ page: myDocsPage, limit: 10, scope: 'mine' }),
  })

  // Query for Community Documents
  const { data: communityDocsData, isLoading: communityDocsLoading } = useQuery({
    queryKey: ['documents', 'others', communityDocsPage],
    queryFn: () => documentService.getDocuments({ page: communityDocsPage, limit: 10, scope: 'others' }),
  })

  const deleteMutation = useMutation({
    mutationFn: documentService.deleteDocument,
    onSuccess: () => {
      toast.success('Document deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Delete failed')
    },
  })

  const deleteAllMutation = useMutation({
    mutationFn: documentService.deleteAllDocuments,
    onSuccess: (data) => {
      toast.success(`${data.deletedCount} document(s) deleted successfully`)
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Delete all failed')
    },
  })

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      indexed: 'default',
      processing: 'secondary',
      failed: 'destructive',
    }
    return variants[status] || 'outline'
  }

  // Reusable Document List Component (Handles Desktop Table vs Mobile Cards)
  const DocumentList = ({ 
    data, 
    isLoading, 
    page, 
    setPage, 
    isOwner 
  }: { 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any, 
    isLoading: boolean, 
    page: number, 
    setPage: (p: number) => void, 
    isOwner: boolean 
  }) => {
    const documents = data?.documents || []

    if (isLoading) {
      return (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      )
    }

    if (!documents || documents.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-muted/10 border-dashed">
          <FileText className="h-12 w-12 mb-4 text-muted-foreground/20" />
          <h3 className="text-lg font-medium text-muted-foreground">No documents found</h3>
          <p className="text-sm text-muted-foreground/60 mt-1">
            {isOwner ? "Upload your first document to get started." : "No community documents available yet."}
          </p>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        {/* Desktop Table View - Hidden on Mobile */}
        <div className="hidden md:block rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold w-[40%]">Filename</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Size</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {documents.map((doc: any) => (
                <TableRow key={doc.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2 max-w-[300px]" title={doc.filename}>
                      <FileText className="h-4 w-4 text-primary shrink-0" />
                      <span className="truncate">{doc.filename}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{doc.fileType}</TableCell>
                  <TableCell className="text-muted-foreground">{(doc.fileSize / 1024).toFixed(2)} KB</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadge(doc.status)} className="font-normal capitalize scale-90 origin-left">
                      {doc.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                        onClick={() => setSelectedDocId(doc.id)}
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {isOwner && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Document</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{doc.filename}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteMutation.mutate(doc.id)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View - Hidden on Desktop */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {documents.map((doc: any, index: number) => (
            <Card key={doc.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base font-medium leading-snug break-all line-clamp-2">
                    {doc.filename}
                  </CardTitle>
                  <Badge variant={getStatusBadge(doc.status)} className="shrink-0 capitalize">
                    {doc.status}
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-2 text-xs">
                  <Calendar className="h-3 w-3" />
                  {new Date(doc.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-3 text-sm text-muted-foreground grid grid-cols-2 gap-2">
                 <div className="flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5" />
                    <span>{doc.fileType}</span>
                 </div>
                 <div className="flex items-center gap-1.5">
                    <HardDrive className="h-3.5 w-3.5" />
                    <span>{(doc.fileSize / 1024).toFixed(2)} KB</span>
                 </div>
              </CardContent>
              <CardFooter className="pt-0 flex items-center justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full flex-1"
                  onClick={() => setSelectedDocId(doc.id)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                
                {isOwner && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="w-[30%]">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Document</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this document?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMutation.mutate(doc.id)}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Pagination - Shared */}
        {data && data.pagination.totalPages > 1 && (
          <div className="flex justify-center pt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage(Math.max(1, page - 1))}
                    className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                {/* Simplified pagination for responsive view */}
                <PaginationItem>
                   <span className="flex items-center px-4 text-sm text-muted-foreground">
                      Page {page} of {data.pagination.totalPages}
                   </span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage(Math.min(data.pagination.totalPages, page + 1))}
                    className={page === data.pagination.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    )
  }

  return (
    <PageTransition>
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">
            Manage your uploads and browse community documents
          </p>
        </div>

        <Tabs defaultValue="mine" className="w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <TabsList className="grid w-full sm:w-[400px] grid-cols-2">
              <TabsTrigger value="mine">My Documents</TabsTrigger>
              <TabsTrigger value="others">Community Documents</TabsTrigger>
            </TabsList>
            
            {/* Show Delete All only when in 'My Documents' and there are docs */}
            <TabsContent value="mine" className="mt-0 w-full sm:w-auto">
              {myDocsData?.documents?.length > 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" disabled={deleteAllMutation.isPending} className="w-full sm:w-auto">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete All My Docs
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete All Documents?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete all {myDocsData?.pagination.total || 0} of your documents.
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteAllMutation.mutate()}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {deleteAllMutation.isPending ? 'Deleting...' : 'Delete All'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </TabsContent>
          </div>

          <TabsContent value="mine" className="mt-0 space-y-4">
             <Card className="border-none shadow-sm bg-transparent sm:bg-card sm:border">
               <CardHeader className="px-0 sm:px-6">
                 <CardTitle className="text-xl">My Uploads</CardTitle>
                 <CardDescription>
                    Documents you have uploaded to the system
                 </CardDescription>
               </CardHeader>
               <CardContent className="px-0 sm:px-6">
                 <DocumentList 
                    data={myDocsData} 
                    isLoading={myDocsLoading} 
                    page={myDocsPage} 
                    setPage={setMyDocsPage} 
                    isOwner={true} 
                  />
               </CardContent>
             </Card>
          </TabsContent>

          <TabsContent value="others" className="mt-0 space-y-4">
            <Card className="border-none shadow-sm bg-transparent sm:bg-card sm:border">
               <CardHeader className="px-0 sm:px-6">
                 <CardTitle className="text-xl">Community Library</CardTitle>
                 <CardDescription>
                    Explore unique documents uploaded by other users
                 </CardDescription>
               </CardHeader>
               <CardContent className="px-0 sm:px-6">
                 <DocumentList 
                    data={communityDocsData} 
                    isLoading={communityDocsLoading} 
                    page={communityDocsPage} 
                    setPage={setCommunityDocsPage} 
                    isOwner={false} 
                  />
               </CardContent>
             </Card>
          </TabsContent>
        </Tabs>

        <DocumentDetailsModal
          documentId={selectedDocId}
          onClose={() => setSelectedDocId(null)}
        />
      </div>
    </PageTransition>
  )
}
