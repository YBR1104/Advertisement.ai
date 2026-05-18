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
        <div className="flex min-h-[60vh] items-center justify-center">
            <Loader2Icon className='size-7 animate-spin text-violet-300'/>
        </div>
    ) : (
        <div className="space-y-6 text-zinc-200">
            <header className="editor-panel rounded-3xl p-4 sm:p-8">
                    <h1 className="mb-3 text-2xl font-semibold text-zinc-100 md:text-3xl">Community</h1>
                    <p className="text-zinc-400">See what others are creating</p>
                </header>

               <section className="editor-panel rounded-3xl p-4 sm:p-6">
                {projects.length > 0 ? (
                    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
                        {projects.map((project)=>(
                            <ProjectCard key={project.id}  gen={project} setGenerations={setProjects} forCommunity={true}/>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-white/20 bg-[#171821]/70 py-20 text-center">
                        <h3 className="mb-2 text-xl font-medium text-zinc-100">Community content is loading</h3>
                        <p className="mx-auto max-w-lg text-zinc-400">We are preparing the latest public generations. Please check back shortly.</p>
                    </div>
                )}
               </section>

        </div>
    )
}   
export default Community
