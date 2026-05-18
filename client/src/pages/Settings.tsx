import { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/react';
import { ArrowRightIcon, CreditCardIcon, FolderOpenIcon, SparklesIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../configs/axios';

export default function Settings() {
    const navigate = useNavigate();
    const { user } = useUser();
    const { getToken } = useAuth();
    const [credits, setCredits] = useState(0);

    useEffect(() => {
        const fetchCredits = async () => {
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

        if (user) {
            fetchCredits();
        }
    }, [getToken, user]);

    return (
        <div className="space-y-5">
            <section className="editor-panel rounded-3xl p-4 sm:p-8">
                <p className="text-xs uppercase tracking-[0.18em] text-violet-300">Workspace Settings</p>
                <h2 className="mt-3 text-2xl font-semibold text-zinc-50 sm:text-3xl">Account Controls</h2>
                <p className="mt-3 max-w-3xl text-sm text-zinc-400 sm:text-base">
                    Manage your subscription, monitor credits, and review your generation history in one place.
                </p>
            </section>

            <section className="grid gap-3 sm:gap-4 lg:grid-cols-3">
                <article className="editor-panel rounded-2xl p-4 sm:p-5">
                    <div className="inline-flex rounded-lg border border-violet-400/35 bg-violet-500/12 p-2 text-violet-200">
                        <SparklesIcon className="size-4" />
                    </div>
                    <p className="mt-4 text-sm text-zinc-400">Available credits</p>
                    <h3 className="mt-1 text-3xl font-semibold text-zinc-100">{credits}</h3>
                </article>

                <article className="editor-panel rounded-2xl p-4 sm:p-5">
                    <div className="inline-flex rounded-lg border border-violet-400/35 bg-violet-500/12 p-2 text-violet-200">
                        <CreditCardIcon className="size-4" />
                    </div>
                    <p className="mt-4 text-sm text-zinc-400">Subscription</p>
                    <h3 className="mt-1 text-xl font-semibold text-zinc-100">Manage plans</h3>
                    <button
                        type="button"
                        onClick={() => navigate('/plan')}
                        className="mt-4 inline-flex items-center gap-2 rounded-lg px-1 py-1 text-sm font-medium text-violet-200 transition hover:text-violet-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07070a]"
                    >
                        Open billing
                        <ArrowRightIcon className="size-4" />
                    </button>
                </article>

                <article className="editor-panel rounded-2xl p-4 sm:p-5">
                    <div className="inline-flex rounded-lg border border-violet-400/35 bg-violet-500/12 p-2 text-violet-200">
                        <FolderOpenIcon className="size-4" />
                    </div>
                    <p className="mt-4 text-sm text-zinc-400">Generated assets</p>
                    <h3 className="mt-1 text-xl font-semibold text-zinc-100">Video workspace</h3>
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard/video')}
                        className="mt-4 inline-flex items-center gap-2 rounded-lg px-1 py-1 text-sm font-medium text-violet-200 transition hover:text-violet-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07070a]"
                    >
                        Open workspace
                        <ArrowRightIcon className="size-4" />
                    </button>
                </article>
            </section>
        </div>
    );
}
