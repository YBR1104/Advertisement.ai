import { useClerk } from '@clerk/react';
import { ArrowRightIcon, CircleIcon } from 'lucide-react';

export default function Home() {
    const { openSignIn, openSignUp } = useClerk();

    return (
        <div className="min-h-screen bg-[#07070a]">
            <div className="relative mx-auto flex min-h-screen max-w-[1700px] flex-col overflow-hidden border border-white/15 bg-[#07070a] shadow-[0_45px_120px_rgba(0,0,0,0.6)]">
                <header className="border-b border-white/10 bg-linear-to-b from-[#13131a] to-[#09090d] px-4 py-3 sm:px-6 sm:py-4">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 rounded-full border border-violet-400/40 bg-violet-500/10 px-3 py-1.5 text-xs font-medium text-violet-100 sm:text-sm">
                                <CircleIcon className="size-2.5 fill-current text-violet-300" />
                                Advertisement AI
                            </div>
                        </div>
                    </div>
                </header>

                <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-8 sm:px-8">
                    <div className="editor-dots pointer-events-none absolute inset-0 opacity-25" />
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_24%_12%,rgba(139,92,246,0.2),transparent_46%),radial-gradient(circle_at_82%_18%,rgba(99,102,241,0.16),transparent_44%)]" />

                    <div className="relative z-10 w-full max-w-2xl rounded-[28px] border border-violet-400/25 bg-[#11111a]/95 p-6 text-center shadow-[0_30px_70px_rgba(0,0,0,0.55)] sm:p-10">
                        <p className="text-xs uppercase tracking-[0.22em] text-violet-300">Workspace Locked</p>
                        <h1 className="mt-4 text-3xl font-semibold text-zinc-100 sm:text-4xl">Sign in to continue</h1>
                        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base">
                            The dashboard is ready. Authenticate to access Image Studio, Video Studio, Settings, and your account profile.
                        </p>

                        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <button
                                type="button"
                                onClick={() => openSignIn()}
                                className="inline-flex w-full items-center justify-center rounded-full border border-white/15 bg-[#171821] px-6 py-3 text-sm font-medium text-zinc-100 transition hover:border-violet-400/35 hover:text-violet-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07070a] sm:w-auto"
                            >
                                Sign in
                            </button>
                            <button
                                type="button"
                                onClick={() => openSignUp()}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-violet-300/35 bg-linear-to-r from-violet-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white transition hover:from-violet-400 hover:to-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07070a] sm:w-auto"
                            >
                                Create account
                                <ArrowRightIcon className="size-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
