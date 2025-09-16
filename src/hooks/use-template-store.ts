import {create} from 'zustand'

type TemplateType='onxy' | 'kakuna' |'bronzor'

interface TemplateStore{
    type:TemplateType | null;
    isOpen:boolean;
    onOpen:(type:TemplateType)=>void;
   
}

export const useTemplate=create<TemplateStore>((set)=>({
    type:null,
    isOpen:false,
    onOpen:(type)=>set({isOpen:true,type}),
    
}))