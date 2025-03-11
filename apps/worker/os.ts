import { prismaClient } from "../../packages/db/index.ts";

function baseWorkerDir(type: "NEXTJS" | "REACT_NATIVE" | "REACT") {
    return type === "NEXTJS" ? "/tmp/next-app" : "tmp/mobile-app";
}

// Ensure WebSocket connection is open before sending
function getWebSocket(): Promise<WebSocket> {
    return new Promise((resolve) => {
        if (ws.readyState === WebSocket.OPEN) {
            resolve(ws);
        } else {
            ws.addEventListener(
                "open",
                () => resolve(ws),
                { once: true } // Run only once
            );
        }
    });
}

const ws = new WebSocket(process.env.WS_RELAYER_URL || "ws://ws-relayer:9091");

ws.onopen = () => {
    console.log("WebSocket connected.");
};

ws.onerror = (err) => {
    console.error("WebSocket Error:", err);
};

// 🟢 Ensure WebSocket is ready before sending
async function sendWebSocketMessage(message: object) {
    const socket = await getWebSocket();
    socket.send(JSON.stringify(message));
}

// 🟢 Fix: Ensure WebSocket is connected before sending
export async function onFileUpdate(filePath: string, fileContent: string, projectId: string, promptId: string, type: "NEXTJS" | "REACT_NATIVE" | "REACT") {
    await prismaClient.action.create({
        data: {
            projectId,
            promptId,
            content: `Updated file: ${filePath}`
        }
    });

    sendWebSocketMessage({
        event: "admin",
        data: {
            type: "updated-file",
            content: filePath,
            path: `${baseWorkerDir(type)}/${filePath}`
        }
    });
}

// 🟢 Fix: Ensure WebSocket is connected before sending
export async function onShellCommand(shellCommand: string, projectId: string, promptId: string) {
    const commands = shellCommand.split("&&");
    for (const command of commands) {
        console.log(`Running command: ${command}`);

        sendWebSocketMessage({
            event: "admin",
            data: {
                type: "command",
                command: command
            }
        });

        await prismaClient.action.create({
            data: {
                projectId,
                promptId,
                content: `Run command: ${command}`
            }
        });
    }
}

// 🟢 Fix: Ensure WebSocket is connected before sending
export async function onPromptStart(promptId: string) {
    sendWebSocketMessage({
        event: "admin",
        data: {
            type: "prompt-start"
        }
    });
}

// 🟢 Fix: Ensure WebSocket is connected before sending
export async function onPromptEnd(promptId: string) {
    sendWebSocketMessage({
        event: "admin",
        data: {
            type: "prompt-end"
        }
    });
}
