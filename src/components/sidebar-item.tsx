'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import { MenuSquare, User2 } from 'lucide-react'
import { Textarea } from './ui/textarea'

const formSchema = z.object({
  phone: z.string().min(11, {
    message: 'phone must be at least 11 characters'
  }),
  fullname: z.string().min(2, {
    message: 'fullname must be at least 2 characters'
  }) ,
  email: z.string().min(2, {
    message: 'Email must be at least 10 characters'
  }) ,
   location: z.string().optional(),
    website: z.string().optional(),
    summary: z.string().optional(),  
 

})

export const SidebarItem = () => {
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: '',
      fullname: '',
      email:'',
      location:'' ,
      website:'',
      summary:'',
    }
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    localStorage.setItem('resume', JSON.stringify(values))
    console.log( values)
    form.reset()
    router.refresh()
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

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
       <div className='flex items-center space-x-2 font-semibold '>
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
        <Button type="submit" disabled={isLoading}>
          Save
        </Button>
      </form>
    </Form>
  )
}
