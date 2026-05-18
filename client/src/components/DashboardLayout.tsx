import { type ComponentType, useEffect, useMemo, useState } from 'react';
import {
    BotIcon,
    ClapperboardIcon,
    CreditCardIcon,
    LogOutIcon,
    MenuIcon,
    Settings2Icon,
    Share2Icon,
    UserCircle2Icon,
    XIcon,
} from 'lucide-react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, useClerk, useUser } from '@clerk/react';
import toast from 'react-hot-toast';
import api from '../configs/axios';

type NavItem = {
    label: string;
    to: string;
    icon: ComponentType<{ className?: string }>;
    match: string[];
};

const navItems: NavItem[] = [
    {
        label: 'Image Studio',
        to: '/dashboard/image',
        icon: BotIcon,
        match: ['/dashboard/image', '/generate', '/result/'],
    },
    {
        label: 'Video Studio',
        to: '/dashboard/video',
        icon: ClapperboardIcon,
        match: ['/dashboard/video', '/my-generation'],
    },
    {
        label: 'Settings',
        to: '/settings',
        icon: Settings2Icon,
        match: ['/settings', '/plan'],
    },
    {
        label: 'Profile',
        to: '/profile',
        icon: UserCircle2Icon,
        match: ['/profile'],
    },
];

function pageTitle(pathname: string) {
    if (pathname.startsWith('/dashboard/image') || pathname.startsWith('/generate')) {
        return 'AI Image Workspace';
    }
    if (pathname.startsWith('/dashboard/video') || pathname.startsWith('/my-generation')) {
        return 'AI Video Workspace';
    }
    if (pathname.startsWith('/result/')) {
        return 'Generation Result';
    }
    if (pathname.startsWith('/settings') || pathname.startsWith('/plan')) {
        return 'Workspace Settings';
    }
    if (pathname.startsWith('/profile')) {
        return 'User Profile';
    }
    return 'Dashboard';
}

export default function DashboardLayout() {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { user } = useUser();
    const { signOut } = useClerk();
    const { getToken } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [credits, setCredits] = useState(0);

    useEffect(() => {
        const fetchCredits = async () => {
            if (!user) return;
            try {
                const token = await getToken();
                const { data } = await api.get('/api/user/credits', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCredits(data.credits);
            } catch (error: any) {
                toast.error(error?.response?.data?.message || error.message);
            }
        };

        fetchCredits();
    }, [user, pathname, getToken]);

    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (!mobileOpen) return;

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setMobileOpen(false);
            }
        };

        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [mobileOpen]);

    const activeItem = useMemo(
        () => navItems.find((item) => item.match.some((segment) => pathname.startsWith(segment))),
        [pathname]
    );
    const title = useMemo(() => pageTitle(pathname), [pathname]);

    const sidebar = (
        <div className="flex h-full flex-col">
            <button
                type="button"
                className="mb-8 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-left transition hover:border-violet-400/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07070a]"
                onClick={() => navigate('/dashboard/image')}
            >
                <div className="flex size-10 items-center justify-center rounded-xl bg-linear-to-br from-violet-500/40 to-indigo-500/40 text-violet-200 shadow-[0_0_24px_rgba(139,92,246,0.45)]">
                    <BotIcon className="size-5" />
                </div>
                <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Creative Engine</p>
                    <h1 className="text-base font-semibold text-zinc-100">Advertisement AI</h1>
                </div>
            </button>

            <nav aria-label="Dashboard navigation" className="space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.match.some((segment) => pathname.startsWith(segment));

                    return (
                        <NavLink
                            key={item.label}
                            to={item.to}
                            className={`group flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07070a] ${
                                isActive
                                    ? 'border-violet-400/35 bg-violet-500/12 text-violet-100 shadow-[0_0_0_1px_rgba(167,139,250,0.25)]'
                                    : 'border-transparent text-zinc-300 hover:border-white/10 hover:bg-white/[0.03] hover:text-zinc-100'
                            }`}
                        >
                            <Icon className={`size-4.5 ${isActive ? 'text-violet-300' : 'text-zinc-500 group-hover:text-zinc-200'}`} />
                            <span>{item.label}</span>
                        </NavLink>
                    );
                })}
            </nav>

            <div className="mt-auto rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Workspace Usage</p>
                <div className="mt-3 flex items-center justify-between">
                    <p className="text-sm text-zinc-300">Credits Remaining</p>
                    <span className="rounded-full border border-violet-300/30 bg-violet-500/15 px-2.5 py-1 text-xs font-semibold text-violet-200">
                        {credits}
                    </span>
                </div>
                <button
                    type="button"
                    onClick={() => navigate('/plan')}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/12 bg-[#171821] px-3 py-2 text-sm font-medium text-zinc-200 transition hover:border-violet-400/40 hover:text-violet-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07070a]"
                >
                    <CreditCardIcon className="size-4" />
                    Manage Plan
                </button>
            </div>

            <button
                type="button"
                onClick={async () => {
                    await signOut();
                    navigate('/');
                }}
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-[#171821] px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-rose-400/40 hover:text-rose-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07070a]"
            >
                <LogOutIcon className="size-4" />
                Sign out
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#07070a] text-zinc-100">
            <a
                href="#dashboard-content"
                className="sr-only z-[70] rounded-lg bg-violet-300 px-3 py-2 text-sm font-semibold text-zinc-950 focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
            >
                Skip to content
            </a>

            <div className="mx-auto flex min-h-screen max-w-[1700px] flex-col overflow-hidden border border-white/15 bg-[#07070a] shadow-[0_45px_120px_rgba(0,0,0,0.6)]">
                <header className="border-b border-white/10 bg-linear-to-b from-[#13131a] to-[#09090d] px-4 py-3 sm:px-6 sm:py-4">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-4 overflow-hidden">
                            <div className="rounded-full border border-violet-400/35 bg-violet-500/12 px-3 py-1.5 text-xs font-medium text-violet-100 sm:px-4 sm:text-sm">
                                {activeItem?.label || title}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3">
                            <button
                                type="button"
                                onClick={() => navigate('/community')}
                                className="hidden items-center gap-2 rounded-full border border-white/15 bg-white px-4 py-2 text-xs font-semibold text-zinc-900 transition hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08080f] sm:inline-flex"
                            >
                                <Share2Icon className="size-3.5" />
                                Share
                            </button>
                            <img
                                src={user?.imageUrl}
                                alt={user?.fullName || 'profile'}
                                className="size-9 rounded-full border border-violet-400/55 object-cover shadow-[0_0_0_2px_rgba(139,92,246,0.25)]"
                            />
                        </div>
                    </div>
                </header>

                <div className="relative flex flex-1 overflow-hidden">
                    <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-linear-to-b from-[#14141b] to-[#101117] p-6 md:block">
                        {sidebar}
                    </aside>

                    <section className="relative flex min-w-0 flex-1 flex-col bg-[#07070b]">
                        <div className="editor-dots pointer-events-none absolute inset-0 opacity-20" />
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_20%_0%,rgba(139,92,246,0.18),transparent_48%)]" />

                        <header className="relative z-10 flex items-center justify-between border-b border-white/10 px-3 py-3 sm:px-5 sm:py-4">
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setMobileOpen(true)}
                                    aria-label="Open navigation"
                                    className="inline-flex size-9 items-center justify-center rounded-xl border border-white/15 bg-[#15161e] text-zinc-200 transition hover:border-violet-400/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07070a] md:hidden"
                                >
                                    <MenuIcon className="size-5" />
                                </button>

                                <div>
                                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Creative Workspace</p>
                                    <h2 className="text-base font-semibold text-zinc-100 sm:text-lg">{activeItem?.label || title}</h2>
                                </div>
                            </div>

                            <span className="rounded-full border border-violet-300/30 bg-violet-500/15 px-2.5 py-1 text-xs font-semibold text-violet-200 sm:px-3">
                                <span className="hidden sm:inline">Credits: </span>
                                {credits}
                            </span>
                        </header>

                        <main id="dashboard-content" className="relative z-10 flex-1 overflow-y-auto p-3 sm:p-5 lg:p-8">
                            <Outlet />
                        </main>
                    </section>
                </div>
            </div>

            {mobileOpen && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm md:hidden">
                    <aside className="h-full w-[88%] max-w-[340px] border-r border-white/10 bg-[#0c0d12] p-5">
                        <div className="mb-5 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setMobileOpen(false)}
                                aria-label="Close navigation"
                                className="inline-flex size-9 items-center justify-center rounded-xl border border-white/15 bg-[#15161e] text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07070a]"
                            >
                                <XIcon className="size-5" />
                            </button>
                        </div>
                        {sidebar}
                    </aside>
                </div>
            )}
        </div>
    );
}
