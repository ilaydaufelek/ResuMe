'use client'

import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useModal } from '@/hooks/use-modal-store'
import { ModalProvider } from '@/components/providers/modal-provider'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { Button } from './ui/button'
import { Award, Handbag, Languages, MenuSquare, Trash, User2 } from 'lucide-react'
import { Textarea } from './ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'


type ExperienceItem = { company?: string; date?: string }
type LanguageItem = { name?: string }
type EducationItem = { name?: string; date?: string }
type CertificationItem = { name?: string; date?: string }


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
    name:z.string().optional()
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

export const SidebarItem = () => {
  const router = useRouter();
  const{onOpen}=useModal()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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

  const isLoading = form.formState.isSubmitting

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    localStorage.setItem('resume', JSON.stringify(values))
    console.log( values)
   
    router.refresh()
  }
 
   
 
  return (
  
    <FormProvider {...form} >
     <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6   ">

        <div className='flex text-xl items-center space-x-2 py-4   ' >
          <User2 className='' />
          <p className='  font-semibold  ' >
            Personal Information
          </p> 
          </div>
        <FormField
          control={form.control}
          name="fullname"
          render={({ field }) => (
            <FormItem>
              
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input 
                className='w-full'  {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
       <div className='flex w-full space-x-4 '  >
         <FormField 
        control={form.control}
        name='email'
        render={({field})=>(
           <FormItem >
            <FormLabel>Email</FormLabel>
            <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
           </FormItem>
        )}>

        </FormField>
         <FormField 
        control={form.control}
        name='website'
        render={({field})=>(
           <FormItem >
            <FormLabel>Website</FormLabel>
            <FormControl>
                <Input placeholder="https://example.com" {...field} />
              </FormControl>
           </FormItem>
        )}>

        </FormField>
       </div>
        <div className='flex w-full space-x-4 '  >
         <FormField 
        control={form.control}
        name='phone'
        render={({field})=>(
           <FormItem >
            <FormLabel>Phone</FormLabel>
            <FormControl>
                <Input placeholder="+90(123) 456 78 90" {...field} />
              </FormControl>
           </FormItem>
        )}>
                
        </FormField>
         <FormField 
        control={form.control}
        name='location'
        render={({field})=>(
           <FormItem >
            <FormLabel>Location</FormLabel>
            <FormControl>
                <Input  {...field} />
              </FormControl>
           </FormItem>
        )}>

        </FormField>
       </div>
        <DropdownMenuSeparator />
       <div className='flex items-center space-x-2 font-semibold mt-4  '>
        <MenuSquare className='w-4 h-4' />
        <p>Summary</p>
         </div>
         <FormField 
        control={form.control}
        name='summary'
        render={({field})=>(
           <FormItem >
            <FormControl>
               <Textarea {...field}/>
              </FormControl>
           </FormItem>
        )}>

        </FormField>
         <DropdownMenuSeparator />
     <FormItem  className='mt-4 ' >
      <div className='flex items-center space-x-2 font-semibold  '>
        <Handbag className='w-4 h-4' />
        <p>Experience</p>
         </div>
  <FormControl>
    {form.getValues('experience')?.length > 0  
    ? (
      <div className="space-y-2  ">
        {form.getValues("experience").map((exp:ExperienceItem, i: number) => (
          <DropdownMenu key={i}>
      <DropdownMenuTrigger className="text-zinc-200 w-full dark:hover:bg-zinc-800/20 border border-dotted p-4 flex items-center">
          {exp.company} - {exp.date}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
      <DropdownMenuItem className="text-rose-700 cursor-pointer">
              
      <Trash 
      onClick={()=>{
         const resume=JSON.parse(localStorage.getItem('resume')|| '{}')
          localStorage.removeItem(resume.experience)
        }
      } className="w-4 h-4 text-rose-700" />
      <p>Remove</p>
        </DropdownMenuItem>
        </DropdownMenuContent>
        </DropdownMenu>
        ))}

       <div className='w-full flex' >
         <button
          type="button"
          onClick={() => onOpen("experience")}
          className="text-zinc-200 dark:hover:bg-zinc-800/20 border border-dotted p-2 font-semibold  ml-auto "
        >
          + Add new item
        </button>
       </div>
      </div>
    )
    
    :(
    <button 
    className='text-zinc-200 dark:hover:bg-zinc-800/20 border border-dotted p-4 font-semibold mt-2  '
     type="button" onClick={() => onOpen('experience')}>
     Add Experience
    </button>
  )}
    
  </FormControl>
</FormItem>
<DropdownMenuSeparator />


 <FormItem  className='mt-4' >
      <div className='flex items-center space-x-2 font-semibold  '>
        <Languages className='w-4 h-4' />
        <p>Education</p>
         </div>
  <FormControl>
    {form.getValues('education').length >0 
    ?(
       <div className='space-y-2' >
        {form.getValues('education').map((exp:EducationItem , i:number)=>(
          <DropdownMenu key={i} >
          <DropdownMenuTrigger  className="text-zinc-200 w-full dark:hover:bg-zinc-800/20 border border-dotted p-4 flex items-center" >
            {exp.name} - {exp.date}
          </DropdownMenuTrigger>
         <DropdownMenuContent>
      <DropdownMenuItem className="text-rose-700 cursor-pointer">
              
      <Trash 
      onClick={()=>{
        
        }
      } className="w-4 h-4 text-rose-700" />
      <p>Remove</p>
        </DropdownMenuItem>
        </DropdownMenuContent>
        </DropdownMenu>
        
        ))}

         <div className='w-full flex' >
         <button
          type="button"
          onClick={() => onOpen("education")}
          className="text-zinc-200 dark:hover:bg-zinc-800/20 border border-dotted p-2 font-semibold  ml-auto "
        >
          + Add new item
        </button>
       </div>
        
       </div>
    )
    
   
    
    :(
      <button 
    className='text-zinc-200 dark:hover:bg-zinc-800/20 border border-dotted p-4 font-semibold mt-2 '
     type="button" onClick={() => onOpen('education')}>
     Add Education
    </button>
    )}
    
  </FormControl>
</FormItem>

<DropdownMenuSeparator />
 
 <FormItem  className='mt-4' >
      <div className='flex items-center space-x-2 font-semibold  '>
        <Award className='w-4 h-4' />
        <p>Certifications</p>
         </div>
  <FormControl>
    {form.getValues('certifications').length >0 
    ?(
       <div className='space-y-2' >
        {form.getValues('certifications').map((exp:CertificationItem, i:number)=>(
          <DropdownMenu key={i} >
          <DropdownMenuTrigger  className="text-zinc-200 w-full dark:hover:bg-zinc-800/20 border border-dotted p-4 flex items-center" >
            {exp.name} - {exp.date}
          </DropdownMenuTrigger>
         <DropdownMenuContent>
      <DropdownMenuItem className="text-rose-700 cursor-pointer">
              
      <Trash 
      onClick={()=>{
        
        }
      } className="w-4 h-4 text-rose-700" />
      <p>Remove</p>
        </DropdownMenuItem>
        </DropdownMenuContent>
        </DropdownMenu>
        
        ))}

         <div className='w-full flex' >
         <button
          type="button"
          onClick={() => onOpen("certifications")}
          className="text-zinc-200 dark:hover:bg-zinc-800/20 border border-dotted p-2 font-semibold  ml-auto "
        >
          + Add new item
        </button>
       </div>
        
       </div>
    )
    
   
    
    :(
      <button 
    className='text-zinc-200 dark:hover:bg-zinc-800/20 border border-dotted p-4 font-semibold mt-2 '
     type="button" onClick={() => onOpen('certifications')}>
     Add Certifications
    </button>
    )}
    
  </FormControl>
</FormItem>


  <DropdownMenuSeparator/>
 
 <FormItem  className='mt-4' >
      <div className='flex items-center space-x-2 font-semibold  '>
        <Languages className='w-4 h-4' />
        <p>Languages</p>
         </div>
  <FormControl>
    {form.getValues('languages').length >0 
    ?(
       <div className='space-y-2' >
        {form.getValues('languages').map((exp:LanguageItem , i:number)=>(
          <DropdownMenu key={i} >
          <DropdownMenuTrigger  className="text-zinc-200 w-full dark:hover:bg-zinc-800/20 border border-dotted p-4 flex items-center" >
            {exp.name} 
          </DropdownMenuTrigger>
         <DropdownMenuContent>
      <DropdownMenuItem className="text-rose-700 cursor-pointer">
              
      <Trash 
      onClick={()=>{
        
        }
      } className="w-4 h-4 text-rose-700" />
      <p>Remove</p>
        </DropdownMenuItem>
        </DropdownMenuContent>
        </DropdownMenu>
        
        ))}

         <div className='w-full flex' >
         <button
          type="button"
          onClick={() => onOpen("languages")}
          className="text-zinc-200 dark:hover:bg-zinc-800/20 border border-dotted p-2 font-semibold  ml-auto "
        >
          + Add new item
        </button>
       </div>
        
       </div>
    )
    
   
    
    :(
      <button 
    className='text-zinc-200 dark:hover:bg-zinc-800/20 border border-dotted p-4 font-semibold mt-2 '
     type="button" onClick={() => onOpen('languages')}>
     Add Languages
    </button>
    )}
    
  </FormControl>
</FormItem>


        
<Button
className='w-full my-4' type="submit" disabled={isLoading}>
   Save
</Button>

<ModalProvider/>
      </form>
    </Form>
    
   </FormProvider>
   
  )
}
