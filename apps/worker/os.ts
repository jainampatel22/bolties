import { prismaClient } from "../../packages/db";

function baseWorkerDir(type:"NEXTJS" | "REACT_NATIVE"){
if(type="NEXTJS"){
    return "/tmp/next-app"
}
return "tmp/mobile-app"
}

const ws = new WebSocket(process.env.WS_RELAYER_URL || "ws://ws-relayer:9093");

export async function onFileUpdate(filePath:string,fileContent:string,projectId:string,promptId:string,type:"NEXTJS"|"REACT_NATIVE") {
    await prismaClient.action.create({
        data:{
            projectId,
           promptId,
            content:`updated files ${filePath}`
        }
    })
    ws.send(JSON.stringify({
        event:"admin",
        data:{
            type:"updated-file",
            content:filePath,
            path:`${baseWorkerDir(type)}/${filePath}`
        }
    }))
}

export async function onShellCommand(shellCommand:string,projectId:string,promptId:string) {
    const commands = shellCommand.split("&&")
    for(const command of commands){
console.log(`running this command :${command}`)
ws.send(JSON.stringify({
    event:"admin",
    data:{
        type:"command",
        command:command
    }
}))
await prismaClient.action.create({
    data:{
        projectId,
        promptId,
        content:`run command ${command}`
    }
})

    }
}

export function onPromptStart(promptId: string) {
    ws.send(JSON.stringify({
        event: "admin",
        data: {
            type: "prompt-start"
        }
    }))

}

export function onPromptEnd(promptId: string) {
    ws.send(JSON.stringify({
        event: "admin",
        data: {
            type: "prompt-end"
        }
    }))
}