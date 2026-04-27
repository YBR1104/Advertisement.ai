import { UploadIcon, XIcon } from "lucide-react"
import type { UploadZoneProps } from "../types"



const UploadZone = ({ label, file, onClear, onChange }: UploadZoneProps) => {
    return (
        <div className="group relative">
            <div className={`relative flex h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-gray-50 p-6 transition-all duration-300 ${file ? 'border-sky-400 bg-sky-50':'border-gray-300/80 hover:border-sky-400 hover:bg-sky-50/70'}`}> 
            {file ? (
                <>
                    <img src={URL.createObjectURL(file)} alt="preview" className="absolute inset-0 h-full w-full rounded-xl object-cover opacity-65"/>
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/35 opacity-0 transition-opacity group-hover:opacity-100
                    rounded-xl backdrop-blur-sm"> 
                    <button type="button" onClick={onClear} className="rounded-full bg-white/90 p-2 text-gray-700 transition-colors hover:bg-red-50 hover:text-red-500
                    transition-colors"> <XIcon className="w-6 h-6"/></button>
                    </div>
                    <div className="absolute right-4 bottom-4 left-4 rounded-lg border border-gray-900/10 bg-white/90 p-3 backdrop-blur-md">
                    <p className="truncate text-sm font-medium text-gray-800">{file.name}</p></div>
                </>
            ):(
                <>
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-gray-300/80 bg-white transition-transform duration-300 group-hover:scale-110">
                    <UploadIcon className="h-8 w-8 text-gray-500 transition-colors group-hover:text-sky-700"/>
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">{label}</h3>
                    <p className="max-w-[200px] text-center text-sm text-gray-500">Drag & drop or click to upload</p>
                    <input type="file" accept="image/*" onChange={onChange} className="absolute inset-0 h-full w-full cursor-pointer opacity-0"/>
                    </>
            )}
           
            </div>
        </div>
    )
}

export default UploadZone
