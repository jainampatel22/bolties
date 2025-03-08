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
    const [isHovered, setIsHovered] = useState(false);
  
    const menuItems = [
      { icon: Home, label: 'Home' },
      { icon: User, label: 'Profile' },
      { icon: Mail, label: 'Messages' },
      { icon: Bell, label: 'Notifications' },
      { icon: Settings, label: 'Settings' },
    ];
  
  return (
    <>
    
       <div >
    <Header/> 
    <div className="flex">
   

      {/* Main Content */}
      <div className={`flex-1 ${isHovered ? 'ml-64' : 'ml-16'} p-8 transition-all duration-300`}>
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Welcome to Dashboard</h1>
          <p className="text-gray-600">
            Hover over the sidebar on the left to expand it. This is a responsive sidebar that
            smoothly transitions between collapsed and expanded states.
          </p>
        </div>
      </div>
   

    
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
