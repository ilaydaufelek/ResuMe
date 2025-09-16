import { SidebarItem } from "./sidebar-item"
import { ScrollArea } from "./ui/scroll-area"



export const Sidebar=()=>{
    return(
        <ScrollArea className="h-full" >
        <div className="h-full md:h-screen w-full px-4 flex flex-col " >
        <SidebarItem />
        </div>
        </ScrollArea>
    )
} 