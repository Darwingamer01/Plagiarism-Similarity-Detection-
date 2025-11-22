import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { similarityService } from '../services/similarityService'
import { Card, CardContent } from '../components/ui/card'
import { Skeleton } from '../components/ui/skeleton'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog'
import { Trash2 } from 'lucide-react'
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

export default function HistoryPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['similarity-history', page],
    queryFn: () => similarityService.getHistory({ page, limit: 20 }),
  })

  const clearHistoryMutation = useMutation({
    mutationFn: similarityService.clearHistory,
    onSuccess: (data) => {
      toast.success(`${data.deletedCount} similarity check(s) deleted successfully`)
      queryClient.invalidateQueries({ queryKey: ['similarity-history'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Clear history failed')
    },
  })

  const deleteCheckMutation = useMutation({
    mutationFn: similarityService.deleteCheck,
    onSuccess: () => {
      toast.success('Similarity check deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['similarity-history'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Delete failed')
    },
  })

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'VERY HIGH':
        return 'bg-red-100 text-red-800'
      case 'HIGH':
        return 'bg-orange-100 text-orange-800'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800'
      case 'LOW':
        return 'bg-lime-100 text-lime-800'
      case 'VERY LOW':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Similarity Check History</h1>
            <p className="text-muted-foreground mt-2">
              View and manage your past similarity check results
            </p>
          </div>
          {data && data.checks && data.checks.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={clearHistoryMutation.isPending}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear History
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear All History?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all {data?.pagination?.total || 0} similarity check(s) from your history.
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => clearHistoryMutation.mutate()}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {clearHistoryMutation.isPending ? 'Clearing...' : 'Clear History'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="space-y-3 p-6">
                {[1,2,3,4,5].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                          Query File
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                          Max Similarity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                          Risk Level
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                          Threshold
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-card divide-y divide-border">
                      {!data?.checks || data.checks.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center">
                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                              <svg className="h-12 w-12 mb-3 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <p className="text-sm font-medium">No similarity checks found</p>
                              <p className="text-xs text-muted-foreground mt-1">Upload a document and run a similarity check to see results here</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        data.checks.map((check: any, index: number) => (
                          <tr
                            key={check.id}
                            className="hover:bg-muted/50 transition-all duration-200 animate-fade-in"
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {check.queryFilename}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className="font-semibold text-primary">
                                {(check.maxSimilarity * 100).toFixed(1)}%
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge variant="outline" className={`${getRiskColor(check.riskLevel)} border-0`}>
                                {check.riskLevel}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                              {(check.threshold * 100).toFixed(0)}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge
                                variant="secondary"
                                className={
                                  check.status === 'completed'
                                    ? 'bg-green-100 text-green-800 hover:bg-green-100'
                                    : check.status === 'processing'
                                      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                                      : 'bg-red-100 text-red-800 hover:bg-red-100'
                                }
                              >
                                {check.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                              {new Date(check.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="link"
                                  className="h-auto p-0 text-primary"
                                  onClick={() => navigate(`/results/${check.id}`)}
                                >
                                  View Details
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Similarity Check?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This will permanently delete the similarity check for "{check.queryFilename}".
                                        This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => deleteCheckMutation.mutate(check.id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
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
