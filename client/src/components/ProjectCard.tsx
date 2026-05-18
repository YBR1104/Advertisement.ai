import { useNavigate } from "react-router-dom"
import type { Project } from "../types"
import { useEffect, useRef, useState } from "react";
import { EllipsisIcon, ImageIcon, Loader2Icon, PlaySquareIcon, Share2Icon, Trash2Icon } from "lucide-react";
import { GhostButton, PrimaryButton } from "./Buttons";
import { useAuth } from "@clerk/react";
import api from "../configs/axios";
import toast from "react-hot-toast";

const ProjectCard = ({gen , setGenerations, forCommunity = false} : {gen: Project , setGenerations: React.Dispatch<React.SetStateAction<Project[]>>,forCommunity?:boolean}) => {
    const {getToken} = useAuth();
    const navigate = useNavigate();
    const [menuOpen , setMenuOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (!menuOpen) return;

        const closeOnOutsideClick = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };

        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setMenuOpen(false);
            }
        };

        window.addEventListener('mousedown', closeOnOutsideClick);
        window.addEventListener('keydown', closeOnEscape);

        return () => {
            window.removeEventListener('mousedown', closeOnOutsideClick);
            window.removeEventListener('keydown', closeOnEscape);
        };
    }, [menuOpen]);

    const handleDelete = async (id: string | undefined) => {
        if (!id) return;
        
        const confirm = window.confirm('Are you sure you want to delete this project');
        if(!confirm) return;
        try {
            const token = await getToken();
            const {data} = await api.delete(`/api/projects/${id}`,{
                headers: {Authorization: `Bearer ${token}` }
        })
        setGenerations((generations)=>generations.filter((gen)=>gen.id !== id));
        toast.success(data.message);
        } catch (error:any) {
            toast.error(error?.response?.data?.message || error.message);
            console.log(error)
        }
    }

    const handleShare = async () => {
        const shareUrl = gen.generatedImage || gen.generatedVideo;
        if (!shareUrl) return;

        try {
            if (navigator.share) {
                await navigator.share({
                    url: shareUrl,
                    title: gen.productName,
                    text: gen.productDescription,
                });
                return;
            }

            if (!navigator.clipboard) {
                toast.error('Sharing is not supported in this browser');
                return;
            }

            await navigator.clipboard.writeText(shareUrl);
            toast.success('Share link copied to clipboard');
        } catch (error: any) {
            if (error?.name === 'AbortError') return;
            toast.error('Unable to share this project');
        }
    }
    const togglePublish = async (projectId: string | undefined)=> {
       try {
            const token = await getToken();
            const {data} = await api.get(`/api/user/publish/${projectId}`,{
                headers: {Authorization: `Bearer ${token}` }
        })
        setGenerations((generations)=>generations.map((gen)=>gen.id ===
        projectId ? {...gen , isPublished: data.isPublished} : gen));
        toast.success(data.isPublished ? 'Project published': 'Project unpublished');
        } catch (error:any) {
            toast.error(error?.response?.data?.message || error.message);
            console.log(error)
        }
    }
    
    return (
        <div key={gen.id} className="mb-4 break-inside-avoid">
            <div className="group overflow-hidden rounded-2xl border border-white/12 bg-[#11111a]/95 shadow-[0_18px_45px_rgba(0,0,0,0.45)] transition hover:border-violet-400/35">
            {/* preview */}
            <div className={`${gen?.aspectRatio === '9:16' ? 'aspect-9/16':'aspect-video'} relative overflow-hidden`}>
                {gen.generatedImage && (
                    <img src={gen.generatedImage} alt={gen.productName} className={`absolute inset-0 w-full h-full object-cover transition duration-500 ${gen.generatedVideo ? 
                        'group-hover:opacity-0' :'group-hover:scale-105'
                    }`}/>

                )}
                {gen.generatedVideo && (
                    <video src={gen.generatedVideo} muted loop playsInline 
                    className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition duration-500"
                    onMouseEnter={(e) =>e.currentTarget.play()}
                    onMouseLeave={(e) => e.currentTarget.pause()}/>
                )}

                {(!gen?.generatedImage && !gen?.generatedVideo) && (
                    <div className="absolute inset-0 flex h-full w-full flex-col items-center justify-center bg-black/30 text-violet-200">
                        <Loader2Icon className="size-7 animate-spin"/>
                    </div>
                )}
                {/* status badges */}
                <div className="absolute left-3 top-3 flex gap-2 items-center">
                    {gen.isGenerating && (
                        <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-2 py-1 text-xs text-amber-200">Generating</span>
                    )}
                     {gen.isPublished && (
                        <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-200">Published</span>
                    )}
                </div>
                  {/* source images for my geneartions only */}
                  {!forCommunity && (
                    <div
                    ref={menuRef}
                    onMouseLeave={() => {setMenuOpen(false)}}
                    onBlur={(event) => {
                        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                            setMenuOpen(false);
                        }
                    }}
                    className="absolute right-3 top-3 sm:opacity-0 group-hover:opacity-100 transition">
                        <button
                            type="button"
                            aria-haspopup="menu"
                            aria-expanded={menuOpen}
                            aria-label="Open project actions"
                            onClick={() => setMenuOpen((prev) => !prev)}
                            className="ml-auto inline-flex size-7 items-center justify-center rounded-full border border-white/14 bg-[#0c0c12]/90 text-zinc-200 transition hover:border-violet-400/50 hover:text-violet-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07070a]"
                        >
                            <EllipsisIcon className="size-4"/>
                        </button>

                        <div className="flex w-40 flex-col items-end text-sm">
                            <ul role="menu" className={`z-10 mt-2 w-full overflow-hidden rounded-lg border border-white/15 bg-[#0c0c12] py-1 text-xs text-zinc-300 shadow-md ${menuOpen ? 'block':'hidden'}`}>
                                {gen.generatedImage && <a role="menuitem" href={gen.generatedImage} download className="flex cursor-pointer items-center gap-2 px-4 py-2 hover:bg-[#181921] focus-visible:outline-none focus-visible:bg-[#181921]"><ImageIcon size
                                = {14}/> Download Image</a>}
                                {gen.generatedVideo && <a role="menuitem" href={gen.generatedVideo} download className="flex cursor-pointer items-center gap-2 px-4 py-2 hover:bg-[#181921] focus-visible:outline-none focus-visible:bg-[#181921]"><PlaySquareIcon size
                                = {14}/> Download Video</a>}
                                {(gen.generatedImage || gen.generatedVideo) && <button
                                    onClick={handleShare} 
                                    role="menuitem"
                                    className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 hover:bg-[#181921] focus-visible:outline-none focus-visible:bg-[#181921]">
                                        <Share2Icon size={14}/> Share
                                    </button>}
                                    <button role="menuitem" onClick={()=> handleDelete(gen.id)} className="w-full cursor-pointer px-4 py-2 text-left text-rose-300 hover:bg-rose-500/15 focus-visible:outline-none focus-visible:bg-rose-500/15"><span className="flex items-center gap-2"><Trash2Icon size={14}/>Delete</span></button>
                            </ul>
                        </div>
                    </div>
                  )}

                {/* source images */}
                <div className="absolute right-3 bottom-3">
                    {gen.uploadedImages?.[0] && <img src={gen.uploadedImages[0]} alt="product" className="h-14 w-14 rounded-full border border-white object-cover shadow-md animate-float sm:h-16 sm:w-16" />}
                    {gen.uploadedImages?.[1] && <img src={gen.uploadedImages[1]} alt="model" className="-ml-7 h-14 w-14 rounded-full border border-white object-cover shadow-md animate-float sm:-ml-8 sm:h-16 sm:w-16" />}

                </div>
            </div>
            {/* details */}
            <div className="p-4"> 
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <h3 className="mb-1 text-lg font-medium text-zinc-100">{gen.productName}</h3>
                         <p className="text-sm text-zinc-400">Created: {new Date(gen.createdAt).toLocaleString()}</p>
                         {gen.updatedAt && (
                             <p className="mt-1 text-xs text-zinc-500">Updated: {new Date(gen.updatedAt).toLocaleString()}</p>
                            ) }
                    </div>
                    <div className="text-right">
                        <div className="mt-2 flex flex-col items-end gap-1">
                            <span className="rounded-full border border-white/12 bg-[#171821] px-2 py-1 text-xs text-zinc-300">Aspect: {gen.aspectRatio}</span>
                        </div>

                    </div>
                </div>
                {/* Product description */}
                {gen.productDescription && (
                    <div className="mt-3">
                        <p className="mb-1 text-xs text-zinc-500">Description</p>
                        <div className="break-words rounded-md bg-[#171821] p-2 text-sm text-zinc-300">{gen.productDescription}</div>
                        </div>
                )}
                {/*user prompt */}
                 {gen.userPrompt && (
                    <div className="mt-3">
                        <div className="text-xs text-zinc-400">{gen.userPrompt}</div>
                        </div>
                )}
                {/* buttons */}
                {!forCommunity && (
                    <div className="mt-4 grid grid-cols-2 gap-3">
                        <GhostButton className="justify-center rounded-full border-white/12 bg-[#171821] text-xs text-zinc-200 hover:border-violet-400/60 hover:text-violet-200" onClick={()=> {navigate(`/result/${gen.id}`); scrollTo(0,0)}}>View Details</GhostButton>
                    <PrimaryButton className="rounded-full" onClick={()=> togglePublish(gen.id)}>{gen.isPublished ? 'Unpublish' : 'Publish'}</PrimaryButton>
                    </div>
                )}
            </div>
        </div>
        </div>
    )
}
export default ProjectCard
