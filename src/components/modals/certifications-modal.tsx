'use client'
import { useModal } from "@/hooks/use-modal-store"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useFieldArray,  useFormContext } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";



export const CertificationsModal=()=>{
    const {onClose,type,isOpen}=useModal();
    const isModalOpen=isOpen && type==='certifications'
    
    const form=useFormContext()
   const{fields,append,remove}=useFieldArray({
    name:'certifications',
    control:form.control
   });
    const handleClose=()=>{
      onClose();
    }
    return(
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="dark:bg-zinc-900 bg-zinc-200 p-6 space-y-4">
        <DialogHeader>
          <DialogTitle>Experience</DialogTitle>
        </DialogHeader>

        {fields.map((field, index) => (
          <div key={field.id} className="flex space-x-2">
            <Input
              placeholder="Name"
              {...form.register(`certifications.${index}.name`)}
            />
            <Input
              placeholder="April 2024 - Present"
              {...form.register(`certifications.${index}.date`)}
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
         onClick={()=>append({name:'' , date:''})}
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