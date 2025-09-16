
import { PreviewPage } from "@/components/preview"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Toaster } from "@/components/ui/sonner"


const BuildPage=()=>{
  
   
    return(
        <div className=" h-full  md:h-screen w-full  p-8     bg-zinc-900   flex items-center justify-center "  >
         <div className=" w-full md:w-[800px] h-full " >
          <ScrollArea className="h-screen" >
          <div  className="w-full space-x-4 bg-white space-y-4 min-h-screen md:h-screen p-4  " >
            <PreviewPage /> 
            <Toaster/>
          </div>
          </ScrollArea>
        </div>
        </div>
    )
}

export default BuildPage 