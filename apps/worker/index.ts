import  express, { json } from "express";
import cors from "cors"
import {prismaClient} from '../../packages/db/index.ts'
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ArtifactProcessor } from "./parser.ts";
import { onFileUpdate,onPromptEnd,onPromptStart,onShellCommand } from "./os.ts";
import { systemPrompt } from "./SystemPrompt.ts";
const app = express()

app.use(cors())
app.use(express.json())



const genAI = new GoogleGenerativeAI("AIzaSyCMWs71eRzTvky0kRtDEm-s2EQfiPAS5Po")
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
    type:"USER"

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
let artifactProcessor = new ArtifactProcessor("",(filePath,fileContent)=>onFileUpdate(filePath,fileContent,projectId,promptdb.id,project.type as "NEXTJS" | "REACT_NATIVE" | "REACT"),(shellCommand)=>onShellCommand)
let artifact = ""
onPromptStart(promptdb.id);

try {
  let response =await model.generateContentStream({
    contents: [
      {
        role: "system",
        parts: [{ text: systemPrompt(prompt.type) }], // ✅ System message for Gemini
      },
      ...allPrompts.map((p: any) => ({
        role: p.type === "USER" ? "user" : "model",
        parts: [{ text: p.content }],
      })),
    ],
    generationConfig: {
      maxOutputTokens: 8000, // ✅ Equivalent to max_tokens in Claude
    },
  });
  for await (const chunk of response.stream) {
    const text = chunk.text(); // Extract text from the chunk
    artifactProcessor.append(text);
    artifactProcessor.parse();
    artifact += text;
  }
  console.log("done!");
  await prismaClient.prompt.create({
    data:{
      content:artifact,
      projectId,
      type:"SYSTEM"
    }
  })
  await prismaClient.action.create({
    data:{
      content:"Done",
      projectId,
      promptId:promptdb.id
    }
  })
  onPromptEnd(promptdb.id);
  res.json({response})
} catch (error) {
  
  console.error("Error:", error);
  res.status(500).json({ error: "Something went wrong" });
}
})

app.listen(9091, () => {
  console.log("Server is running on port 9091");
});