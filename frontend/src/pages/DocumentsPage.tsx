import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { documentService } from '../services/documentService'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { Skeleton } from '../components/ui/skeleton'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog'
import { FileText, Trash2 } from 'lucide-react'
import PageTransition from '../components/layout/PageTransition'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination"

export default function DocumentsPage() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['documents', page],
    queryFn: () => documentService.getDocuments({ page, limit: 20 }),
  })

  console.log('Documents data:', data)
  console.log('Documents array:', data?.documents)

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

  const documents = data?.documents || []

  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="animate-fade-in">
          <h1 className="text-4xl font-bold tracking-tight">My Documents</h1>
          <p className="text-muted-foreground mt-2">
            Manage and view all your uploaded documents
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Document Library
                </CardTitle>
                <CardDescription>
                  {data?.pagination.total || 0} documents indexed
                </CardDescription>
              </div>
              {documents.length > 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" disabled={deleteAllMutation.isPending}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete All
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete All Documents?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete all {data?.pagination.total || 0} document(s) from your library.
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
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="font-semibold">Filename</TableHead>
                        <TableHead className="font-semibold">Type</TableHead>
                        <TableHead className="font-semibold">Size</TableHead>
                        <TableHead className="font-semibold">Chunks</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Date</TableHead>
                        <TableHead className="text-right font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {!documents || documents.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center">
                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                              <FileText className="h-12 w-12 mb-2 opacity-20" />
                              <p>No documents found</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        documents.map((doc: any, index: number) => (
                          <TableRow
                            key={doc.id}
                            className="animate-fade-in transition-colors hover:bg-muted/50"
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            <TableCell className="font-medium">{doc.filename}</TableCell>
                            <TableCell className="text-muted-foreground">{doc.fileType}</TableCell>
                            <TableCell className="text-muted-foreground">
                              {(doc.fileSize / 1024).toFixed(2)} KB
                            </TableCell>
                            <TableCell className="text-muted-foreground">{doc.chunksCount}</TableCell>
                            <TableCell>
                              <Badge variant={getStatusBadge(doc.status)} className="font-normal">
                                {doc.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {new Date(doc.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
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
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {data && data.pagination.totalPages > 1 && (
                  <div className="p-4 border-t">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => setPage(Math.max(1, page - 1))}
                            className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>

                        {Array.from({ length: data.pagination.totalPages }, (_, i) => i + 1).map((p) => {
                          // Show first page, last page, current page, and pages around current
                          if (
                            p === 1 ||
                            p === data.pagination.totalPages ||
                            (p >= page - 1 && p <= page + 1)
                          ) {
                            return (
                              <PaginationItem key={p}>
                                <PaginationLink
                                  isActive={page === p}
                                  onClick={() => setPage(p)}
                                  className="cursor-pointer"
                                >
                                  {p}
                                </PaginationLink>
                              </PaginationItem>
                            )
                          }

                          // Show ellipsis
                          if (
                            (p === page - 2 && p > 1) ||
                            (p === page + 2 && p < data.pagination.totalPages)
                          ) {
                            return (
                              <PaginationItem key={p}>
                                <PaginationEllipsis />
                              </PaginationItem>
                            )
                          }

                          return null
                        })}

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
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  )
}
