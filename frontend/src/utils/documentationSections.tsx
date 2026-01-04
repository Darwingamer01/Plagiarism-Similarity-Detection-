import { Book, Code, Shield } from 'lucide-react'

export const sections = [
    {
        id: 'getting-started',
        title: 'Getting Started',
        icon: <Book className="w-4 h-4" />,
        description: "Essential guides to get you up and running quickly.",
        items: [
            { id: 'introduction', label: 'Introduction', desc: "Overview of the platform capabilities." },
            { id: 'installation', label: 'Installation', desc: "Setup instructions for Node.js and Python." },
            { id: 'quick-start', label: 'Quick Start', desc: "Your first API call in 5 minutes." }
        ]
    },
    {
        id: 'core-concepts',
        title: 'Core Concepts',
        icon: <Shield className="w-4 h-4" />,
        description: "Deep dive into how our detection engine works.",
        items: [
            { id: 'plagiarism-detection', label: 'Plagiarism Detection', desc: "Understanding the similarity matching engine." },
            { id: 'ai-analysis', label: 'AI Analysis', desc: "How we detect machine-generated content." },
            { id: 'reports', label: 'Understanding Reports', desc: "Interpreting scoring and metrics." }
        ]
    },
    {
        id: 'api-reference',
        title: 'API Reference',
        icon: <Code className="w-4 h-4" />,
        description: "Detailed documentation for all API endpoints.",
        items: [
            { id: 'authentication', label: 'Authentication', desc: "Secure your requests with Bearer tokens." },
            { id: 'endpoints', label: 'Endpoints', desc: "Complete list of available resources." }
        ]
    }
]
