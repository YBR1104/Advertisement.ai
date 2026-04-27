import { useEffect, useState } from "react";
import type { Project } from "../types";
import { dummyGenerations } from "../assets/assets";
import { Loader2Icon } from "lucide-react";
import ProjectCard from "../components/ProjectCard";

const Community = () => {
    const[projects,setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)

    const fetchProjects = async () => {
        setTimeout(() => {
            setProjects(dummyGenerations);
            setLoading(false);
        },3000)
    }

    useEffect(()=>{
        fetchProjects()
    },[] )

        return loading ? (
        <div className="flex items-center justify-center min-h-screen">
            <Loader2Icon className='size-7 animate-spin text-sky-700'/>
        </div>
    ) : (
        <div className="my-28 min-h-screen p-6 text-gray-700 md:p-12">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12">
                    <h1 className="mb-4 text-3xl font-semibold text-gray-900 md:text-4xl">Community</h1>
                    <p className="text-gray-600">See what others are creating</p>
                </header>
                {/* projects list */}
               <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
                {projects.map((project)=>(
                    <ProjectCard key={project.id}  gen={project} setGenerations={setProjects} forCommunity={true}/>
                ))}
               </div>
                   
                
            </div>

        </div>
    )
}   
export default Community
