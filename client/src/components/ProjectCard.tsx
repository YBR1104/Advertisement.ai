import { useNavigate } from "react-router-dom"
import type { Project } from "../types"
import { useState } from "react";
import { EllipsisIcon, ImageIcon, Loader2Icon, PlaySquareIcon, Share2Icon, Trash2Icon } from "lucide-react";
import { GhostButton, PrimaryButton } from "./Buttons";
import { useAuth } from "@clerk/react";
import api from "../configs/axios";
import toast from "react-hot-toast";

const ProjectCard = ({gen , setGenerations, forCommunity = false} : {gen: Project , setGenerations: React.Dispatch<React.SetStateAction<Project[]>>,forCommunity?:boolean}) => {
    const {getToken} = useAuth();
    const navigate = useNavigate();
    const [menuOpen , setMenuOpen] = useState(false)
    const handleDelete = async (id: string | undefined) => {
        
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
            <div className="group overflow-hidden rounded-xl border border-gray-900/10 bg-white shadow-[0_14px_35px_rgba(2,6,23,0.08)] transition hover:border-sky-300/50">
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
                    onMouseLeave={(e) => e.currentTarget.pause}/>
                )}

                {(!gen?.generatedImage && !gen?.generatedVideo) && (
                    <div className="absolute inset-0 flex h-full w-full flex-col items-center justify-center bg-black/20">
                        <Loader2Icon className="size-7 animate-spin"/>
                    </div>
                )}
                {/* status badges */}
                <div className="absolute left-3 top-3 flex gap-2 items-center">
                    {gen.isGenerating && (
                        <span className="rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-700">Generating</span>
                    )}
                     {gen.isPublished && (
                        <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs text-emerald-700">Published</span>
                    )}
                </div>
                  {/* source images for my geneartions only */}
                  {!forCommunity && (
                    <div 
                    onMouseDownCapture={()=>{setMenuOpen(true)}}
                    onMouseLeave={()=> {setMenuOpen(false)}}
                    className="absolute right-3 top-3 sm:opacity-0 group-hover:opacity-100 transition flex items-center gap-2">
                        <div className="absolute top-3 right-3"> 
                            <EllipsisIcon className="ml-auto size-7 rounded-full border border-gray-900/12 bg-white/95 p-1 text-gray-700"/>
                        </div>
                        <div className="flex flex-col items-end w-32 text-sm">
                            <ul className={`z-10 mt-2 w-40 overflow-hidden rounded-lg border border-gray-900/12 bg-white py-1 text-xs text-gray-700 shadow-md ${menuOpen ? 'block':'hidden'}`}>
                                {gen.generatedImage && <a href="#" download className="flex gap-2 items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"><ImageIcon size
                                = {14}/> Download images</a>}
                                {gen.generatedVideo && <a href="#" download className="flex gap-2 items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"><PlaySquareIcon size
                                = {14}/> Download Video</a>}
                                {(gen.generatedImage || gen.generatedVideo) && <button
                                    onClick={()=> navigator.share({url: gen.generatedImage || gen.generatedVideo , title: gen.productName, text: gen.productDescription})} 
                                    className="w-full flex gap-2 items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                        <Share2Icon size={14}/> Share
                                    </button>}
                                    <button onClick={()=> handleDelete(gen.id)} className="w-full cursor-pointer px-4 py-2 text-left text-red-500 hover:bg-red-50"><span className="flex items-center gap-2"><Trash2Icon size={14}/>Delete</span></button>
                            </ul>
                        </div>
                    </div>
                  )}

                {/* source images */}
                <div className="absolute right-3 bottom-3">
                    <img src={gen.uploadedImages[0]} alt="product" className="h-16 w-16 rounded-full border border-white object-cover shadow-md animate-float" />
                    <img src={gen.uploadedImages[1]} alt="model" className="-ml-8 h-16 w-16 rounded-full border border-white object-cover shadow-md animate-float" />

                </div>
            </div>
            {/* details */}
            <div className="p-4"> 
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <h3 className="font-medium text-lg mb-1">{gen.productName}</h3>
                         <p className="text-sm text-gray-500">Created: {new Date(gen.createdAt).toLocaleString()}</p>
                         {gen.updatedAt && (
                             <p className="mt-1 text-xs text-gray-400">Updated: {new Date(gen.updatedAt).toLocaleString()}</p>
                            ) }
                    </div>
                    <div className="text-right">
                        <div className="mt-2 flex flex-col items-end gap-1">
                            <span className="rounded-full border border-gray-900/12 bg-gray-50 px-2 py-1 text-xs text-gray-600">Aspect: {gen.aspectRatio}</span>
                        </div>

                    </div>
                </div>
                {/* Product description */}
                {gen.productDescription && (
                    <div className="mt-3">
                        <p className="mb-1 text-xs text-gray-500">Description</p>
                        <div className="break-words rounded-md bg-gray-50 p-2 text-sm text-gray-600">{gen.productDescription}</div>
                        </div>
                )}
                {/*user prompt */}
                 {gen.userPrompt && (
                    <div className="mt-3">
                        <div className="text-xs text-gray-600">{gen.userPrompt}</div>
                        </div>
                )}
                {/* buttons */}
                {!forCommunity && (
                    <div className="mt-4 grid grid-cols-2 gap-3">
                        <GhostButton className="text-xs justify-center" onClick={()=> {navigate(`/result/${gen.id}`); scrollTo(0,0)}}>View Details</GhostButton>
                    <PrimaryButton onClick={()=> togglePublish(gen.id)}>{gen.isPublished ? 'Unpublish' : 'Publish'}</PrimaryButton>
                    </div>
                )}
            </div>
        </div>
        </div>
    )
}
export default ProjectCard
