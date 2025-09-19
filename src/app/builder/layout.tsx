'use client'
import {z} from 'zod'
import { Sidebar } from "@/components/sidebar"
import { TemplatePage } from "@/components/templates/template"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { SheetTrigger,Sheet, SheetContent, SheetHeader, SheetTitle  } from "@/components/ui/sheet"
import {  PanelLeftOpen,  PanelRightOpen} from "lucide-react"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'


const formSchema = z.object({
  phone: z.string().optional(),
  fullname: z.string().optional() ,
  email: z.string().optional() ,
  location: z.string().optional(),
  website: z.string().optional(),
  summary: z.string().optional(), 
  experience: z.array(
    z.object({
      company:z.string().optional(),
      date:z.string().optional(),
    })
  ),
  languages: z.array(
   z.object({
    name:z.string().optional(),
    level:z.number().optional()
   })
  ),
  education:z.array(
    z.object({
      name:z.string().optional(),
      date:z.string().optional()
    })
  ),
  certifications: z.array(
    z.object({
      name:z.string().optional(),
      date:z.string().optional()
    })
  )  
    

})


const BuilderLayout = ({ children }: { children: React.ReactNode }) => {

  const [isLoaded,setIsLoaded]=useState(false)
  const{user}=useUser()

 const storedValues = typeof window !== 'undefined'
    ? localStorage.getItem('resume')
    : null
  
  const form = useForm<z.infer<typeof formSchema>>({
     resolver: zodResolver(formSchema),
     defaultValues:storedValues ? JSON.parse(storedValues): {
       phone: '',
       fullname: '', 
       email:'',
       location:'' ,
       website:'',
       summary:'',
       experience:[],
       languages:[],
       education:[],
       certifications:[],
     }
   }) 

   
   

    useEffect(() => {
    setIsLoaded(true)
  }, [])

  if (!isLoaded) return null


  return (
   <FormProvider {...form}>
  <div className="h-full md:h-screen w-full  " >
    
     <div className="flex items-center justify-between inset-x-0 fixed z-30 bg-zinc-900 text-white " >
       <div>
        <Sheet >
      <SheetTrigger className="md:hidden  ">
       <PanelLeftOpen className="w-4 h-4 m-2 " />
        </SheetTrigger>
       <SheetHeader className="hidden" >
        <SheetTitle></SheetTitle>
       </SheetHeader>
        <SheetContent side="left" className="p-0 w-[350px]">
            <Sidebar />
          </SheetContent>
          </Sheet>
      </div>
     <p className=' md:hidden flex items-center font-semibold' > {user?.fullName} CV</p>
          <div>
             <Sheet >
      <SheetTrigger className="md:hidden  ">
       <PanelRightOpen className="w-4 h-4 m-2 " />
        </SheetTrigger>
       <SheetHeader className="hidden" >
        <SheetTitle></SheetTitle>
       </SheetHeader>
        <SheetContent side="right" className="p-0 flex items-center justify-center w-[350px]">
            <TemplatePage />
          </SheetContent>
          </Sheet>
    
          </div>
     </div>
     <ResizablePanelGroup
      direction="horizontal"
      className=" h-full  md:h-screen w-full md:w-screen  border">
    
     
      <ResizablePanel 
      defaultSize={24} maxSize={28} minSize={14}
       className="hidden md:flex" >
        <div className="  md:flex h-full w-full md:h-screen min-w-[300px]  items-center  p-6  ">
         <Sidebar/>
       </div>
      </ResizablePanel>

      <ResizableHandle withHandle className="hidden md:flex" />

      <ResizablePanel defaultSize={75}>
        <div className="h-screen   ">
         {children}
        </div>
      </ResizablePanel>

    <ResizableHandle withHandle className="hidden md:flex" />
     
      
      <ResizablePanel 
      defaultSize={23} maxSize={28} minSize={14}
       className="hidden md:flex" >
        <div className="  flex h-full w-full md:h-screen min-w-[300px] justify-center items-center ">
         <TemplatePage/>
       </div>
      </ResizablePanel>
    </ResizablePanelGroup>
   </div>
   </FormProvider>
  )
}

export default BuilderLayout
