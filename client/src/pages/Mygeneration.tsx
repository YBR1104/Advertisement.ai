
import {useEffect, useState } from "react"
import type { Project } from "../types"
import { Loader2Icon } from "lucide-react"
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
      const[generations,setGenerations] = useState<Project[]>([])
      const [loading, setLoading] = useState(true)
  
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
  return loading ? (
    <div className="flex items-center justify-center min-h-screen">
            <Loader2Icon className='size-7 animate-spin text-sky-700'/>
        </div>
  ) : (
    <div className="my-28 min-h-screen p-6 text-gray-700 md:p-12">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12">
                    <h1 className="mb-4 text-3xl font-semibold text-gray-900 md:text-4xl">My Genrations</h1>
                    <p className="text-gray-600">View and manage your AI-generated content</p>
                </header>
                {/* generation list */}
               <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
                {generations.map((gen)=>(
                    <ProjectCard key={gen.id}  gen={gen} setGenerations={setGenerations}/>
                ))}
               </div>

               {generations.length === 0 && (
                <div className="rounded-xl border border-gray-900/10 bg-white py-20 text-center shadow-[0_12px_30px_rgba(2,6,23,0.07)]"> 
                  <h3 className="mb-2 text-xl font-medium text-gray-900">No generations yet</h3>
                  <p className="mb-6 text-gray-600">Start creating stunning product images today</p>
                  <PrimaryButton onClick={()=>window.location.href='/generate'}>Create New Generation</PrimaryButton>
                </div>
               )}
                   
                
            </div>

        </div>
  
  
        
  )
}


export default Mygeneration
