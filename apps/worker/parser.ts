export class ArtifactProcessor{

    public currentArtifact:string;
    private onFileContent:(filepath:string,fileContent:string)=>void
    private onShellCommand:(shellCommand:string)=>void;

    constructor(currentArtifact:string,onFileContent:(filepath:string,fileContent:string)=>void,onShellCommand:(shellCommand:string)=>void){
    this.currentArtifact=currentArtifact,
    this.onFileContent=onFileContent,
    this.onShellCommand=onShellCommand
}
append(currentArtifact:string){
    this.currentArtifact+=currentArtifact
}
parse(){
    const latestActionStart = this.currentArtifact.split("\n").findIndex((line)=>line.includes("<boltAction type ="));
    const latestActionEnd = this.currentArtifact.split("\n").findIndex((line)=>line.includes("</boltAction type ="))  ?? (this.currentArtifact.split("\n").length - 1);
    
    if(latestActionStart == -1){
        return
    }
const latestActionType = this.currentArtifact.split("\n")[latestActionStart].split("type=")[1].split(">")[0]
const latestActionContent = this.currentArtifact.split("\n").slice(latestActionStart,latestActionEnd+1).join('\n')

try {
    if(latestActionType=="\"shell\""){
        let shellCommand = latestActionContent.split('\n').slice(1).join('\n')
        if (shellCommand.includes("</boltAction>")){
            shellCommand= shellCommand.split("</boltAction>")[0]
            this.currentArtifact= this.currentArtifact.split(latestActionContent)[1]
            this.onShellCommand(shellCommand)
        }
    }  else if (latestActionType === "\"file\""){
        const filePath  =this.currentArtifact.split("\n")[latestActionStart].split("filepath=")[1].split(">")[0]
        let fileContent  =latestActionContent.split("\n").slice(1).join('\n')
        if (fileContent.includes("</boltAction>")){
            fileContent = fileContent.split("</boltAction>")[0];
            this.currentArtifact = this.currentArtifact.split(latestActionContent)[1];
            this.onFileContent(filePath.split("\"")[1], fileContent);
        }
    }
} catch (error) {
    
}
}
}