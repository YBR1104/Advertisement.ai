import { UploadIcon, XIcon } from "lucide-react"
import type { UploadZoneProps } from "../types"



const UploadZone = ({ label, file, onClear, onChange }: UploadZoneProps) => {
    return (
        <div className="group relative">
            <div className={`relative flex h-56 flex-col items-center justify-center rounded-2xl border border-dashed p-5 transition-all duration-300 sm:h-60 sm:p-6 ${file ? 'border-violet-400/65 bg-violet-500/12':'border-white/12 bg-[#171821] hover:border-violet-400/45 hover:bg-[#1a1b25]'}`}> 
            {file ? (
                <>
                    <img src={URL.createObjectURL(file)} alt="preview" className="absolute inset-0 h-full w-full rounded-xl object-cover opacity-75"/>
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 opacity-0 transition-opacity group-hover:opacity-100
                     rounded-xl backdrop-blur-sm"> 
                    <button type="button" onClick={onClear} className="rounded-full bg-[#0d0d14]/95 p-2 text-zinc-100 transition-colors hover:bg-rose-500/20 hover:text-rose-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07070a]
                     transition-colors"> <XIcon className="w-6 h-6"/></button>
                    </div>
                    <div className="absolute right-4 bottom-4 left-4 rounded-lg border border-white/12 bg-[#0d0d14]/80 p-3 backdrop-blur-md">
                    <p className="truncate text-sm font-medium text-zinc-100">{file.name}</p></div>
                </>
            ):(
                <>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-white/12 bg-[#0f1017] transition-transform duration-300 group-hover:scale-105">
                    <UploadIcon className="h-6 w-6 text-zinc-500 transition-colors group-hover:text-violet-300"/>
                    </div>
                    <h3 className="mb-2 text-base font-semibold text-zinc-100">{label}</h3>
                    <p className="max-w-[200px] text-center text-xs text-zinc-400">Drag and drop or click to upload</p>
                    <input type="file" accept="image/*" onChange={onChange} className="absolute inset-0 h-full w-full cursor-pointer rounded-2xl opacity-0 focus-visible:opacity-100 focus-visible:bg-[#07070a]/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-inset"/>
                    </>
            )}
           
            </div>
        </div>
    )
}

export default UploadZone
