import  express, { json } from "express";
import cors from "cors"
import {prismaClient} from '../../packages/db/index'
import { GoogleGenerativeAI } from "@google/generative-ai";


const app = express()

app.use(cors())
app.use(express.json())



const genAI = new GoogleGenerativeAI("AIzaSyCMWs71eRzTvky0kRtDEm-s2EQfiPAS5Po")
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post('/prompt',async(req,res)=>{
    const {prompt , projectId} = req.body
    const project = await prismaClient.prompt.findUnique({
        where:projectId
    })
    if(!project){
        res.status(404).json({error:"project not found."})
        return
    }
const promptdb = await prismaClient.prompt.create({
  data:{
    content:prompt,
    projectId,
    type:"User"

  }  
})
const allPrompts = await prismaClient.prompt.findMany({
    where: {
      projectId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

})

