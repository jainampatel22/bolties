import { prismaClient } from "../../packages/db/index.ts";
import { access, mkdir, writeFile } from 'fs/promises';
import { spawnSync } from 'child_process';
import path from 'path';
import { constants } from 'fs';

// Define as a directory path
const BASE_WORKER_DIR = process.env.BASE_WORKER_DIR || "/tmp/bolty-worker";

// Ensure the directory exists before using it
async function ensureDirectoryExists(dirPath: string) {
  try {
    // Check if the directory exists
    await access(dirPath, constants.F_OK);
    console.log(`Directory exists: ${dirPath}`);
  } catch (error) {
    // If directory does not exist, create it
    await mkdir(dirPath, { recursive: true });
    console.log(`Directory created: ${dirPath}`);
  }
}

// Initialize the directory when the module loads
ensureDirectoryExists(BASE_WORKER_DIR);

export async function onFileUpdate(filePath: string, fileContent: string, projectId: string, promptId: string, type: "NEXTJS" | "REACT_NATIVE" | "REACT") {
  console.log(`Writing file: ${filePath}`);
  
  // Ensure the directory structure exists
  const fullPath = path.join(BASE_WORKER_DIR, filePath);
  const dirName = path.dirname(fullPath);
  
  await ensureDirectoryExists(dirName);
  
  // Now write the file
 try {
    await writeFile(fullPath, fileContent, 'utf-8');
    console.log(`Successfully wrote to ${fullPath}`);
} catch (error) {
    console.error(`Error writing to ${fullPath}:`, error);
}

}

export async function onShellCommand(shellCommand: string, projectId: string) {
  const commands = shellCommand.split("&&");
  
  for (const command of commands) {
    console.log(`Running command: ${command}`);
    
    try {
      const result = spawnSync(command.trim().split(' ')[0], command.trim().split(' ').slice(1), {
        cwd: BASE_WORKER_DIR,
        encoding: 'utf-8',
        shell: true,
      });
      
      console.log("STDOUT:", result.stdout);
      
      if (result.stderr) {
        console.log("STDERR:", result.stderr);
      }
     
    } catch (error) {
      console.error(`Error executing command ${command}:`, error);
    }
  }
}

export async function onPromptStart(promptId: string) {
  console.log(`Prompt started: ${promptId}`);
  // Additional logic here as needed
}

export async function onPromptEnd(promptId: string) {
  console.log(`Prompt ended: ${promptId}`);
  // Additional logic here as needed
}