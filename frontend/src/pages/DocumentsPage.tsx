import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { documentService } from '../services/documentService'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Table, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { Skeleton } from '../components/ui/skeleton'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog'
import { FileText, Trash2, Eye, Calendar, HardDrive } from 'lucide-react'
import PageTransition from '../components/layout/PageTransition'
import { motion } from 'framer-motion'
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

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
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
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-muted/10 border-dashed"
        >
          <div className="p-4 bg-background rounded-full mb-4 shadow-sm">
            <FileText className="h-8 w-8 text-muted-foreground/40" />
          </div>
          <h3 className="text-lg font-medium text-muted-foreground">No documents found</h3>
          <p className="text-sm text-muted-foreground/60 mt-1 max-w-sm mx-auto">
            {isOwner ? "Upload your first document to get started." : "No community documents available yet."}
          </p>
        </motion.div>
      )
    }

    return (
      <div className="space-y-6">
        {/* Desktop Table View - Hidden on Mobile */}
        <div className="hidden md:block rounded-xl border bg-card/50 backdrop-blur-sm overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/40">
                <TableHead className="font-semibold w-[40%]">Filename</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Size</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <motion.tbody className="[&_tr:last-child]:border-0" variants={container} initial="hidden" animate="show">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {documents.map((doc: any) => (
                <motion.tr 
                    key={doc.id} 
                    variants={item}
                    className="group border-b transition-colors hover:bg-muted/30 data-[state=selected]:bg-muted"
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3 max-w-[300px]" title={doc.filename}>
                      <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                          <FileText className="h-4 w-4 shrink-0" />
                      </div>
                      <span className="truncate font-medium">{doc.filename}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <Badge variant="outline" className="font-mono text-xs uppercase">{doc.fileType}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono text-xs">{(doc.fileSize / 1024).toFixed(2)} KB</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadge(doc.status)} className="font-medium capitalize shadow-sm">
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
                        className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                        onClick={() => setSelectedDocId(doc.id)}
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {isOwner && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
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
                </motion.tr>
              ))}
            </motion.tbody>
          </Table>
        </div>

        {/* Mobile Card View - Hidden on Desktop */}
        <motion.div 
            className="grid grid-cols-1 gap-4 md:hidden"
            variants={container}
            initial="hidden"
            animate="show"
        >
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {documents.map((doc: any) => (
            <motion.div key={doc.id} variants={item}>
                <Card className="overflow-hidden border-border/60 shadow-sm active:scale-[0.98] transition-transform duration-200">
                <CardHeader className="pb-3 bg-muted/20">
                    <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="p-2 rounded-lg bg-background border shadow-sm shrink-0">
                            <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-sm font-semibold leading-snug break-all line-clamp-2">
                            {doc.filename}
                        </CardTitle>
                    </div>
                    <Badge variant={getStatusBadge(doc.status)} className="shrink-0 capitalize text-[10px] px-2 py-0.5 h-5">
                        {doc.status}
                    </Badge>
                    </div>
                </CardHeader>
                <CardContent className="py-3 text-sm text-muted-foreground grid grid-cols-2 gap-y-2 gap-x-4">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5" />
                        <span className="text-xs">{new Date(doc.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <HardDrive className="h-3.5 w-3.5" />
                        <span className="text-xs">{(doc.fileSize / 1024).toFixed(2)} KB</span>
                    </div>
                </CardContent>
                <CardFooter className="pt-0 pb-3 px-4 flex items-center gap-2">
                    <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 h-9 border-primary/20 hover:bg-primary/5 hover:text-primary transition-colors"
                    onClick={() => setSelectedDocId(doc.id)}
                    >
                    <Eye className="h-3.5 w-3.5 mr-2" />
                    View Details
                    </Button>
                    
                    {isOwner && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
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
            </motion.div>
          ))}
        </motion.div>

        {/* Pagination - Shared */}
        {data && data.pagination.totalPages > 1 && (
          <div className="flex justify-center pt-6 pb-2">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage(Math.max(1, page - 1))}
                    className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors"}
                  />
                </PaginationItem>
                <PaginationItem>
                   <div className="flex items-center px-4 text-sm font-medium">
                      Page {page} of {data.pagination.totalPages}
                   </div>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage(Math.min(data.pagination.totalPages, page + 1))}
                    className={page === data.pagination.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors"}
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
      <div className="space-y-8 pb-12">
        <div className="flex flex-col gap-2 md:gap-4 pb-4 border-b">
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">Documents</h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl">
            Manage your uploaded files and explore the community library of shared documents throughout the organization.
          </p>
        </div>

        <Tabs defaultValue="mine" className="w-full">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
            <TabsList className="grid w-full md:w-[400px] grid-cols-2 p-1 bg-muted/40 backdrop-blur-sm">
              <TabsTrigger value="mine" className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-300">My Documents</TabsTrigger>
              <TabsTrigger value="others" className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-300">Community</TabsTrigger>
            </TabsList>
            
            {/* Show Delete All only when in 'My Documents' and there are docs */}
            <TabsContent value="mine" className="mt-0 w-full md:w-auto">
              {myDocsData?.documents?.length > 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        disabled={deleteAllMutation.isPending} 
                        className="w-full md:w-auto border-destructive/20 text-destructive hover:bg-destructive/10 hover:border-destructive/30 transition-all hover:scale-105 active:scale-95 shadow-sm"
                    >
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
