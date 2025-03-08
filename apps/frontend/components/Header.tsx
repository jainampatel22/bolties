import { Button } from "./ui/button";
import {
    ClerkProvider,
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
  } from '@clerk/nextjs'
  
export default function Header(){
    return (
        <>
        <div className="border-b flex  justify-between">
<div className="text-3xl font-semibold p-4 ml-3">
    Bolties
</div>
<div className="p-4 mr-2">
<SignedOut>
  
    <SignInButton />
       
           
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
</div>
        </div>
        </>
    )
}