import { useEffect, useState } from "react"
import type { Project } from "../types"
import { ImageIcon, Loader2Icon, RefreshCwIcon, SparkleIcon, VideoIcon } from "lucide-react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { GhostButton, PrimaryButton } from "../components/Buttons"
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
      <div className="flex h-screen w-full items-center justify-center" >
        <Loader2Icon className="size-9 animate-spin text-sky-700"/>
        </div>
  ):(
    <div className="mt-20 min-h-screen p-6 text-gray-700 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-medium">Generation Result</h1>
          <Link to="/generate" className="btn-secondary text-sm flex items-center gap-2">
          <RefreshCwIcon className="w-4 h-4"/>
          <p className="max-sm:hidden">New Generation</p>
          </Link>
        </header>
        {/* grid layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Result Display */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel inline-block rounded-2xl p-2">
              <div className={`${project?.aspectRatio === '9:16' ? 'aspect-9/16' : 'aspect-video'} relative overflow-hidden rounded-xl bg-gray-100 sm:max-h-200`}>
                {project?.generatedVideo ? (
                  <video src={project.generatedVideo} controls autoPlay loop className="w-full h-full object-cover"/>
                ) : (
                  <img src={project.generatedImage} alt="Generated Result" className="w-full h-full object-cover"/>
                
                )}
              </div>
            </div>
          </div>
         {/*Sidebar Actions */}
         <div className="space-y-6">
          {/*Download buttons */}
                <div className="glass-panel rounded-2xl p-6">
                  <h3 className="text-xl font-semibold mb-4">Actions</h3>
                  <div className="flex flex-col gap-3">
                    <a href={project.generatedImage} download> 
                      <GhostButton disabled={!project.generatedImage}
                      className="w-full justify-center py-3">
                        <ImageIcon className="size-4.5"/>
                        Download Image
                      </GhostButton>
                    </a>
                    <a href={project.generatedVideo} download> 
                      <GhostButton disabled={!project.generatedVideo}
                      className="w-full justify-center py-3">
                        <VideoIcon className="size-4.5"/>
                        Download Video
                      </GhostButton>
                    </a>
                  </div>
                  </div>
                
          {/*generate video buttons */}
                 <div className="glass-panel relative overflow-hidden rounded-2xl p-6">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <VideoIcon className="size-24"/>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Video </h3>
                  <p className="mb-6 text-sm text-gray-600">Turn this static image into a dynamic video for your business</p>
                  {!project.generatedVideo ? (
                    <PrimaryButton onClick={handleGeneratedVideo} disabled={isGenerating} className="w-full">
                      {isGenerating ? (
                        <>Generating Video...</>
                      ) : (
                      
                      <><SparkleIcon className="size-4"/> Generate Video </>
                      )}
                      </PrimaryButton>
                  ) :(
                    <div className="rounded-xl border border-sky-300/60 bg-sky-50 p-3 text-center text-sm font-medium text-sky-800">
                      Video Generated Successfully!
                    </div>
                  )
                }
                 </div>
        </div>
        </div>
      </div>
    </div>
  )
}

export default Result
