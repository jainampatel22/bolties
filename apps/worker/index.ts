import express from "express";
import cors from "cors";
import {prismaClient} from '../../packages/db/index.ts';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ArtifactProcessor } from "./parser.ts";
import { onFileUpdate, onPromptEnd, onPromptStart, onShellCommand } from "./os.ts";
import { systemPrompt } from "./SystemPrompt.ts";

const app = express();

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI("AIzaSyCMWs71eRzTvky0kRtDEm-s2EQfiPAS5Po");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post('/prompt', async(req, res) => {
    const {prompt, projectId} = req.body;
    const project = await prismaClient.project.findUnique({
        where: {
          id: projectId
        }
    });
    
    if(!project) {
        res.status(404).json({error: "project not found."});
        return;
    }
    
    const promptdb = await prismaClient.prompt.create({
      data: {
        content: prompt,
        projectId,
        type: "USER"
      }  
    });
    
    const allPrompts = await prismaClient.prompt.findMany({
        where: {
          projectId,
        },
        orderBy: {
          createdAt: "asc",
        },
    });
    
    let artifactProcessor = new ArtifactProcessor("", 
        (filePath, fileContent) => onFileUpdate(filePath, fileContent, projectId, promptdb.id, project.type as "NEXTJS" | "REACT_NATIVE" | "REACT"), 
        (shellCommand) => onShellCommand
    );
    
    let artifact = "";
    onPromptStart(promptdb.id);

    try {
      // Convert system prompt to a user message with instructions instead
      const systemInstructions = systemPrompt(prompt.type);
      
      const chatHistory = [
        // Add system instructions as a separate "user" message at the beginning
        {
          role: "user",
          parts: [{ text: `Instructions for this conversation: ${systemInstructions}` }],
        },
        // Add the rest of the messages
        ...allPrompts.map((p: any) => ({
          role: p.type === "USER" ? "user" : "model",
          parts: [{ text: p.content }],
        })),
      ];
      
      let response = await model.generateContentStream({
        contents: chatHistory,
        generationConfig: {
          maxOutputTokens: 10000,
        },
      });
      
      for await (const chunk of response.stream) {
        const text = chunk.text();
        artifactProcessor.append(text);
        artifactProcessor.parse();
        artifact += text;
      }
      
      console.log("done!");
      await prismaClient.prompt.create({
        data: {
          content: artifact,
          projectId,
          type: "SYSTEM"
        }
      });
      
      await prismaClient.action.create({
        data: {
          content: "Done",
          projectId,
          promptId: promptdb.id
        }
      });
      
      onPromptEnd(promptdb.id);
      res.json({response: artifact});
    } catch (error:any) {
      console.error("Error:", error);
      res.status(500).json({ error: "Something went wrong", details: error.message });
    }
});

app.listen(9091, () => {
  console.log("Server is running on port 9091");
});