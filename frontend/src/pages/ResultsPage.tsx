import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { similarityService } from '../services/similarityService'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Skeleton } from '../components/ui/skeleton'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'

export default function ResultsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>()

  const { data, isLoading } = useQuery({
    queryKey: ['similarity-result', id],
    queryFn: () => similarityService.getResult(id!),
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center pt-2 pl-4">
          <Button variant="ghost" size="sm" className="mr-2" onClick={() => navigate(-1)}>
            ← Back
          </Button>
          <div className="ml-4">
            <h1 className="text-4xl font-bold tracking-tight">Similarity Results</h1>
            <p className="text-muted-foreground mt-2">Detailed analysis of your document's similarity check</p>
          </div>
        </div>
        <div className="space-y-3 p-6">
          {[1,2,3,4].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return <div className="text-center py-8">No results found</div>
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'VERY HIGH':
        return 'text-red-600 bg-red-100'
      case 'HIGH':
        return 'text-orange-600 bg-orange-100'
      case 'MEDIUM':
        return 'text-yellow-600 bg-yellow-100'
      case 'LOW':
        return 'text-lime-600 bg-lime-100'
      case 'VERY LOW':
        return 'text-green-600 bg-green-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center pt-2 pl-4">
        <Button variant="ghost" size="sm" className="mr-2" onClick={() => navigate(-1)}>
          ← Back
        </Button>
        <div className="ml-4">
          <h1 className="text-4xl font-bold tracking-tight">Similarity Results</h1>
          <p className="text-muted-foreground mt-2">Detailed analysis of your document's similarity check</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{data.queryFilename}</CardTitle>
              <CardDescription>Threshold: {data.threshold}</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-primary">
                {(data.maxSimilarity * 100).toFixed(1)}%
              </div>
              <Badge variant="outline" className={`mt-1 ${getRiskColor(data.riskLevel)} border-0`}>
                {data.riskLevel} RISK
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {data.results?.similar_documents?.length > 0 ? (
            <div className="space-y-6">
              <h3 className="font-semibold text-lg">Similar Documents Found:</h3>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {data.results.similar_documents.map((doc: any, index: number) => (
                <Card key={index} className="border shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium">{doc.filename || `Document ${index + 1}`}</h4>
                      <span className="text-lg font-semibold text-primary">
                        {(doc.max_similarity * 100).toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Matched Chunks: {doc.matched_chunks || 0}
                    </p>
                    {doc.matches && doc.matches.length > 0 && (
                      <div className="mt-4 space-y-3">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {doc.matches.slice(0, 3).map((match: any, matchIndex: number) => (
                          <div key={matchIndex} className="bg-muted/50 p-3 rounded text-sm">
                            <div className="text-foreground">
                              <strong>Query:</strong> {match.query_text}
                            </div>
                            <div className="text-foreground mt-2">
                              <strong>Match:</strong> {match.matched_text}
                            </div>
                            <div className="text-muted-foreground mt-1">
                              Similarity: {(match.similarity * 100).toFixed(1)}%
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No similar documents found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
