import {create} from 'zustand'

 export type TemplateType='onyx' | 'kakuna' |'bronzor'

interface TemplateStore{
    type:TemplateType | null;
    isOpen:boolean;
    onOpen:(type:TemplateType)=>void;
   
}

export const useTemplate=create<TemplateStore>((set)=>({
    type:'kakuna',
    isOpen:false,
    onOpen:(type)=>set({isOpen:true,type}),
    
}))