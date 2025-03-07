import { prismaClient } from "../../packages/db";
import express from 'express'
import cors from "cors"
import { authMiddleware } from "./middleware";

const app  =express()
app.use(express.json())
app.use(cors())

app.post('/project',authMiddleware,async(req,res)=>{
    const prompt = req.body
    const description = prompt.split("\n")[0]
const userId = req.userId!
    const project = await prismaClient.project.create({
      data:{description, userId}  
    })
    res.json({projectId:project.id})
})

app.get('/projects',authMiddleware,async(req,res)=>{
const userId = req.userId!
const project = await prismaClient.project.findFirst({
    where:{userId}
})
res.json(project)
})

app.listen(3000,()=>{
    console.log("running on port 3000")
})