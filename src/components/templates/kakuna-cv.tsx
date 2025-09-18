'use client'

import { FormValues } from "@/types/formValues"
import { Circle, CircleStar, Link, Mail, MapPin, Phone } from "lucide-react"
import { useFormContext } from "react-hook-form"



export const KakunaCv = () => {
  const { watch } = useFormContext<FormValues>()
  const values = watch()

  return (
    <div className="text-zinc-900 h-full  w-[350px] [@media(min-width:399px)]:w-[750px] p-4 mb-8  space-x-3">
      <div className=" space-y-2 w-full " >
        <p className="font-semibold flex justify-center items-center text-xl overflow-x-auto  " >{values.fullname}</p>
      </div>
       <div className="  w-full flex  items-center md:justify-center space-x-4  overflow-auto " >
        <p className=" flex justify-center items-center text-xs underline mt-1 " >
          {values.location ? <MapPin className="w-3 h-3 mr-1  " />: ''}
          {values.location}</p>
         <p className=" flex justify-center items-center text-xs underline mt-1 " >
          {values.phone ? <Phone className="w-3 h-3 mr-1 " />: ''}
          {values.phone}</p>
          <p className=" flex justify-center items-center text-xs underline mt-1 " >
          {values.email ? <Mail className="w-3 h-3 mr-1 " /> :''}
          {values.email}</p>
           <p className=" flex justify-center items-center text-xs underline mt-1 " >
          {values.website ? <Link className="w-3 h-3 mr-1 " />: ''}
          {values.website}</p>
       </div>
      {values.summary && (
         <div className="w-full mt-4" >
        <div className="flex items-center justify-center text-xs font-semibold text-zinc-600 " >Summary</div>
        <div className="border border-zinc-600 -mx-1 my-1 h-px" />
         <div className="text-xs font-mono break-words whitespace-normal " >
          {values.summary}
        </div>

      </div>
      )}
      {values.experience && values.experience.length > 0 && (
        <div className="w-full mt-4" >
        <div className="flex items-center justify-center text-xs font-semibold text-zinc-600 " >Experience</div>
         <div className="border border-zinc-600 -mx-1 my-1 h-px" />
         {values.experience.map((exp,i)=>(
          <div key={i} className=" w-full " >
          <p className="font-semibold text-sm break-words whitespace-normal " >{exp.company}</p>
          <p className="font-semibold text-xs" >{exp.date}</p>
          </div>
         ))}
        </div>
      )}

         {values.education && values.education.length > 0 &&(
        <div className="w-full mt-4" >
        <div className="flex items-center justify-center text-xs font-semibold text-zinc-600 " >Education</div>
         <div className="border border-zinc-600 -mx-1 my-1 h-px" />
         {values.education.map((exp,i)=>(
          <div key={i} className="w-full" >
          <p className="font-semibold text-sm break-words whitespace-normal" >{exp.name}</p>
          {/* <p className="text-xs" >web tasarım kodlama</p>// */}
          <p className="font-semibold text-xs" >{exp.date}</p>
          </div>
         ))}
        </div>
      )}

        {values.certifications && values.certifications.length > 0 && (
        <div className="w-full mt-4" >
        <div className="flex items-center justify-center text-xs font-semibold text-zinc-600 " >Certifications</div>
         <div className="border border-zinc-600 -mx-1 my-1 h-px" />
         {values.certifications.map((exp,i)=>(
          <div key={i} className="w-full" >
          <p className="font-semibold text-sm break-words whitespace-normal "  >{exp.name}</p>
          <p className="font-semibold text-xs" >{exp.date}</p>
          </div>
         ))}
        </div>
      )}
       {values.languages && values.languages.length > 0 && (
        <div className="w-full mt-4" >
        <div className="flex items-center justify-center text-xs font-semibold text-zinc-600 " >Languages</div>
         <div className="border border-zinc-600 -mx-1 my-1 h-px" />
         {values.languages.map((exp,i)=>(
          <div key={i} className="w-full" >
          <div className="flex gap-1">
          {Array.from({ length: 6 }).map((_, idx) => {
           const level = exp.level ?? 0 
           const Icon = idx < level ? CircleStar : Circle
          return <Icon key={idx} className="w-3 h-3" />
          })}
        </div>
          <p className="font-semibold text-sm break-words whitespace-normal " >{exp.name}</p>
          </div>
         ))}
        </div>
      )}





     </div>
  )
}