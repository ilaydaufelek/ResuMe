'use client'
import { FormValues } from "@/types/formValues";
import { Circle, CircleStar, Link, Mail, MapPin, Phone } from "lucide-react";
import { useFormContext } from "react-hook-form"

export const OnyxCv=()=>{
     const { watch } = useFormContext<FormValues>()
    const values=watch();

    return(
        <div className="text-zinc-900 h-full w-[350px] [@media(min-width:399px)]:w-[750px]  p-4 mb-12 space-y-2 ">
          <div className=" space-y-2   md:full  " >
        <p className="font-semibold  text-xl overflow-x-auto  " >{values.fullname}</p>
      </div>
       <div className="w-full flex md:flex md:space-x-4 overflow-x-auto space-x-4 ">
    <p className="flex items-center text-xs underline mt-1 whitespace-nowrap">
      {values.location && <MapPin className="w-3 h-3 mr-1 text text-rose-600 " />}
      {values.location}
    </p>
    <p className="flex items-center text-xs underline mt-1 whitespace-nowrap">
      {values.phone && <Phone className="w-3 h-3 mr-1 text-rose-600 " />}
      {values.phone}
    </p>
    <p className="flex items-center text-xs underline mt-1 whitespace-nowrap">
      {values.email && <Mail className="w-3 h-3 mr-1 text-rose-600 " />}
      {values.email}
    </p>
    <p className="flex items-center text-xs underline mt-1 whitespace-nowrap">
      {values.website && <Link className="w-3 h-3 mr-1 text-rose-600 " />}
      {values.website}
    </p>
   </div>
   
   {values.fullname && <div className="border border-rose-600 -mx-1 my-1 h-px  " />}
      {values.summary && (
         <div className="w-full mt-4" >
        <div className="text-xs font-semibold text-rose-600 mb-2 ">Summary</div>
         <div className="text-xs font-mono break-words whitespace-normal  " >
          {values.summary}
        </div>
      </div>
      )}
          {values.experience && values.experience.length > 0 && (
        <div className="w-full mt-4" >
        <div className="text-xs font-semibold text-rose-600 " >Experience</div>
         {values.experience.map((exp,i)=>(
         <div key={i} className="" >
            <div  className=" w-full flex items-center justify-between mt-2 space-x-4 " >
          <p className=" w-[150px]  md:w-[350px] font-semibold text-sm break-words whitespace-normal " >{exp.company}</p>
          <p className="font-semibold text-sm" >{exp.date}</p>
          </div>
       

         </div>
          
         ))}
        </div>
      )}
    
        {values.experience.length > 0 && <div className="h-[0.3px] bg-rose-600 rounded-full w-full opacity-10 my-4 " /> }
          {values.education && values.education.length > 0 && (
        <div className="w-full mt-4" >
        <div className="text-xs font-semibold text-rose-600 " >Education</div>
         {values.education.map((exp,i)=>(
         <div key={i} className="overflow-x-auto  ">
            <div className=" w-full flex items-center justify-between mt-2 space-x-4 " >
          <p className="  w-[150px]  md:w-[350px] font-semibold text-sm break-words whitespace-normal " >{exp.name}</p>
          <p className="font-semibold text-sm break-words whitespace-normal " >{exp.date}</p>
          </div>
          </div>
       
          
         ))}
        </div>
      )}
   
      {values.education.length > 0 &&<div className="h-[0.3px] bg-rose-600 rounded-full w-full opacity-10 my-4 " />}
     
          {values.certifications && values.certifications.length > 0 && (
        <div className="w-full mt-4" >
        <div className="text-xs font-semibold text-rose-600 " >Certifications</div>
         {values.certifications.map((exp,i)=>(
         <div key={i} className="overflow-x-auto ">
            <div className=" w-full flex items-center justify-between mt-2 space-x-4 " >
          <p className=" w-[150px]  md:w-[350px] font-semibold text-sm break-words whitespace-normal " >{exp.name}</p>
          <p className="font-semibold text-sm break-words whitespace-normal " >{exp.date}</p>
          </div>
          </div>
       
          
         ))}
        </div>
      )}

       {values.certifications.length > 0 && <div className="h-[0.3px] bg-rose-600 rounded-full w-full opacity-10 my-4 " />}

          {values.languages && values.languages.length > 0 && (
        <div className="w-full mt-4" >
        <div className="text-xs font-semibold text-rose-600 " >Languages</div>
         {values.languages.map((exp,i)=>(
         <div key={i} className="overflow-x-auto space-x-4 ">
            <div className=" w-full flex items-center justify-between mt-2 space-x-4 " >
          <p className="font-semibold text-sm break-words whitespace-normal " >{exp.name}</p>
            <div className="flex gap-1">
          {Array.from({ length: 6 }).map((_, idx) => {
           const level = exp.level ?? 0 
           const Icon = idx < level ? CircleStar : Circle
          return <Icon key={idx} className="w-3 h-3 text-rose-600" />
          })}
        </div>
          </div>
          </div>
       
          
         ))}
        </div>
      )}

        </div>
    )
}