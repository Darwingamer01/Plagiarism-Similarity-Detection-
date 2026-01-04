
import { useQuery } from '@tanstack/react-query';
import { documentService } from '../../services/documentService';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';
import { FileText, Calendar, Database, AlignLeft, List, X } from 'lucide-react';
import { Skeleton } from '../../components/ui/skeleton';

interface DocumentDetailsModalProps {
    documentId: string | null;
    onClose: () => void;
}

export function DocumentDetailsModal({ documentId, onClose }: DocumentDetailsModalProps) {
    const { data: document, isLoading, isError } = useQuery({
        queryKey: ['document', documentId],
        queryFn: () => (documentId ? documentService.getDocument(documentId) : null),
        enabled: !!documentId,
        retry: 1
    });

    const getSentimentColor = (label?: string) => {
        switch (label?.toUpperCase()) {
            case 'POSITIVE': return 'bg-green-100 text-green-800 border-green-200';
            case 'NEGATIVE': return 'bg-red-100 text-red-800 border-red-200';
            case 'NEUTRAL': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <Dialog open={!!documentId} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="w-[90%] max-w-[90vw] sm:w-full sm:max-w-md md:max-w-lg lg:max-w-3xl bg-background p-0 gap-0 max-h-[85vh] flex flex-col shadow-2xl">
                <DialogHeader className="px-6 py-4 border-b shrink-0 bg-background/95 backdrop-blur z-10 flex flex-row items-center justify-between">
                    <div>
                        <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            Document Details
                        </DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground mt-1">
                            Review the analysis, sentiment, and key themes extracted from this document.
                        </DialogDescription>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1.5 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground focus:outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        aria-label="Close"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </DialogHeader>

                <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-muted/5">
                    {isLoading ? (
                        <div className="p-4 space-y-4 h-full flex flex-col justify-center">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-10 w-10 rounded-lg" />
                                <div className="space-y-1.5 flex-1">
                                    <Skeleton className="h-3 w-1/3" />
                                    <Skeleton className="h-3 w-1/4" />
                                </div>
                            </div>
                            <Skeleton className="h-24 w-full rounded-xl" />
                            <div className="grid grid-cols-2 gap-3">
                                <Skeleton className="h-20 w-full rounded-xl" />
                                <Skeleton className="h-20 w-full rounded-xl" />
                            </div>
                        </div>
                    ) : isError ? (
                        <div className="flex flex-col items-center justify-center h-full text-destructive px-6 text-center">
                            <div className="bg-destructive/10 p-3 rounded-full mb-3">
                                <FileText className="h-6 w-6 text-destructive" />
                            </div>
                            <span className="font-semibold text-sm">Error loading document</span>
                        </div>
                    ) : document ? (
                        <div className="flex flex-col h-full">
                            <div className="p-3 sm:p-4 md:p-5 flex-1 flex flex-col gap-3 sm:gap-4 overflow-hidden">

                                {/* Key Information Grid - Compact */}
                                <div className="grid grid-cols-2 gap-2 sm:gap-3 shrink-0">
                                    <div className="space-y-0.5 p-2 sm:p-2.5 rounded-lg border bg-background/50">
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">Filename</label>
                                        <div className="font-medium text-xs sm:text-sm truncate" title={document.filename}>{document.filename}</div>
                                    </div>
                                    <div className="space-y-0.5 p-2 sm:p-2.5 rounded-lg border bg-background/50">
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">Status</label>
                                        <div className="flex items-center gap-1.5">
                                            <Badge variant={document.status === 'indexed' ? 'default' : 'secondary'} className="capitalize h-4 px-1.5 text-[10px]">
                                                {document.status}
                                            </Badge>
                                            <span className="text-[10px] text-muted-foreground truncate">
                                                {document.chunksCount} chunks
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* AI Summary Section - Clamped */}
                                <div className="flex-1 min-h-0 flex flex-col">
                                    <h3 className="text-xs font-semibold flex items-center gap-1.5 text-foreground mb-1.5 shrink-0">
                                        <AlignLeft className="h-3.5 w-3.5 text-primary" />
                                        Executive Summary
                                    </h3>
                                    <div className="bg-background/50 p-3 rounded-xl border border-border/50 text-xs sm:text-sm leading-relaxed text-foreground/90 shadow-sm relative overflow-hidden flex-1">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-primary/20" />
                                        <div className="line-clamp-[8] sm:line-clamp-[10] md:line-clamp-12">
                                            {document.summary || <span className="text-muted-foreground italic">No summary available.</span>}
                                        </div>
                                    </div>
                                </div>

                                {/* Deep Analysis Grid - Compact */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 shrink-0 h-[100px] sm:h-[110px]">
                                    {/* Themes - Scroll/Clip */}
                                    <div className="hidden sm:flex flex-col min-h-0">
                                        <h3 className="text-xs font-semibold flex items-center gap-1.5 text-foreground mb-1.5 shrink-0">
                                            <List className="h-3.5 w-3.5 text-primary" />
                                            Themes
                                        </h3>
                                        <div className="bg-background/50 p-2 rounded-xl border flex-1 overflow-hidden relative">
                                            {document.context && document.context.length > 0 ? (
                                                <div className="flex flex-wrap gap-1.5 content-start h-full overflow-hidden">
                                                    {document.context.slice(0, 6).map((kw: { text: string; score: number } | string, i: number) => (
                                                        <Badge
                                                            key={i}
                                                            variant="secondary"
                                                            className="bg-muted/50 hover:bg-muted font-normal text-[10px] sm:text-xs border px-1.5 py-0 h-5"
                                                        >
                                                            {typeof kw === 'string' ? kw : kw.text}
                                                        </Badge>
                                                    ))}
                                                    {document.context.length > 6 && (
                                                        <span className="text-[10px] text-muted-foreground self-center">+{document.context.length - 6} more</span>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-muted-foreground text-[10px] italic">No themes</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Sentiment - Compact */}
                                    <div className="flex flex-col min-h-0">
                                        <h3 className="text-xs font-semibold flex items-center gap-1.5 text-foreground mb-1.5 shrink-0">
                                            <Database className="h-3.5 w-3.5 text-primary" />
                                            Sentiment
                                        </h3>
                                        <div className="bg-background/50 p-2 rounded-xl border flex-1 flex flex-col justify-center gap-2">
                                            {document.sentiment ? (
                                                <>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-muted-foreground">Tone</span>
                                                        <Badge variant="outline" className={`text-[10px] h-5 px-1.5 ${getSentimentColor(document.sentiment.label)}`}>
                                                            {document.sentiment.label}
                                                        </Badge>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="flex justify-between text-[10px] text-muted-foreground">
                                                            <span>Confidence</span>
                                                            <span className="font-mono">{(document.sentiment.score * 100).toFixed(1)}%</span>
                                                        </div>
                                                        <div className="h-1.5 w-full bg-muted rounded-full">
                                                            <div
                                                                className={`h-full rounded-full ${document.sentiment.label === 'POSITIVE' ? 'bg-green-500' : document.sentiment.label === 'NEGATIVE' ? 'bg-red-500' : 'bg-gray-500'}`}
                                                                style={{ width: `${document.sentiment.score * 100}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="text-center text-[10px] text-muted-foreground italic">N/A</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Meta - Compact */}
                            <div className="bg-muted/30 px-4 py-3 border-t flex items-center justify-between gap-3 text-[10px] sm:text-xs text-muted-foreground shrink-0 mt-auto">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="h-3 w-3" />
                                    <span>{new Date(document.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="font-mono opacity-60">
                                    ID: {documentId?.substring(0, 8)}...
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                            <Database className="h-8 w-8 opacity-20 mb-2" />
                            <span className="text-sm">Document not found</span>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
