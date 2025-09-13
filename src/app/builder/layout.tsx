import { Sidebar } from "@/components/sidebar"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { SheetTrigger,Sheet, SheetContent, SheetHeader, SheetTitle  } from "@/components/ui/sheet"
import { Menu} from "lucide-react"


const BuilderLayout = ({ children }: { children: React.ReactNode }) => {
  return (
   <div className="h-full md:h-screen w-full " >
    
      <Sheet >
      <SheetTrigger className="md:hidden inset-x-0 fixed top-2">
       <Menu className="w-4 h-4" />
        </SheetTrigger>
       <SheetHeader className="hidden" >
        <SheetTitle></SheetTitle>
       </SheetHeader>
        <SheetContent side="left" className="p-0 w-[350px]">
            <Sidebar />
          </SheetContent>
          </Sheet>
    
     <ResizablePanelGroup
      direction="horizontal"
      className=" h-full  md:h-screen w-full md:w-screen  border">
    
     
      <ResizablePanel 
      defaultSize={23} maxSize={28} minSize={14}
       className="hidden md:flex" >
        <div className="  md:flex h-full w-full md:h-screen min-w-[300px]  items-center  p-6  ">
         <Sidebar/>
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle className="hidden md:flex" />

      <ResizablePanel defaultSize={75}>
        <div className="h-screen  ">
         {children}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
   </div>
  )
}

export default BuilderLayout
