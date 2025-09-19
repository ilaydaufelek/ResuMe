'use client'
import { useModal } from "@/hooks/use-modal-store"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Controller, useFieldArray,  useFormContext } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Slider } from "../ui/slider";



export const LanguagesModal=()=>{
    const {onClose,type,isOpen}=useModal();
    const isModalOpen=isOpen && type==='languages'
    
    
  const form=useFormContext()
  const {fields,append,remove}=useFieldArray({
    name:'languages',
    control:form.control
  })
    const handleClose=()=>{
      onClose();
    }

    
    return(
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="dark:bg-zinc-900 bg-zinc-200 p-6 space-y-4">
        <DialogHeader>
          <DialogTitle>Languages</DialogTitle>
        </DialogHeader>

        {fields.map((field, index) => (
          <div key={field.id} className="space-y-4">
            <div className="flex space-x-2 " >
             <Button
              className="bg-primary text-primary-foreground shadow-xs hover:bg-zinc-600/60 dark:hover:bg-zinc-300/50 "
              size='icon'
              onClick={()=>remove(index)} >-</Button>
            
            <Input
              placeholder="Name"
              {...form.register(`languages.${index}.name`)}
            />
            </div>
          <Controller
        name={`languages.${index}.level`}
         control={form.control}
       render={({ field }) => (
          <Slider
         value={[field.value || 1]}
          max={6}
         step={1}
      onValueChange={(val) => field.onChange(val[0])}/>
                                               
  )}
/>



      

        

          </div>
        ))}
        
          <Button
          type="button"

         onClick={()=>append({name:'' , level:1})}
        >
          + Add new item
        </Button>
     
       <div className="w-full flex " >
         <Button
         variant='outline'
        className="ml-auto "
         type="button" onClick={handleClose}>
          Save
        </Button>
       </div>
        
      </DialogContent>
    </Dialog>
  )
}