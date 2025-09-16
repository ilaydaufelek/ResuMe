import { useTemplate } from "@/hooks/use-template-store"
import Image from "next/image"
import { ScrollArea } from "../ui/scroll-area"

export const TemplatePage=()=> {
    const {onOpen}=useTemplate()
    return(
   <ScrollArea className="h-full">
     <div className="space-y-4 p-4  " >
        
        <Image
        onClick={()=>onOpen('kakuna')}
        className=" brightness-50 hover:brightness-100 transition cursor-pointer "
        alt="kakunacv"
        src='/kakuna.jpg'
        width={250}
        height={250}/>
    
       
        <Image
        onClick={()=>onOpen('onxy')}
        className=" brightness-50 hover:brightness-100 transition cursor-pointer "
        alt="onyxcv"
        src='/onyx.jpg'
        width={250}
        height={250}/>

           <Image
        onClick={()=>onOpen('bronzor')}
        className=" brightness-50 hover:brightness-100 transition cursor-pointer "
        alt="bronzor"
        src='/bronzor.jpg'
        width={250}
        height={250}/>
      
    </div>
   </ScrollArea>
    )
}
