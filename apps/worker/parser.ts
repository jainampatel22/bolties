import {exec} from 'child_process'
export class ArtifactProcessor {
    public currentArtifact: string;
    private onFileContent: (filepath: string, fileContent: string) => void;
    private onShellCommand: (shellCommand: string) => void;
  
    constructor(
      currentArtifact: string,
      onFileContent: (filepath: string, fileContent: string) => void,
      onShellCommand: (shellCommand: string) => void
    ) {
      this.currentArtifact = currentArtifact;
      this.onFileContent = onFileContent;
      this.onShellCommand = onShellCommand;
    }
  
    append(newContent: string) {
      this.currentArtifact += newContent;
      console.log("Current artifact length:", this.currentArtifact.length);
    }
  
    parse() {
      try {
        // Log the first 100 chars to help with debugging
        if (this.currentArtifact.length > 0) {
          console.log("Artifact preview:", this.currentArtifact.substring(0, Math.min(100, this.currentArtifact.length)));
        }
  
        // For shell commands
        this.parseShellCommands();
        
        // For file updates
        this.parseFileUpdates();
        
      } catch (error) {
        console.error("Error parsing artifact:", error);
      }
    }
  
    private parseShellCommands() {
      // Match <boltAction type = "shell"> ... </boltAction>
      const shellRegex = /<boltAction\s+type\s*=\s*["']shell["']\s*>([\s\S]*?)<\/boltAction>/g;
      let match;
  
      while ((match = shellRegex.exec(this.currentArtifact)) !== null) {
        const fullMatch = match[0];
        const shellCommand = match[1].trim();
        
        console.log("Found shell command:", shellCommand);
        
        // Process the shell command
        exec(shellCommand, (error, stdout, stderr) => {
            if (error) {
              console.error(`Error executing shell command: ${error.message}`);
              return;
            }
            if (stderr) {
              console.error(`Shell command stderr: ${stderr}`);
            }
            console.log(`Shell command output: ${stdout}`);
          });
        
        // Remove the processed part from the artifact
        this.currentArtifact = this.currentArtifact.replace(fullMatch, "");
      }
    }
  
    private parseFileUpdates() {
      // Match <boltAction type = "file" filepath="..."> ... </boltAction>
      const fileRegex = /<boltAction\s+type\s*=\s*["']file["']\s+filepath\s*=\s*["'](.*?)["']\s*>([\s\S]*?)<\/boltAction>/g;

      let match;
  
      while ((match = fileRegex.exec(this.currentArtifact)) !== null) {
        const fullMatch = match[0];
        const filePath = match[1];
        const fileContent = match[2].trim();
        
        console.log("Found file update for path:", filePath);
        
        // Process the file update
        console.log("Processing file update:", { filePath, fileContent });
        console.log("Extracted file content:", fileContent);

        this.onFileContent(filePath, fileContent);
        
        // Remove the processed part from the artifact
        this.currentArtifact = this.currentArtifact.replace(fullMatch, "");
      }
    }
  }