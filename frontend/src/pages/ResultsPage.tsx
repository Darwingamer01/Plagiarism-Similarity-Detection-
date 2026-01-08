import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { SimilarDocument, Match } from '../types'
import { useQuery } from '@tanstack/react-query'
import { similarityService } from '../services/similarityService'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Sparkles, AlignLeft, ArrowLeft, ArrowDown, AlertTriangle, CheckCircle2, BarChart3, ShieldCheck, ChevronDown, ChevronUp, Database, Upload } from 'lucide-react'
import { Skeleton } from '../components/ui/skeleton'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Separator } from '../components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { cn } from '../lib/utils'

function MatchesList({ matches }: { matches: Match[] }) {
    const [showAll, setShowAll] = useState(false);
    
    // Deduplicate matches based on query_text to avoid repeating checks on the same sentence
    // This addresses the user request "no just repeating chunks"
    const uniqueMatches = matches.filter((match, index, self) =>
        index === self.findIndex((m) => (
            m.query_text === match.query_text
        ))
    );

    const visibleMatches = showAll ? uniqueMatches : uniqueMatches.slice(0, 3);
    const hiddenCount = uniqueMatches.length - 3;

    return (
        <div className="space-y-4">
            <div className="grid gap-3">
                {visibleMatches.map((match, i) => (
                    <div key={i} className="flex flex-col md:grid md:grid-cols-2 gap-4 p-4 rounded-lg border bg-muted/10 text-sm relative animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="space-y-1">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground">Your Text</span>
                            <p className="font-mono text-xs leading-relaxed bg-background p-2 rounded border break-words whitespace-pre-wrap">{match.query_text}</p>
                        </div>

                        {/* Mobile Arrow Separator */}
                        <div className="flex justify-center md:hidden text-muted-foreground/50">
                            <ArrowDown className="h-4 w-4" />
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] uppercase font-bold text-muted-foreground">Matched Text</span>
                                <span className={cn("text-[10px] font-bold", match.similarity > 0.9 ? "text-red-600" : "text-orange-600")}>
                                    {(match.similarity * 100).toFixed(0)}% Match
                                </span>
                            </div>
                            <p className="font-mono text-xs leading-relaxed bg-yellow-50/50 dark:bg-yellow-900/10 p-2 rounded border border-yellow-200 dark:border-yellow-900/30 break-words whitespace-pre-wrap">
                                {match.matched_text}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {uniqueMatches.length > 3 && (
                <div className="flex justify-center">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setShowAll(!showAll)}
                        className="text-muted-foreground hover:text-primary transition-colors"
                    >
                        {showAll ? (
                            <>
                                <ChevronUp className="h-4 w-4 mr-2" /> Show Less
                            </>
                        ) : (
                            <>
                                <ChevronDown className="h-4 w-4 mr-2" /> View {hiddenCount} more match{hiddenCount !== 1 ? 'es' : ''}
                            </>
                        )}
                    </Button>
                </div>
            )}
        </div>
    )
}

export default function ResultsPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>()

    const { data, isLoading } = useQuery({
        queryKey: ['similarity-result', id],
        queryFn: () => similarityService.getResult(id!),
        enabled: !!id,
        retry: false
    })

    // Extract the inner results object from the API response
    const results = data?.results;

    if (isLoading) {
        return (
            <div className="w-full px-4 md:px-8 py-8 space-y-8 animate-in fade-in duration-500">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-24 rounded-md" />
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Skeleton className="h-32 w-full rounded-xl" />
                    <Skeleton className="h-32 w-full rounded-xl" />
                    <Skeleton className="h-32 w-full rounded-xl" />
                </div>
                <Skeleton className="h-[500px] w-full rounded-xl" />
            </div>
        );
    }

    if (!data || !results) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4 animate-in fade-in zoom-in-95 duration-500">
                <div className="p-4 bg-muted rounded-full">
                    <AlertTriangle className="h-10 w-10 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-semibold tracking-tight">No results found</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                    We couldn't retrieve the analysis for this document. It might have been deleted or the ID is invalid.
                </p>
                <Button onClick={() => navigate('/documents')} variant="outline" className="mt-4">
                    Return to Documents
                </Button>
            </div>
        )
    }



    const getSentimentBadge = (label: string, score?: number) => {
        const colorClass =
            label === 'POSITIVE' ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100' :
                label === 'NEGATIVE' ? 'bg-red-100 text-red-800 border-red-200 hover:bg-red-100' :
                    'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100';

        return (
            <Badge variant="outline" className={cn("px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider", colorClass)}>
                {label} {score !== undefined && `(${Math.round(score * 100)}%)`}
            </Badge>
        )
    }

    return (
        <div className="w-full px-4 md:px-8 pb-16 pt-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4 min-w-0 flex-1">
                    <Button variant="outline" size="icon" className="shrink-0 h-9 w-9 rounded-full mt-1" onClick={() => navigate(-1)}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground truncate" title={data.queryFilename}>{data.queryFilename}</h1>
                            <Badge variant="secondary" className="text-xs font-medium shrink-0">
                                v1.0
                            </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm flex items-center gap-2 flex-wrap">
                            Analysis completed on {new Date().toLocaleDateString()}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 items-center gap-0 bg-card rounded-lg border shadow-sm">
                    <div className="px-3 md:px-6 py-2 text-center">
                        <p className="text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1">Overall Score</p>
                        <p className={cn("text-xl md:text-2xl font-bold tracking-tight",
                            (results?.overall_score || 0) > 0.7 ? "text-red-600" :
                                (results?.overall_score || 0) > 0.4 ? "text-orange-600" : "text-green-600"
                        )}>
                            {(results?.overall_score !== undefined ? results.overall_score * 100 : 0).toFixed(1)}%
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid gap-8">

                {/* Scenario 0: Empty Database - Specific Prompt */}
                {results?.message?.includes('No documents in database') && (
                    <Card className="border-l-4 border-l-amber-500 overflow-hidden shadow-md transition-all hover:shadow-lg duration-300">
                        <CardHeader className="bg-gradient-to-r from-amber-50 to-transparent dark:from-amber-950/20 pb-4 border-b">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-full">
                                    <Database className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-bold text-amber-900 dark:text-amber-100">System Database Empty</CardTitle>
                                    <CardDescription className="text-amber-800/80 dark:text-amber-200/70 mt-1">
                                        We couldn't perform a similarity check because the reference database is empty.
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                             <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground bg-muted/30 p-5 rounded-xl border border-dashed leading-relaxed">
                                 The system needs at least one reference document in the database to compare against. Please upload a document to the Community or your private collection to initialize the database.
                             </div>
                             <div className="flex justify-end">
                                <Button onClick={() => navigate('/upload')} className="bg-amber-600 hover:bg-amber-700 text-white">
                                    <Upload className="mr-2 h-4 w-4" /> Upload Reference Document
                                </Button>
                             </div>
                        </CardContent>
                    </Card>
                )}

                {/* Scenario 1: No Matching Documents (Unique Content) */}
                {!results?.message?.includes('No documents in database') && results?.similar_documents?.length === 0 && results?.no_match_report && (
                    <Card className="border-l-4 border-l-emerald-500 overflow-hidden shadow-md transition-all hover:shadow-lg duration-300">
                        <CardHeader className="bg-gradient-to-r from-emerald-50 to-transparent dark:from-emerald-950/20 pb-4 border-b">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-full">
                                    <ShieldCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-bold text-emerald-900 dark:text-emerald-100">Unique Content Detected</CardTitle>
                                    <CardDescription className="text-emerald-800/80 dark:text-emerald-200/70 mt-1">
                                        Our analysis confirms that your document is distinct from our database.
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="pt-6 space-y-8">
                            {/* Reasoning Block */}
                            <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground bg-muted/30 p-5 rounded-xl border border-dashed leading-relaxed">
                                {results.no_match_report.reasoning}
                            </div>

                            {/* Comparison to Closest Match (if available) */}
                            {results.no_match_report.closest_match && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-100">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold tracking-tight flex items-center gap-2">
                                            <BarChart3 className="h-5 w-5 text-primary" /> Comparative Analysis
                                        </h3>
                                        <Badge variant="outline" className="bg-muted/50 text-muted-foreground">
                                            Comparison with Closest Match ({(results.no_match_report.closest_match.similarity * 100).toFixed(1)}%)
                                        </Badge>
                                    </div>

                                    {/* Summary Comparison Grid */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-card rounded-xl border shadow-sm p-1">
                                        {/* Your Document */}
                                        <div className="p-5 space-y-3 lg:border-r">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Your Document</h4>
                                                {getSentimentBadge(results.sentiment?.label || 'UNKNOWN', results.sentiment?.score)}
                                            </div>
                                            <div className="min-h-[100px] text-sm leading-relaxed text-foreground/90 bg-muted/20 p-4 rounded-lg border-l-2 border-primary/20">
                                                {results.summary || <span className="italic text-muted-foreground">No summary generated.</span>}
                                            </div>
                                            <div className="pt-2">
                                                <p className="text-xs text-muted-foreground font-medium mb-2">Identified Themes</p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {results.context?.slice(0, 5).map((t: { text: string; score: number } | string, i: number) => (
                                                        <Badge key={i} variant="secondary" className="text-[10px] px-2 bg-secondary/50 hover:bg-secondary/70 transition-colors">
                                                            {typeof t === 'string' ? t : t.text}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Closest Match */}
                                        <div className="p-5 space-y-3 bg-muted/10">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                                    Closest Match <span className="text-[10px] font-normal normal-case px-2 py-0.5 rounded-full bg-muted border text-muted-foreground">Rejected</span>
                                                </h4>
                                                {getSentimentBadge(results.no_match_report.closest_match.metadata?.sentiment?.label || 'UNKNOWN')}
                                            </div>
                                            <div className="min-h-[100px] text-sm leading-relaxed text-muted-foreground bg-background/50 p-4 rounded-lg border border-dashed">
                                                {results.no_match_report.closest_match.metadata?.summary || <span className="italic">No summary available for matched document.</span>}
                                            </div>
                                            <div className="pt-2">
                                                <p className="text-xs text-muted-foreground font-medium mb-2">Matched Themes</p>
                                                <div className="flex flex-wrap gap-1.5 opacity-75">
                                                    {results.no_match_report.closest_match.metadata?.context?.slice(0, 5).map((t: { text: string; score: number } | string, i: number) => (
                                                        <Badge key={i} variant="outline" className="text-[10px] px-2 bg-background">
                                                            {typeof t === 'string' ? t : t.text}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Scenario 2: Matches Found */}
                {results?.similar_documents?.length > 0 && results.similar_documents.map((doc: SimilarDocument, index: number) => (
                    <Card key={index} className="overflow-hidden shadow-md group transition-all hover:shadow-lg border-t-4 border-t-primary/80 duration-300">
                        <CardHeader className="bg-muted/10 pb-4 border-b">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="space-y-1.5 w-full">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                                        <h3 className="text-lg sm:text-l md:text-xl font-bold tracking-tight group-hover:text-primary transition-colors duration-300 break-words line-clamp-2">
                                            {doc.filename || `Reference Document ${index + 1}`}
                                        </h3>
                                        <Badge variant="outline" className="font-mono text-[10px] text-muted-foreground w-fit shrink-0">
                                            {doc.documentId.substring(0, 8)}...
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <span className={cn("font-medium", doc.similarity_score > 0.7 ? "text-red-600" : "text-orange-600")}>
                                            {(doc.similarity_score * 100).toFixed(1)}% Doc Similarity
                                        </span>
                                        <span>•</span>
                                        <span>{doc.matches?.length || 0} segments matched</span>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-6 space-y-8">
                            {/* AI Thought Process (New Section) */}
                            {doc.report?.thought_process && (
                                <div className="p-5 rounded-xl bg-violet-50/50 dark:bg-violet-950/10 border border-violet-100 dark:border-violet-900/30">
                                    <h4 className="text-sm font-semibold text-violet-900 dark:text-violet-100 mb-3 flex items-center gap-2">
                                        <Sparkles className="h-4 w-4 text-violet-600" /> AI Score Analysis
                                    </h4>
                                    <div className="space-y-4">
                                        {doc.report.thought_process.split('\n').map((line: string, i: number) => {
                                            // Handle Headers (###)
                                            if (line.trim().startsWith('###')) {
                                                const headerText = line.replace(/^###\s+/, '');
                                                // Skip redundant main header as it's already shown in the card title
                                                if (headerText.includes('AI Score Analysis')) return null;

                                                return (
                                                    <h4 key={i} className="text-sm font-bold text-violet-900 dark:text-violet-100 mt-4 first:mt-0 underline decoration-violet-300 underline-offset-4">
                                                        {headerText}
                                                    </h4>
                                                );
                                            }
                                            // Handle lists or regular paragraphs
                                            if (line.trim().length === 0) return null;

                                            // Basic Bold Parsing (**text**)
                                            const parts = line.split(/(\*\*.*?\*\*)/g);
                                            return (
                                                <p key={i} className="text-sm leading-relaxed text-violet-900/80 dark:text-violet-200/80 min-h-[1.5rem]">
                                                    {parts.map((part, j) => {
                                                        if (part.startsWith('**') && part.endsWith('**')) {
                                                            return <span key={j} className="font-bold text-violet-950 dark:text-violet-50">{part.slice(2, -2)}</span>;
                                                        }
                                                        return part;
                                                    })}
                                                </p>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Standard AI Insight (Legacy/Summary) */}
                            {doc.report && !doc.report.thought_process && (
                                <div className="relative overflow-hidden p-5 rounded-xl bg-blue-50/50 dark:bg-blue-950/10 border border-blue-100 dark:border-blue-900/30">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/50" />
                                    <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                                        <Sparkles className="h-4 w-4 text-blue-600" /> AI Analysis Insight
                                    </h4>
                                    <p className="text-sm leading-relaxed text-blue-800/90 dark:text-blue-200/90">
                                        {doc.report.reasoning}
                                    </p>
                                </div>
                            )}

                            {/* Summary Comparison */}
                            {/* Summary Comparison - Desktop Grid */}
                            <div className="hidden lg:grid grid-cols-2 gap-8">
                                {/* Source Side */}
                                <div className="space-y-3">
                                    <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                                        <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" /> Your Document
                                    </h5>
                                    <div className="bg-muted/20 p-4 rounded-lg border shadow-sm text-sm leading-relaxed h-full">
                                        {results.summary || <span className="italic text-muted-foreground">No summary available</span>}
                                    </div>
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {doc.report?.comparison.query_unique_topics.slice(0, 4).map((t: string, i: number) => (
                                            <Badge key={i} variant="secondary" className="text-[10px]">{t}</Badge>
                                        ))}
                                    </div>
                                </div>

                                {/* Matched Side */}
                                <div className="space-y-3">
                                    <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2 justify-end">
                                        Matched Document <span className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                                    </h5>
                                    <div className="bg-red-50/30 dark:bg-red-950/10 p-4 rounded-lg border border-red-100 dark:border-red-900/20 shadow-sm text-sm leading-relaxed h-full">
                                        {doc.summary || <span className="italic text-muted-foreground">No summary available</span>}
                                    </div>
                                    <div className="flex flex-wrap gap-2 pt-1 justify-end">
                                        {doc.report?.comparison.match_unique_topics.slice(0, 4).map((t: string, i: number) => (
                                            <Badge key={i} variant="outline" className="text-[10px] bg-background">{t}</Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Summary Comparison - Mobile Tabs */}
                            <Tabs defaultValue="source" className="lg:hidden w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="source">Your Document</TabsTrigger>
                                    <TabsTrigger value="match">Matched Document</TabsTrigger>
                                </TabsList>
                                <TabsContent value="source" className="space-y-3 mt-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <div className="bg-muted/20 p-4 rounded-lg border shadow-sm text-sm leading-relaxed min-h-[150px]">
                                        {results.summary || <span className="italic text-muted-foreground">No summary available</span>}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {doc.report?.comparison.query_unique_topics.slice(0, 4).map((t: string, i: number) => (
                                            <Badge key={i} variant="secondary" className="text-[10px]">{t}</Badge>
                                        ))}
                                    </div>
                                </TabsContent>
                                <TabsContent value="match" className="space-y-3 mt-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <div className="bg-red-50/30 dark:bg-red-950/10 p-4 rounded-lg border border-red-100 dark:border-red-900/20 shadow-sm text-sm leading-relaxed min-h-[150px]">
                                        {doc.summary || <span className="italic text-muted-foreground">No summary available</span>}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {doc.report?.comparison.match_unique_topics.slice(0, 4).map((t: string, i: number) => (
                                            <Badge key={i} variant="outline" className="text-[10px] bg-background">{t}</Badge>
                                        ))}
                                    </div>
                                </TabsContent>
                            </Tabs>

                            <Separator />

                            {/* Shared Context Box */}
                            <div className="bg-secondary/20 rounded-xl p-6 text-center border border-secondary/30">
                                <h5 className="text-sm font-semibold mb-3 flex items-center justify-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-primary" /> Shared Context & Themes
                                </h5>
                                {doc.report?.comparison.common_topics && doc.report.comparison.common_topics.length > 0 ? (
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {doc.report.comparison.common_topics.map((t: string, i: number) => (
                                            <Badge key={i} className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 text-sm py-1 px-3">
                                                {t}
                                            </Badge>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">No direct thematic overlap detected.</p>
                                )}
                                <div className="mt-4 pt-4 border-t border-dashed border-secondary/30 flex justify-center gap-6 text-sm text-muted-foreground">
                                    <span>Sentiment Match: <strong className={doc.report?.comparison.sentiment_contrast.match_status === 'MATCH' ? 'text-green-600' : 'text-orange-600'}>{doc.report?.comparison.sentiment_contrast.match_status}</strong></span>
                                    <span>•</span>
                                    <span>Similarity Score: <strong>{(doc.similarity_score * 100).toFixed(1)}%</strong></span>
                                </div>
                            </div>

                            {/* Text Segments */}
                            {doc.matches && doc.matches.length > 0 && (
                                <div className="space-y-4">
                                    <h5 className="font-semibold text-sm flex items-center gap-2">
                                        <AlignLeft className="h-4 w-4" /> Relevant Text Matches
                                    </h5>
                                    <div className="grid gap-3">
                                        {/* Use a state if you want independent pagination per card, 
                                            but since this is mapped, we'll implement a simple show more/less component or logic inline.
                                            For simplicity in this file without refactoring into a sub-component, 
                                            we will show only the uniquely best matches and limit them. 
                                        */}
                                        <MatchesList matches={doc.matches} />
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}


