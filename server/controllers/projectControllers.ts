import { Request, Response } from "express";
import * as Sentry from "@sentry/node";
import { prisma } from "../configs/prisma.js";
import { v2 as cloudinary} from 'cloudinary';
import { GenerateContentConfig,HarmBlockThreshold,HarmCategory } from "@google/genai";
import fs from 'fs';
import path from 'path';
import ai from "../configs/ai.js";
import axios from "axios";

const loadImage =(path: string, mimeType: string) => {
    return {
        inlineData: {
            data: fs.readFileSync(path).toString('base64'),
            mimeType
        }
    }
}

const buildEnhancedVideoPrompt = ({
    intent,
    script,
    productName,
    productDescription,
}: {
    intent?: string,
    script?: string,
    productName?: string,
    productDescription?: string,
}) => {
    const cleanedIntent = String(intent || '').trim();
    const cleanedScript = String(script || '').trim();
    const cleanedProductName = String(productName || '').trim();
    const cleanedProductDescription = String(productDescription || '').trim();

    return `Create a high-quality, realistic marketing video.

Primary user intent:
${cleanedIntent || `Showcase ${cleanedProductName || 'the product'} in a premium ad style.`}

${cleanedScript ? `Script guidance (follow this structure closely):
${cleanedScript}
` : ''}

${cleanedProductName ? `Product name: ${cleanedProductName}` : ''}
${cleanedProductDescription ? `Product details: ${cleanedProductDescription}` : ''}

Enhance the user input by:
- Expanding it into coherent cinematic shots while preserving the original intent.
- Keeping motion natural, physically plausible, and commercially usable.
- Maintaining clean framing, smooth camera movement, and professional ad lighting.
- Avoiding unrelated objects, extra text overlays, logos, or visual noise unless requested.
`;
}

export const createProject = async (req: Request, res: Response) =>{
    let tempProjectId: string;
    const { userId } = req.auth();
    let isCrediedDeducted = false;
    const {name = 'New Project',aspectRatio,userPrompt,productName,productDescription,targetLength=5} = req.body;
    const images: any[] = Array.isArray(req.files) ? req.files : [];

    if(!productName || (images.length > 0 && images.length < 2)){
        return res.status(400).json({message: 'Upload 2 images or continue without images'})
    }

    const user = await prisma.user.findUnique({
        where: {id: userId}
    })

    if(!user || user.credits < 5){
        return res.status(401).json({message: 'Insufficient credits'})
    }else{
        // deduct credits for images generation
        await prisma.user.update({
            where: {id: userId},
            data: {credits: {decrement: 5}}
        }).then(()=>{isCrediedDeducted = true})
    }
    try {
        
        let uploadedImages = await Promise.all(
            images.map(async(items: any)=>{
                let result = await cloudinary.uploader.upload(items.path,
                    {resources_type: 'image'})
                    return result.secure_url
                
            })
        )

        const project = await prisma.project.create({
            data: {
                name,
                userId,
                productName,
                productDescription,
                userPrompt,
                aspectRatio,
                targetLength: parseInt(targetLength),
                isGenerating: true
            }
        })

        tempProjectId = project.id;

        const model = 'gemini-3-pro-image-preview';


        const generationConfig: GenerateContentConfig ={
            maxOutputTokens: 32768,
            temperature: 1,
            topP: 0.95,
            responseModalities: ['IMAGE'],
            imageConfig: {
                aspectRatio: aspectRatio || '9:16',
                imageSize: '1k'
            },
            safetySettings: [
                {
                    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                    threshold: HarmBlockThreshold.OFF,

                },
                {
                    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                    threshold: HarmBlockThreshold.OFF,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                    threshold: HarmBlockThreshold.OFF,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: HarmBlockThreshold.OFF,
                }

            ]

        }

        const hasReferenceImages = images.length >= 2;

        // image to base64 structure for ai model
        const referenceImages = hasReferenceImages
            ? [
                loadImage(images[0].path , images[0].mimetype),
                loadImage(images[1].path,images[1].mimetype)
            ]
            : [];

        const prompt ={
            text: `Create a realistic, high-quality ecommerce image.

            If a person/model is relevant or explicitly requested:
            - Naturally integrate a human model interacting with the product
            - Ensure realistic pose and interaction (holding, using, wearing, etc.)

            If no model is needed:
            - Focus only on the product with clean, professional presentation

            General requirements:
            - Match lighting, shadows, scale, and perspective accurately
            - Use professional studio lighting or suitable real-world lighting
            - Ensure photorealistic, ecommerce-quality output
            - Clean background (studio or context-appropriate)

            ${userPrompt}`
        }

        // Generate the image using the ai model
        const response: any = await ai.models.generateContent({
            model,
            contents: [...referenceImages,prompt],
            config: generationConfig
        })

        // check if the response is valid
        if(!response?.candidates?.[0]?.content?.parts){
            throw new Error('Unexpected response')
        }

        const parts = response.candidates[0].content.parts;
        let finalBuffer: Buffer | null = null

        for (const part of parts){
            if(part.inlineData){
                finalBuffer = Buffer.from(part.inlineData.data,'base64')
            }
        }
        if(!finalBuffer){
            throw new Error('Failed to generate image')
        }

        const base64Image = `data:image/png;base64,${finalBuffer.toString('base64')}`

        const uploadResult = await cloudinary.uploader.upload(base64Image, {resource_type: 'image'});
        
        await prisma.project.update({
            where: {id: project.id},
            data: {
                generatedImage: uploadResult.secure_url,
                isGenerating: false
            
        }})

        res.json({projectId: project.id})
    } catch (error: any ){
        if(tempProjectId!){
            //update project status and eror message
            await prisma.project.update({
                where: {id: tempProjectId},
                data: {isGenerating: false, error: error.message}
            })
        }

        if(isCrediedDeducted){
            // add credits back
            await prisma.user.update({
                where: {id: userId},
                data: {credits: {increment: 5}}
            })
        }
        Sentry.captureException(error);
        res.status(500).json({message: error.message})
        
    }
}

export const createVideo = async (req: Request, res: Response) =>{
    const {userId} = req.auth()
    const {
        projectId,
        name = 'Prompt Video',
        aspectRatio = '9:16',
        targetLength = 5,
        videoPrompt = '',
        videoScript = '',
    } = req.body;

    const textToVideoMode = !projectId;
    const parsedPrompt = String(videoPrompt || '').trim();
    const parsedScript = String(videoScript || '').trim();
    const promptInput = [parsedPrompt, parsedScript].filter(Boolean).join('. ');
    const videoCreditCost = 10;

    if(textToVideoMode && !promptInput){
        return res.status(400).json({message: 'Enter a prompt or script to generate video'});
    }

    let isCrediedDeducted = false;
    let activeProjectId = String(projectId || '');

    const user = await prisma.user.findUnique({
        where: {id: userId}
    })
    if(!user || user.credits < videoCreditCost){
        return res.status(401).json({message: 'Insufficient credits'});
    }

    // deduct credits for video generation
    await prisma.user.update({
        where: {id: userId},
        data: {credits: {decrement: videoCreditCost}}
    }).then(()=> {isCrediedDeducted = true})

    try {
        let prompt = promptInput;
        let finalAspectRatio = String(aspectRatio || '9:16');
        let imageConfig: {imageBytes: string, mimeType: string} | undefined;

            //    prompt = `make the person showcase the product which is ${project.productName} ${project.productDescription && `and Product Description: ${project.productDescription}`}`
            // finalAspectRatio = project?.aspectRatio || '9:16';

        if(textToVideoMode){
            prompt = buildEnhancedVideoPrompt({
                intent: parsedPrompt,
                script: parsedScript,
                productName: name,
                productDescription: parsedScript,
            });

            const createdProject = await prisma.project.create({
                data: {
                    name: String(name || 'Prompt Video'),
                    userId,
                    productName: String(name || 'Prompt Video'),
                    productDescription: parsedScript,
                    userPrompt: parsedPrompt,
                    aspectRatio: finalAspectRatio,
                    targetLength: parseInt(targetLength) || 5,
                    uploadedImages: [],
                    isGenerating: true,
                    isPublished: false,
                    error: ''
                }
            })

            activeProjectId = createdProject.id;
        }else{
            const project = await prisma.project.findUnique({
                where: {id: activeProjectId , userId},
            })

            if(!project || project.isGenerating){
                return res.status(404).json({message: 'Generation in progress'});
            }

            if(project.generatedVideo){
                return res.status(404).json({message: 'Video already generated'})
            }

            if(!project.generatedImage){
                throw new Error('Generated image not found')
            }

            await prisma.project.update({
                where: {id: activeProjectId},
                data: {isGenerating: true, error: ''}
            })

            prompt = buildEnhancedVideoPrompt({
                intent: project.userPrompt,
                script: project.productDescription,
                productName: project.productName,
                productDescription: project.productDescription,
            });
            finalAspectRatio = project?.aspectRatio || '9:16';


      
            const image = await axios.get(project.generatedImage,{responseType: 'arraybuffer'})
            const imageBytes: any = Buffer.from(image.data)
            const imageMimeType = image.headers['content-type'] || 'image/png'

            imageConfig = {
                imageBytes: imageBytes.toString('base64'),
                mimeType: imageMimeType,
            }
        }

        let operation: any = await ai.models.generateVideos({
            model: 'veo-3.1-generate-preview',
            prompt,
            ...(imageConfig ? {image: imageConfig} : {}),
            config: {
                aspectRatio: finalAspectRatio,
                numberOfVideos: 1,
                resolution: '720p'
            }
        })

        while (!operation.done){
            console.log('Waiting for video generation to complete...');
            await new Promise((resolve)=> setTimeout(resolve , 10000));
            operation = await ai.operations.getVideosOperation({
                operation: operation,
            })
        }

        const filename =`${userId}-${Date.now()}.mp4`
        const filePath = path.join('videos',filename)

        // Create the images directory if it doesnt exist
        fs.mkdirSync('videos',{recursive: true})

        if(!operation?.response?.generatedVideos?.[0]?.video){
            throw new Error(operation?.response?.raiMediaFilteredReasons?.[0] || 'Video generation failed')
        }

        // Download the video
        await ai.files.download({
            file: operation.response.generatedVideos[0].video,
            downloadPath: filePath
        })

        const uploadResult = await cloudinary.uploader.upload(filePath,{
            resource_type: 'video'

        });

        await prisma.project.update({
            where: {id: activeProjectId},
            data: {
                generatedVideo: uploadResult.secure_url,
                isGenerating: false,
                error: ''
            }
        })

        // remove video file from disk after upload
        fs.unlinkSync(filePath)
        res.json({message: 'Video generation completed',videoUrl: uploadResult.secure_url, projectId: activeProjectId})

    } catch (error: any ){
            if(activeProjectId){
                // update project status and error message
                await prisma.project.update({
                    where: {id: activeProjectId,userId},
                    data: {isGenerating: false, error: error.message}
                })
            }
        

        if(isCrediedDeducted){
            // add credits back
            await prisma.user.update({
                where: {id: userId},
                data: {credits: {increment: videoCreditCost}}
            })
        }
        Sentry.captureException(error);
        res.status(500).json({message: error.message})
        
    }
}

export const getAllPublishedProjects = async (req: Request, res: Response) =>{
    try {
        const projects = await prisma.project.findMany({
            where: {isPublished: true}
        })
        res.json({projects})
        
    } catch (error: any ){
        Sentry.captureException(error);
        res.status(500).json({message: error.message})
        
    }
}

export const deleteProject = async (req: Request, res: Response) =>{
    try {
        const { userId}= req.auth();
        const {projectId} = req.params;

        const project = await prisma.project.findUnique({
            where: {id: projectId, userId}
        })
        if (!project){
            return res.status(404).json({message: 'Project not found'})
        }
        await prisma.project.delete({
            where: {id: projectId}
        })

        res.json({message: 'Project deleted'})
    } catch (error: any ){
        Sentry.captureException(error);
        res.status(500).json({message: error.message})
        
    }
}
