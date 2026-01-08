import { Book, Code, Shield, FileText, Brain, BarChart } from 'lucide-react'

export const sections = [
    {
        id: 'getting-started',
        title: 'Getting Started',
        icon: <Book className="w-4 h-4" />,
        description: "Learn how to use the plagiarism detection system effectively.",
        items: [
            { id: 'introduction', label: 'Introduction', desc: "Overview of the platform and its capabilities." },
            { id: 'how-it-works', label: 'How It Works', desc: "Understanding the detection process step by step." },
            { id: 'quick-start', label: 'Quick Start Guide', desc: "Upload your first document and run a similarity check." }
        ]
    },
    {
        id: 'core-features',
        title: 'Core Features',
        icon: <Shield className="w-4 h-4" />,
        description: "Deep dive into the AI-powered detection capabilities.",
        items: [
            { id: 'similarity-detection', label: 'Similarity Detection', desc: "How we detect matching content using semantic analysis." },
            { id: 'ai-analysis', label: 'AI-Powered Analysis', desc: "Sentiment, context extraction, and summarization." },
            { id: 'scoring-system', label: 'Understanding Scores', desc: "How similarity scores are calculated and what they mean." }
        ]
    },
    {
        id: 'using-the-app',
        title: 'Using the App',
        icon: <FileText className="w-4 h-4" />,
        description: "Step-by-step guides for all features.",
        items: [
            { id: 'uploading-documents', label: 'Uploading Documents', desc: "Supported formats and how to index your documents." },
            { id: 'checking-similarity', label: 'Checking Similarity', desc: "How to run a plagiarism check on your content." },
            { id: 'reading-reports', label: 'Reading Reports', desc: "Understanding the detailed AI analysis reports." }
        ]
    }
]
