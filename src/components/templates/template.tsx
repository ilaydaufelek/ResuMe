'use client'
import { TemplateType, useTemplate } from "@/hooks/use-template-store"
import Image from "next/image"
import { ScrollArea } from "../ui/scroll-area"



const TemplatesMap=[
   {name:'kakuna',src:'/kakuna.jpg'},
   { name:'onyx',src:'/onyx.jpg'},
   { name:'bronzor',src:'/bronzor.jpg'}
]


export const TemplatePage=()=> {
    const {onOpen,isOpen,type}=useTemplate();


    
    return(
   <ScrollArea className="h-full">
     <div className="space-y-4 p-4  " >
        
        {TemplatesMap.map((t)=>(
         <Image 
         key={t.name}
         alt={t.name}
         onClick={()=>onOpen(t.name as TemplateType)}
         src={t.src} 
         width={250}
         height={260}
         className={`cursor-pointer transition ${
               type=== t.name
                ? "brightness-100"
                : "brightness-50 hover:brightness-100"
            }`}/>
        ))}
    </div>
   </ScrollArea>
    )
}
