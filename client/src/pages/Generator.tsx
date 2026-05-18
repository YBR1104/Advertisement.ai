import React, { useState } from "react";
import UploadZone from "./UploadZone";
import { Loader2Icon, RectangleHorizontalIcon, RectangleVerticalIcon, Wand2Icon } from "lucide-react";
import { PrimaryButton } from "../components/Buttons";
import { useAuth, useUser } from "@clerk/react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../configs/axios";

const Generator = () => {
    const { user} = useUser()
    const {getToken} = useAuth()
    const navigate = useNavigate()
    const [name, setName] = useState("")
    const [productName, setProductName] = useState("")
    const [productDescription, setProductDescription] = useState("")
    const [aspectRatio, setAspectRatio] = useState("9:16")
    const [productImage, setProductImage] = useState<File | null>(null)
    const [modelImage, setModelImage] = useState<File | null>(null)
    const [userPrompt, setUserPrompt] = useState("")
    const [isGenerating, setIsGenerating] = useState(false)

    const handleFileChange =(e: React.ChangeEvent<HTMLInputElement>, type: 'product' | 'model') => {
        if(e.target.files &&  e.target.files[0]) {
        if(type === 'product') setProductImage(e.target.files[0]);
        else setModelImage(e.target.files[0]);
    }
}
    const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!user) return toast('Login to generate')
        if(!name || !productName || !aspectRatio)
            return toast('Fill all the required fields')
        try {
            setIsGenerating(true);
            const formData = new FormData();
            formData.append('name',name)
            formData.append('productName',productName)
            formData.append('productDescription',productDescription)
            formData.append('userPrompt',userPrompt)
            formData.append('aspectRatio',aspectRatio)
            if (productImage) formData.append('images', productImage)
            if (modelImage) formData.append('images', modelImage)

            const token = await getToken()
            const { data } = await api.post('/api/project/create',formData,{
                headers: {Authorization: `Bearer ${token}`}
            })
            toast.success(data.message)
            navigate('/result/' +  data.projectId)
        } catch (error: any) {
            setIsGenerating(false);
            toast.error(error?.response?.data?.message || error.message)
        }
    }

    return (
        <div className="mx-auto w-full max-w-[1500px] text-zinc-200">
            <div className="editor-panel mb-4 rounded-3xl p-5 sm:mb-6 sm:p-8">
                <p className="text-xs uppercase tracking-[0.2em] text-violet-300">AI Image Generator</p>
                <h2 className="mt-3 text-2xl font-semibold text-zinc-50 sm:text-3xl">Create in-context product visuals</h2>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-400 sm:text-base">
                    Upload product and model images, then describe your scene. The existing generation pipeline remains unchanged.
                </p>
            </div>

            <form onSubmit={handleGenerate} className="grid gap-4 sm:gap-6 lg:grid-cols-[1.6fr_1fr]">
                <section className="editor-panel rounded-3xl p-4 sm:p-8">
                    <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <label htmlFor="name" className="mb-2.5 block text-sm font-medium text-zinc-200">
                                Project Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Summer campaign launch"
                                required
                                className="w-full rounded-2xl border border-white/12 bg-[#1a1b25] p-3 text-sm text-zinc-100 outline-none transition focus:border-violet-400 focus-visible:ring-2 focus-visible:ring-violet-300/35 sm:p-3.5"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="productname" className="mb-2.5 block text-sm font-medium text-zinc-200">
                                Product Name
                            </label>
                            <input
                                type="text"
                                id="productname"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                placeholder="Aqua bottle"
                                required
                                className="w-full rounded-2xl border border-white/12 bg-[#1a1b25] p-3 text-sm text-zinc-100 outline-none transition focus:border-violet-400 focus-visible:ring-2 focus-visible:ring-violet-300/35 sm:p-3.5"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="productdescription" className="mb-2.5 block text-sm font-medium text-zinc-200">
                                Product Description <span className="text-xs text-zinc-500">(optional)</span>
                            </label>
                            <textarea
                                id="productdescription"
                                rows={4}
                                value={productDescription}
                                onChange={(e) => setProductDescription(e.target.value)}
                                placeholder="Describe material, look, and marketing vibe"
                                className="w-full resize-none rounded-2xl border border-white/12 bg-[#1a1b25] p-3 text-sm text-zinc-100 outline-none transition focus:border-violet-400 focus-visible:ring-2 focus-visible:ring-violet-300/35 sm:p-3.5"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="mb-2.5 block text-sm font-medium text-zinc-200">Aspect Ratio</label>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={() => setAspectRatio('9:16')}
                                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-3 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07070a] ${
                                        aspectRatio === '9:16'
                                            ? 'border-violet-400/65 bg-violet-500/15 text-violet-100'
                                            : 'border-white/12 bg-[#171821] text-zinc-300 hover:border-white/25'
                                    }`}
                                >
                                    <RectangleVerticalIcon className="size-5" />
                                    9:16
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setAspectRatio('16:9')}
                                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-3 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07070a] ${
                                        aspectRatio === '16:9'
                                            ? 'border-violet-400/65 bg-violet-500/15 text-violet-100'
                                            : 'border-white/12 bg-[#171821] text-zinc-300 hover:border-white/25'
                                    }`}
                                >
                                    <RectangleHorizontalIcon className="size-5" />
                                    16:9
                                </button>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="userPrompt" className="mb-2.5 block text-sm font-medium text-zinc-200">
                                User Prompt <span className="text-xs text-zinc-500">(optional)</span>
                            </label>
                            <textarea
                                id="userPrompt"
                                rows={4}
                                value={userPrompt}
                                onChange={(e) => setUserPrompt(e.target.value)}
                                placeholder="Add style direction, background mood, and camera framing"
                                className="w-full resize-none rounded-2xl border border-white/12 bg-[#1a1b25] p-3 text-sm text-zinc-100 outline-none transition focus:border-violet-400 focus-visible:ring-2 focus-visible:ring-violet-300/35 sm:p-3.5"
                            />
                        </div>
                    </div>

                    <div className="mt-6 border-t border-white/10 pt-6">
                        <PrimaryButton
                            disabled={isGenerating}
                            className="w-full justify-center rounded-full px-8 py-3.5 text-sm font-semibold"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2Icon className="size-5 animate-spin" />
                                    Generating Image
                                </>
                            ) : (
                                <>
                                    <Wand2Icon className="size-5" />
                                    Generate Image
                                </>
                            )}
                        </PrimaryButton>
                    </div>
                </section>

                <section className="editor-panel space-y-4 rounded-3xl p-4 sm:p-8">
                    <UploadZone
                        label="Product Image"
                        file={productImage}
                        onClear={() => {
                            setProductImage(null);
                        }}
                        onChange={(e) => handleFileChange(e, 'product')}
                    />
                    <UploadZone
                        label="Model Image"
                        file={modelImage}
                        onClear={() => {
                            setModelImage(null);
                        }}
                        onChange={(e) => handleFileChange(e, 'model')}
                    />

                    <div className="rounded-2xl border border-white/10 bg-[#171821] p-4 text-xs leading-relaxed text-zinc-400">
                        For best quality, upload sharp images with clear lighting and minimal background clutter.
                    </div>
                </section>
            </form>
        </div>
    );
}

export default Generator;
