import { Request , Response} from "express";
import * as Sentry from "@sentry/node";
import { prisma } from "../configs/prisma.js";

//Get user credits
export const getUserCredits = async (req: Request , res: Response) => {
    try{
        const {userId} = req.auth();
        if(!userId) {return res.status(401).json({message: 'Unauthorized'})}

        const user = await prisma.user.findUnique({
            where: {id: userId}
        })
        res.json({credits: user?.credits})

    }catch (error: any) {
        Sentry.captureException(error);
        res.status(500).json({message: error.code || error.message})
    }

}


// Get all user projects
export const getAllProjects = async (req: Request , res: Response) => {
    try{
        const {userId} =req.auth()
        const projects = await prisma.project.findMany({
            where: {userId},
            orderBy: {createdAt: 'desc'}
        })
        res.json({projects})

    }catch (error: any) {
        Sentry.captureException(error);
        res.status(500).json({message: error.code || error.message})
    }

}

// get project by id

export const getProjectById = async (req: Request , res: Response) => {
    try{
        console.log("Before query");
        const {userId} =req.auth();
        //const {projectId} = req.params;
         const projectId = String(req.params.projectId);
         console.log("projectId:", projectId);
        console.log("userId:", userId);
        const project = await prisma.project.findUnique({
            where: {id: projectId}
        })
        console.log("DB result:", project);
        if(!project) {return res.status(404).json({message: 'Project not  found'})}
        res.json({project})
    }catch (error: any) {
        Sentry.captureException(error);
        res.status(500).json({message: error.code || error.message})
    }

}

// publish or unpublish project
export const toggleProjectPublic = async (req: Request , res: Response) => {
    try{
        const {userId} =req.auth();
        const {projectId} = req.params;
    
        const project = await prisma.project.findUnique({
            where: {id: projectId, userId}
        })
        if(!project) {return res.status(404).json({message: 'Project not found'})}

        if(!project?.generatedImage && !project?.generatedVideo){
            return res.status(404).json({message: 'image or video is not generated'})
        }

        await prisma.project.update({
            where: {id: projectId},
            data: {isPublished: !project.isPublished}
        })
        res.json({isPublished:  !project.isPublished})
    }catch (error: any) {
        Sentry.captureException(error);
        res.status(500).json({message: error.code || error.message})
    }

}