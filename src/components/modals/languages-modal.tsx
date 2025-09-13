'use client'
import { useModal } from "@/hooks/use-modal-store"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useFieldArray,  useFormContext } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";



export const LanguagesModal=()=>{
    const {onOpen,onClose,type,isOpen}=useModal();
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
      <DialogContent className="bg-zinc-900 p-6 space-y-4">
        <DialogHeader>
          <DialogTitle>Languages</DialogTitle>
        </DialogHeader>

        {fields.map((field, index) => (
          <div key={field.id} className="flex space-x-2">
            <Input
              placeholder="Name"
              {...form.register(`languages.${index}.name`)}
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
         onClick={()=>append({name:'' })}
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