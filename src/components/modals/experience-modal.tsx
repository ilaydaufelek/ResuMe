'use client'
import { useModal } from "@/hooks/use-modal-store"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useFieldArray,  useFormContext } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";




export const ExperienceModal=()=>{
    const {onClose,type,isOpen}=useModal();
    const isModalOpen=isOpen && type==='experience'
    
   
  const form=useFormContext();
  const {fields,append,remove}=useFieldArray({
    control:form.control,
    name:'experience'
  })

    const handleClose=()=>{
      onClose();
    }
  
    return(
       <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-zinc-900 p-6 space-y-4">
        <DialogHeader>
          <DialogTitle>Experience</DialogTitle>
        </DialogHeader>

        {fields.map((field, index) => (
          <div key={field.id} className="flex space-x-2">
            <Input
              placeholder="Company"
              {...form.register(`experience.${index}.company`)}
            />
            <Input
              placeholder="April 2024 - Present"
              {...form.register(`experience.${index}.date`)}
            />

      

            <Button
              type="button"
              variant="destructive"
              onClick={()=>remove(index)}
            >
              X
            </Button>
        

          </div>
        ))}
        
          <Button
          type="button"
         onClick={()=>append({company:'' , date:''})}
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