import { Request, Response } from "express";
import { verifyWebhook } from "@clerk/express/webhooks";
import { prisma } from "../configs/prisma.js";

const clerkWebhooks = async (req: Request , res: Response) =>{
    try {
        console.log("Webhook hit");
        const evt: any = await verifyWebhook(req)
        //Getting Data from requests
        const {data,type} = evt;

        switch (type) {
            case "user.created":{
                await prisma.user.create({
                    data: {
                        id: data.id,
                        email: data?.email_addresses[0]?.email_address,
                        name: data?.first_name + " " + data?.last_name,
                        image: data?.image_url,

                    }
                })
                break;
            }
             case "user.updated":{
                await prisma.user.update({
                    where: {
                        id: data.id
                    },
                    data: {
                        email: data?.email_addresses[0]?.email_address,
                        name: data?.first_name + " " + data?.last_name,
                        image: data?.image_url,

                    }
                })
                break;
            }
            case "user.deleted":{
                await prisma.user.delete({ where: { id: data.id }})
                break;
            }
            case "paymentAttempt.updated":{
                if((data.charge_type == "recurring" || data.charge_type === "checkout") && data.status ==="paid"){
                    const credits = {pro: 80 , elite: 240,}
                    const clerkUserId = data?.payer?.user_id;
                    const planId: keyof typeof credits = data?.subscription_items?.[0]?.plan?.slug;
                    console.log("User:", clerkUserId);
                    console.log("Plan:", planId);

                    if(planId !== "pro" && planId !=="elite"){
                        return res.status(400).json({message: "Invalid plan"})
                    }
                    console.log(planId)
                    await prisma.user.update({
                        where: {id: clerkUserId,},
                        data: {
                            credits: {increment: credits[planId]}
                        },
                       
                    });
                     console.log("Credits updated ✅");
                }
                break;
            }
                
            
        
            default:
                break;
        }
        return res.status(200).json({ message: "Webhook processed" });   
        //res.json({message: "Webhook Recieved: " +type})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}
export default clerkWebhooks