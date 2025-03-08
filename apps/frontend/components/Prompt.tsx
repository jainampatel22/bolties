'use client'
import { MoveUpRight } from "lucide-react"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea";
import axios from "axios";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { BACKEND_URL } from "@/config";

export default function Prompt(){
    const [prompt,setPrompt] =useState("")
    const {getToken} = useAuth()
     const onSubmit=async(e:React.FormEvent)=>{
        e.preventDefault();
        const token = await getToken();
       
        const response = await axios.post(`${BACKEND_URL}/project`, {
          prompt: prompt,
          
        }, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
     }
    return (
        <div>
<form onSubmit={(e) => onSubmit(e)}  className="relative w-full border-2 bg-gray-500/10 focus-within:outline-1 focus-within:outline-teal-300/30 rounded-xl">
<div className="p-2">
  <Textarea
  
    placeholder="Write your prompt here..."
   value={prompt}
    className="w-full placeholder:text-gray-400/60 bg-transparent border-none shadow-none text-md rounded-none focus-visible:ring-0 min-h-10 max-h-80 resize-none outline-none"
  onChange={(e)=>setPrompt(e.target.value)}
  />
</div>

<div className="p-2 flex items-center justify-end">
  <Button
    type="submit"
    className="h-10 w-10 cursor-pointer rounded-full bg-teal-200 border dark:bg-teal-200/10 hover:bg-teal-300/20 flex items-center justify-center"

 >
    <MoveUpRight className="w-10 h-10 text-teal-500 dark:text-teal-400/80" />
  </Button>
</div>
</form>
</div>
    )
}
