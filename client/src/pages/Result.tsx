import { useEffect, useState } from "react"
import type { Project } from "../types"
import { ImageIcon, Loader2Icon, RefreshCwIcon, SparkleIcon, VideoIcon } from "lucide-react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { PrimaryButton } from "../components/Buttons"
import { useAuth, useUser } from "@clerk/react"
import api from "../configs/axios"
import toast from "react-hot-toast"


const Result = () => {
  const {projectId}= useParams()
  const {getToken} = useAuth()
  const { user , isLoaded} = useUser()
  const navigate = useNavigate()
  const [project,setProjectData] = useState<Project>({} as Project)
  const [loading, setLoading] = useState(true)
  const [isGenerating,setIsGenerating] = useState(false)

  const fetchProjectData = async () => {
    if(!projectId){
      console.log("projectId missing")
      return;
    }
   try {
    const token = await getToken()
    const {data} = await api.get(`/api/user/projects/${projectId}`,{
   
      headers: {Authorization: `Bearer ${token}`}
    })

    setProjectData(data.project)
    setIsGenerating(data.project.isGenerating)
    setLoading(false)
   } catch (error: any) {
    toast.error(error?.response?.data?.message || error.message);
    console.log(error);
    console.log("projectId:", projectId);
   }
    }
  
  const handleGeneratedVideo = async () => {
    setIsGenerating(true)
    try {
      const token = await getToken()
      const {data} = await api.post('/api/project/video',{projectId},{
        headers: {Authorization: `Bearer ${token}`}
      })
      setProjectData(prev => ({...prev , generatedVideo: data.videoUrl, isGenerating: false}))

      toast.success(data.message);
      setIsGenerating(false);
    }catch (error: any) {
    toast.error(error?.response?.data?.message || error.message);
    console.log(error);
    
      
    }
  }
  useEffect(()=>{
    if (user && !project.id){
      fetchProjectData()
    }else if(isLoaded && !user){
      navigate('/')
    }
  } ,[user])

  // Fetch project every 10 seconds
  useEffect(()=>{
    if (user && isGenerating){
      const interval = setInterval(()=>{
        fetchProjectData()
      },1000);
      return ()=> clearInterval(interval)
    }
  },[user, isGenerating])
  return loading ?(
      <div className="flex min-h-[60vh] w-full items-center justify-center" >
        <Loader2Icon className="size-9 animate-spin text-violet-300"/>
        </div>
  ):(
    <div className="mx-auto w-full max-w-[1500px] space-y-6 text-zinc-200">
      <header className="editor-panel rounded-3xl p-4 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-violet-300">Generation Output</p>
            <h1 className="mt-3 text-2xl font-semibold text-zinc-50 sm:text-3xl">Image and video workspace</h1>
          </div>
          <Link to="/dashboard/image" className="inline-flex items-center gap-2 rounded-full border border-violet-300/35 bg-violet-500/12 px-4 py-2 text-sm font-medium text-violet-200 transition hover:border-violet-300/70 hover:bg-violet-500/22 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07070a]">
            <RefreshCwIcon className="size-4"/>
            New Generation
          </Link>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="editor-panel rounded-3xl p-2.5 sm:p-4">
              <div className={`${project?.aspectRatio === '9:16' ? 'aspect-9/16' : 'aspect-video'} relative overflow-hidden rounded-2xl bg-[#11111a]`}>
                {project?.generatedVideo ? (
                  <video src={project.generatedVideo} controls autoPlay loop className="w-full h-full object-cover"/>
                ) : project?.generatedImage ? (
                  <img src={project.generatedImage} alt="Generated Result" className="w-full h-full object-cover"/>
                ) : (
                  <div className="flex h-full items-center justify-center px-6 text-center text-sm text-zinc-400">Your asset is being prepared. This panel will update automatically when generation completes.</div>
                )}
              </div>
            </div>
          </div>

         <div className="space-y-6">
                <div className="editor-panel rounded-3xl p-4 sm:p-6">
                  <h3 className="mb-4 text-lg font-semibold text-zinc-100">Asset Actions</h3>
                  <div className="flex flex-col gap-3">
                    <a
                      href={project.generatedImage}
                      download
                      aria-disabled={!project.generatedImage}
                      className={`inline-flex w-full items-center justify-center gap-2 rounded-full border px-4 py-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07070a] ${project.generatedImage ? 'border-white/14 bg-[#171821] text-zinc-200 hover:border-violet-400/60 hover:text-violet-200' : 'pointer-events-none border-white/10 bg-[#171821]/70 text-zinc-500'}`}
                    >
                        <ImageIcon className="size-4.5"/>
                        Download Image
                    </a>
                    <a
                      href={project.generatedVideo}
                      download
                      aria-disabled={!project.generatedVideo}
                      className={`inline-flex w-full items-center justify-center gap-2 rounded-full border px-4 py-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07070a] ${project.generatedVideo ? 'border-white/14 bg-[#171821] text-zinc-200 hover:border-violet-400/60 hover:text-violet-200' : 'pointer-events-none border-white/10 bg-[#171821]/70 text-zinc-500'}`}
                    >
                        <VideoIcon className="size-4.5"/>
                        Download Video
                    </a>
                  </div>
                  </div>
                
                 <div className="editor-panel relative overflow-hidden rounded-3xl p-4 sm:p-6">
                  <div className="absolute top-0 right-0 p-4 opacity-15">
                    <VideoIcon className="size-24"/>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-zinc-100">Video Generator</h3>
                  <p className="mb-6 text-sm text-zinc-400">Turn this static image into a dynamic video for your business</p>
                  {!project.generatedVideo ? (
                    <PrimaryButton onClick={handleGeneratedVideo} disabled={isGenerating} className="w-full justify-center py-3">
                      {isGenerating ? (
                        <>Generating Video...</>
                      ) : (
                      
                      <><SparkleIcon className="size-4"/> Generate Video </>
                      )}
                      </PrimaryButton>
                  ) :(
                    <div className="rounded-xl border border-violet-400/35 bg-violet-500/12 p-3 text-center text-sm font-medium text-violet-200">
                      Video Generated Successfully!
                    </div>
                  )
                }
                 </div>
        </div>
        </div>
    </div>
  )
}

export default Result
