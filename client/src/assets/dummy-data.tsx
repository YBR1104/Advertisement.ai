import { UploadIcon, VideoIcon, ZapIcon } from 'lucide-react';

export const featuresData = [
    {
        icon: <UploadIcon className="w-6 h-6" />,
        title: 'Smart upload',
        desc: 'Drag and drop your assests and let our AI analyze and optimize them for maximum impact with auto-optimize formats and size.'
    },
    {
        icon: <ZapIcon className="w-6 h-6" />,
        title:'Insant generation',
        desc: 'Optimize your content creation with our AI-powered image and video generation. Transform your text into stunning visuals in seconds, making it easier than ever to create captivating content for your brand.'
    },
    {
        icon: <VideoIcon className="w-6 h-6" />,
        title: 'Video Synthesis',
        desc: 'Bring your ideas to life with our AI-powered video synthesis. Create dynamic, engaging videos from simple text prompts, making content creation faster and more accessible than ever before.'
    }
];

export const plansData = [
    {
        id: 'starter',
        name: 'Starter',
        price: '$499',
        desc: 'Best for early-stage startups.',
        credits: 'One-time',
        features: [
            'Project discovery & planning',
            'UI/UX design',
            'Basic website development',
            '1 revision round',
            'Email support'
        ]
    },
    {
        id: 'pro',
        name: 'Growth',
        price: '$1,499',
        desc: 'Growing teams and businesses.',
        credits: 'Monthly',
        features: [
            'Everything in Starter',
            'Advanced UI/UX design',
            'Custom development',
            'Performance optimization',
            'Priority support'
        ],
        popular: true
    },
    {
        id: 'ultra',
        name: 'Scale',
        price: '$3,999',
        desc: 'For brands ready to scale fast.',
        credits: 'Custom',
        features: [
            'Everything in Growth',
            'Dedicated project manager',
            'Ongoing optimization',
            'Marketing & growth support',
            'Chat + Email support'
        ]
    }
];

export const faqData = [
    {
        question: 'How does the AI generation work?',
        answer: 'We leverage state-of-the-art diffusion models trained on millions of products images to blend your production into realastics scenes while preserving details.'
    },
    {
        question: 'Do I own the generated images?',
        answer: 'Yes - you receive full commercial rights to any images and videos generated on the platform. Use them for ads,ecommerce, social media and more without restrictions.'
    },
    {
        question: 'Can I cancel anytime?',
        answer: 'Yes - you can cancel from your dashboard. You will retain access to any generated content and assets even after cancellation, so you can continue using them without interruption.'
    },
    
    {
        question: 'What input formats do you support?',
        answer: 'We accept JPG,PNG AND WEBP. Outputs are hight-resolution PNGs and MP4 videos optimized for web use.'
    }
];

export const footerLinks = [
    {
        title: "Quick Links",
        links: [
            { name: "Home", url: "#" },
            { name: "Features", url: "#" },
            { name: "Pricing", url: "#" },
            { name: "FAQ", url: "#" }
        ]
    },
    {
        title: "Legal",
        links: [
            { name: "Privacy Policy", url: "#" },
            { name: "Terms of Service", url: "#" }
        ]
    },
    {
        title: "Connect",
        links: [
            { name: "Twitter", url: "#" },
            { name: "LinkedIn", url: "#" },
            { name: "GitHub", url: "#" }
        ]
    }
];