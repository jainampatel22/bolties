'use client'
import Image from "next/image";
import styles from "./page.module.css";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Prompt from "@/components/Prompt";
import TemplateButtons from "@/components/TemplateButtons";
import Sidebar from "@/components/Sidebar";
import { Menu,  Settings, User, Mail, Bell } from 'lucide-react';
import { useState } from "react";

export default function Home() {
  
  return (
    <>
    
       <div >
    <Header/> 
    <div className="flex">
   

      {/* Main Content */}
    
   

    
<div className="max-w-2xl mx-auto pt-32">
<div className="text-center font-bold text-5xl">
  What do you want to build?
</div>
<div className="text-md text-muted-foreground text-center pt-5">
Prompt , click generate and watch your app come to life.
</div>
<div className="pt-5">
<Prompt/>
</div>
<div className="max-w-2xl mx-auto pt-6 ">
  <TemplateButtons/>

</div>
</div>
</div> 
</div>


  
   
   </>

  );
}
