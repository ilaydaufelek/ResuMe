import { FormValues } from "@/types/formValues"
import { Link, Mail, MapPin, Phone } from "lucide-react";
import { useFormContext } from "react-hook-form"


const LevelMap:Record<number,string>=
    {
    1: "Beginner",
    2: "Elementary",
    3: "Intermediate",
    4: "Upper Intermediate",
    5: "Advanced",
    6: "Proficient",

}


export const BronzorCv=()=>{
    const {watch}=useFormContext<FormValues>();
    const values=watch()
    return(
        <div className="text-zinc-900 h-full  w-[350px] [@media(min-width:399px)]:w-[750px] p-4 mb-8  space-x-3">
      <div className=" space-y-2 w-full " >
        <p className="font-semibold flex justify-center items-center text-xl overflow-x-auto  " >{values.fullname}</p>
      </div>
       <div className="  w-full flex  items-center md:justify-center space-x-4  overflow-auto " >
        <p className=" flex justify-center items-center text-xs underline mt-1 " >
          {values.location ? <MapPin className="w-3 h-3 mr-1 text-cyan-600 " />: ''}
          {values.location}</p>
         <p className=" flex justify-center items-center text-xs underline mt-1 " >
          {values.phone ? <Phone className="w-3 h-3 mr-1  text-cyan-600 " />: ''}
          {values.phone}</p>
          <p className=" flex justify-center items-center text-xs underline mt-1 " >
          {values.email ? <Mail className="w-3 h-3 mr-1  text-cyan-600 " /> :''}
          {values.email}</p>
           <p className=" flex justify-center items-center text-xs underline mt-1 " >
          {values.website ? <Link className="w-3 h-3 mr-1  text-cyan-600 " />: ''}
          {values.website}</p>
       </div>
      {values.summary && (
         <div className="mt-4 " >
         <div className="h-[1px]  bg-cyan-700 my-1 opacity-30 "/>
        <div className=" flex justify-between" >
        <div className="  w-[40px]  md:w-[100px] text-sm font-bold text-zinc-900 " >Summary</div>
        
         <div className=" w-[220px] [@media(min-width:399px)]:w-[600px] text-xs font-mono break-words whitespace-normal " >
          {values.summary}
        </div>

      </div>
         </div>
      )}
    {values.experience && values.experience.length > 0 && (
  <div className="mt-4">
    <div className="h-[1px] bg-cyan-700 my-1 opacity-30" />
    <div className="flex justify-between ">
   
      <div className="w-[50px] md:w-[100px] text-sm font-bold text-zinc-900">
        Experience
      </div>

      
      <div className="flex flex-col gap-2 w-[220px] [@media(min-width:399px)]:w-[600px]">
        {values.experience.map((exp, i) => (
          <div key={i} className="flex justify-between">
            <p className="font-bold text-sm break-words whitespace-normal w-[170px] md:w-full ">
              {exp.company}
            </p>
            <p className="font-bold text-xs    ">{exp.date}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
)}

         {values.education && values.education.length > 0 &&(
        <div className="mt-4">
    <div className="h-[1px] bg-cyan-700 my-1 opacity-30" />
    <div className="flex justify-between ">
      
      <div className="w-[50px] md:w-[100px] text-sm font-bold text-zinc-900">
        Education
      </div>

     
      <div className="flex flex-col gap-2 w-[220px] [@media(min-width:399px)]:w-[600px]">
        {values.education.map((exp, i) => (
          <div key={i} className="flex justify-between">
            <p className="font-bold text-sm break-words whitespace-normal w-[170px] md:w-full ">
              {exp.name}
            </p>
            <p className="font-bold text-xs  ">{exp.date}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
      )}

        {values.certifications && values.certifications.length > 0 && (
         <div className="mt-4">
    <div className="h-[1px] bg-cyan-700 my-1 opacity-30" />
    <div className="flex justify-between ">
   
      <div className=" md:w-[100px] text-sm font-bold text-zinc-900">
        Certifications
      </div>

      
      <div className="flex flex-col gap-2 w-[200px] [@media(min-width:399px)]:w-[600px]">
        {values.certifications.map((exp, i) => (
          <div key={i} className="flex justify-between">
            <p className="font-bold text-sm break-words whitespace-normal w-[150px] md:w-full  ">
              {exp.name}
            </p>
            <p className="font-bold text-xs    ">{exp.date}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
      )}
       {values.languages && values.languages.length > 0 && (
         <div className="mt-4">
    <div className="h-[1px] bg-cyan-700 my-1 opacity-30" />
    <div className="flex justify-between ">
   
      <div className="w-[50px] md:w-[100px] text-sm font-bold text-zinc-900">
        Languages
      </div>

      
      <div className="grid grid-cols-2 gap-4 w-[220px] [@media(min-width:399px)]:w-[600px]">
        {values.languages.map((exp, i) => (
          <div key={i} className="flex flex-col">
            <p className="font-bold text-sm break-words whitespace-normal  ">
              {exp.name}
            </p>
            <p className="font-semibold text-xs  ">{LevelMap[exp.level ?? 1]}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
      )}





     </div>
    )
}