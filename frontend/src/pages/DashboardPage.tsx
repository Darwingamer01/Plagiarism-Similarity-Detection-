import { useQuery } from '@tanstack/react-query'
import api from '../services/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Skeleton } from '../components/ui/skeleton'
import { Badge } from '../components/ui/badge'
import { Separator } from '../components/ui/separator'
import PageTransition from '../components/layout/PageTransition'

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const response = await api.get('/system/stats')
      return response.data.data
    },
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-12 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="animate-fade-in">
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Overview of your plagiarism detection system
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-2 hover:border-primary transition-all duration-300">
          <CardHeader className="pb-3">
            <CardDescription className="text-sm font-medium">Total Documents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {stats?.documents?.total || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Indexed in the system
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary transition-colors">
          <CardHeader className="pb-3">
            <CardDescription className="text-sm font-medium">Chunks Indexed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {stats?.documents?.totalChunks || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Text segments processed
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary transition-colors">
          <CardHeader className="pb-3">
            <CardDescription className="text-sm font-medium">Similarity Checks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {stats?.similarityChecks?.total || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Comparisons performed
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest system activity and document processing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {stats?.recentActivity?.slice(0, 5).map((activity: any, index: number) => (
              <div key={index}>
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{activity.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="font-normal">
                    {activity.type}
                  </Badge>
                </div>
                {index < 4 && <Separator />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
    </PageTransition>
  )
}
