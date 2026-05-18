import { Loader2Icon } from "lucide-react"
import { useEffect } from "react"


const Loading = () => {
  useEffect(()=>{
    setTimeout(() => {
      window.location.href ='/'

    },6000)
  },[])
  return (
      <div className="flex h-screen flex-col bg-slate-950">
        <div className="flex flex-1 items-center justify-center">
          <Loader2Icon className="size-7 animate-spin text-violet-300"/>
        </div>
        </div>
  )
}

export default Loading
