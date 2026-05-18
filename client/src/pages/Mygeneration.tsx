
import { type FormEvent, useEffect, useMemo, useState } from "react"
import type { Project } from "../types"
import { ClapperboardIcon, FileTextIcon, Loader2Icon, SparklesIcon, VideoIcon, Wand2Icon } from "lucide-react"
import ProjectCard from "../components/ProjectCard"
import { PrimaryButton } from "../components/Buttons"
import { useAuth, useUser } from "@clerk/react"
import { useNavigate } from "react-router-dom"
import api from "../configs/axios"
import toast from "react-hot-toast"
const Mygeneration = () => {
    const {user , isLoaded} = useUser()
    const { getToken} = useAuth()
    const navigate = useNavigate()
    const [generations,setGenerations] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [videoName, setVideoName] = useState('')
    const [videoPrompt, setVideoPrompt] = useState('')
    const [videoScript, setVideoScript] = useState('')
    const [videoAspectRatio, setVideoAspectRatio] = useState('9:16')
    const [isCreatingVideo, setIsCreatingVideo] = useState(false)
  
      const fetchGenerations = async () => {
       try {
        const token = await getToken();
        const {data} = await api.get('/api/user/projects',{
            headers: {Authorization: `Bearer ${token}`}
        
        })
        setGenerations(data.projects)
        setLoading(false)
       } catch (error: any) {
        toast.error(error?.response?.data?.message || error.message);
        console.log(error);
        
       }   
      }
  
      useEffect(()=>{
        if(user){
            fetchGenerations()
        }else if (isLoaded && !user){
            navigate('/')
        }

           
      },[user] )

  const createVideoFromPrompt = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if(!videoPrompt.trim() && !videoScript.trim()){
        return toast('Enter prompt or script to generate video');
    }

    try {
        setIsCreatingVideo(true);
        const token = await getToken();
        const { data } = await api.post('/api/project/video',{
            name: videoName || 'Prompt Video',
            videoPrompt,
            videoScript,
            aspectRatio: videoAspectRatio,
        },{
            headers: {Authorization: `Bearer ${token}`}
        })

        toast.success(data.message || 'Video generated successfully');
        setVideoName('');
        setVideoPrompt('');
        setVideoScript('');
        setVideoAspectRatio('9:16');
        await fetchGenerations();

        if(data.projectId){
            navigate(`/result/${data.projectId}`);
        }
    } catch (error: any) {
        toast.error(error?.response?.data?.message || error.message);
    } finally {
        setIsCreatingVideo(false);
    }
  }

  const videosReady = useMemo(
    () => generations.filter((item) => item.generatedVideo).length,
    [generations]
  )

  const videosPending = useMemo(
    () => generations.length - videosReady,
    [generations, videosReady]
  )

  return loading ? (
    <div className="flex min-h-[60vh] items-center justify-center">
            <Loader2Icon className='size-7 animate-spin text-violet-300'/>
        </div>
  ) : (
    <div className="space-y-6 text-zinc-200">
            <header className="editor-panel rounded-3xl p-4 sm:p-8">
                <p className="text-xs uppercase tracking-[0.2em] text-violet-300">Video Generator</p>
                <h1 className="mt-3 text-2xl font-semibold text-zinc-50 sm:text-3xl">Turn image generations into videos</h1>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-400 sm:text-base">
                    Select any project to open its result page and generate motion-ready video creatives.
                </p>
            </header>

            <section className="editor-panel rounded-3xl p-4 sm:p-6">
                <div className="mb-4 flex items-center gap-2 text-violet-200">
                    <FileTextIcon className="size-4" />
                    <p className="text-sm font-medium">Create video from prompt/script</p>
                </div>

                <form onSubmit={createVideoFromPrompt} className="grid gap-4 lg:grid-cols-2">
                    <div className="space-y-3 lg:col-span-2">
                        <label htmlFor="videoName" className="text-sm text-zinc-300">Video Name (optional)</label>
                        <input
                            id="videoName"
                            value={videoName}
                            onChange={(e)=>setVideoName(e.target.value)}
                            placeholder="Launch teaser"
                            className="w-full rounded-2xl border border-white/12 bg-[#1a1b25] p-3 text-sm text-zinc-100 outline-none transition focus:border-violet-400 focus-visible:ring-2 focus-visible:ring-violet-300/35"
                        />
                    </div>

                    <div className="space-y-3">
                        <label htmlFor="videoPrompt" className="text-sm text-zinc-300">Generation Prompt</label>
                        <textarea
                            id="videoPrompt"
                            rows={4}
                            value={videoPrompt}
                            onChange={(e)=>setVideoPrompt(e.target.value)}
                            placeholder="Create a cinematic ad shot for a premium perfume bottle at sunset."
                            className="w-full resize-none rounded-2xl border border-white/12 bg-[#1a1b25] p-3 text-sm text-zinc-100 outline-none transition focus:border-violet-400 focus-visible:ring-2 focus-visible:ring-violet-300/35"
                        />
                    </div>

                    <div className="space-y-3">
                        <label htmlFor="videoScript" className="text-sm text-zinc-300">Script (optional)</label>
                        <textarea
                            id="videoScript"
                            rows={4}
                            value={videoScript}
                            onChange={(e)=>setVideoScript(e.target.value)}
                            placeholder="Scene 1: close-up reveal. Scene 2: slow pan with product text overlay."
                            className="w-full resize-none rounded-2xl border border-white/12 bg-[#1a1b25] p-3 text-sm text-zinc-100 outline-none transition focus:border-violet-400 focus-visible:ring-2 focus-visible:ring-violet-300/35"
                        />
                    </div>

                    <div className="space-y-3">
                        <p className="text-sm text-zinc-300">Aspect Ratio</p>
                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={()=>setVideoAspectRatio('9:16')}
                                className={`rounded-full border px-4 py-2 text-sm transition ${videoAspectRatio === '9:16' ? 'border-violet-400/60 bg-violet-500/15 text-violet-100' : 'border-white/12 bg-[#171821] text-zinc-300 hover:border-white/25'}`}
                            >
                                9:16
                            </button>
                            <button
                                type="button"
                                onClick={()=>setVideoAspectRatio('16:9')}
                                className={`rounded-full border px-4 py-2 text-sm transition ${videoAspectRatio === '16:9' ? 'border-violet-400/60 bg-violet-500/15 text-violet-100' : 'border-white/12 bg-[#171821] text-zinc-300 hover:border-white/25'}`}
                            >
                                16:9
                            </button>
                        </div>
                    </div>

                    <div className="flex items-end lg:justify-end">
                        <PrimaryButton disabled={isCreatingVideo} className="w-full justify-center py-3 lg:w-auto lg:min-w-56">
                            {isCreatingVideo ? (
                                <>
                                    <Loader2Icon className="size-4 animate-spin"/>
                                    Generating Video
                                </>
                            ) : (
                                <>
                                    <Wand2Icon className="size-4"/>
                                    Generate From Prompt
                                </>
                            )}
                        </PrimaryButton>
                    </div>
                </form>
            </section>

            <section className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
                <article className="editor-panel rounded-2xl p-4 sm:p-5">
                    <div className="inline-flex rounded-lg border border-violet-400/35 bg-violet-500/12 p-2 text-violet-200">
                        <SparklesIcon className="size-4" />
                    </div>
                    <p className="mt-4 text-sm text-zinc-400">Total projects</p>
                    <h3 className="mt-1 text-3xl font-semibold text-zinc-100">{generations.length}</h3>
                </article>
                <article className="editor-panel rounded-2xl p-4 sm:p-5">
                    <div className="inline-flex rounded-lg border border-violet-400/35 bg-violet-500/12 p-2 text-violet-200">
                        <VideoIcon className="size-4" />
                    </div>
                    <p className="mt-4 text-sm text-zinc-400">Videos ready</p>
                    <h3 className="mt-1 text-3xl font-semibold text-zinc-100">{videosReady}</h3>
                </article>
                <article className="editor-panel rounded-2xl p-4 sm:col-span-2 sm:p-5 lg:col-span-1">
                    <div className="inline-flex rounded-lg border border-violet-400/35 bg-violet-500/12 p-2 text-violet-200">
                        <ClapperboardIcon className="size-4" />
                    </div>
                    <p className="mt-4 text-sm text-zinc-400">Video pending</p>
                    <h3 className="mt-1 text-3xl font-semibold text-zinc-100">{videosPending}</h3>
                </article>
            </section>

            <section className="editor-panel rounded-3xl p-4 sm:p-6">
               <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
                {generations.map((gen)=>(
                    <ProjectCard key={gen.id}  gen={gen} setGenerations={setGenerations}/>
                ))}
               </div>

               {generations.length === 0 && (
                <div className="rounded-2xl border border-dashed border-white/20 bg-[#171821]/70 py-20 text-center"> 
                  <h3 className="mb-2 text-xl font-medium text-zinc-100">No projects are ready for video yet</h3>
                  <p className="mx-auto mb-6 max-w-lg text-zinc-400">Start in AI Image Generator to create your first image project. As soon as an image is generated, it appears here for one-click video generation.</p>
                  <PrimaryButton onClick={()=>window.location.href='/dashboard/image'} className="px-7 py-3">Create New Generation</PrimaryButton>
                </div>
               )}
            </section>

        </div>
  
  
        
  )
}


export default Mygeneration
