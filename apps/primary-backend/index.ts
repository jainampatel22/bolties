import {prismaClient} from '../../packages/db/index.ts'
import express from 'express'
import cors from "cors"
import { authMiddleware } from "./middleware.ts";
import './types.ts'
const app =express()
app.use(express.json())
app.use(cors())

app.post("/project", authMiddleware, async (req, res) => {
    const {prompt} = req.body;
    const userId = req.userId!;
    //TODO: add logic to get a useful name for the project from the prompt
    const description = prompt.split("\n")[0];
    const project = await prismaClient.project.create({
      data: { description, userId},
    });
    res.json({ projectId: project.id });
  });

app.get("/projects", authMiddleware, async (req, res) => {
    const userId = req.userId!;
    const projects = await prismaClient.project.findMany({
      where: { userId },
    });
    res.json({ projects });
  });

app.listen(3001,()=>{
    console.log("running on port 3001")
})