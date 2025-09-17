'use client'

import { FormValues } from "@/types/formValues"
import { Circle, CircleStar, Link, Mail, MapPin, Phone } from "lucide-react"
import { useFormContext } from "react-hook-form"



export const KakunaCv = () => {
  const { watch } = useFormContext<FormValues>()
  const values = watch()

  return (
    <div className="text-zinc-900 w-full p-2 space-y-2">
      {/* Full Name */}
      <div className="space-y-2 w-full">
        <p className="font-semibold flex justify-center items-center text-xl">{values.fullname}</p>
      </div>

      {/* Contact info */}
      <div className="w-full flex flex-wrap items-center justify-center space-x-4">
        {values.location && <p className="flex items-center text-xs underline mt-1"><MapPin className="w-3 h-3 mr-1" />{values.location}</p>}
        {values.phone && <p className="flex items-center text-xs underline mt-1"><Phone className="w-3 h-3 mr-1" />{values.phone}</p>}
        {values.email && <p className="flex items-center text-xs underline mt-1"><Mail className="w-3 h-3 mr-1" />{values.email}</p>}
        {values.website && <p className="flex items-center text-xs underline mt-1"><Link className="w-3 h-3 mr-1" />{values.website}</p>}
      </div>

      {/* Summary */}
      {values.summary && (
        <div className="w-full mt-4">
          <div className="flex items-center justify-center text-xs font-semibold text-zinc-600">Summary</div>
          <div className="border border-zinc-600 -mx-1 my-1 h-px" />
          <div className="text-xs font-mono break-words whitespace-normal">{values.summary}</div>
        </div>
      )}

      {/* Experience */}
      {values.experience?.length > 0 && (
        <div className="w-full mt-4">
          <div className="flex items-center justify-center text-xs font-semibold text-zinc-600">Experience</div>
          <div className="border border-zinc-600 -mx-1 my-1 h-px" />
          {values.experience.map((exp, i) => (
            <div key={i} className="w-full">
              <p className="font-semibold text-sm break-words whitespace-normal">{exp.company}</p>
              <p className="font-semibold text-xs">{exp.date}</p>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {values.education?.length > 0 && (
        <div className="w-full mt-4">
          <div className="flex items-center justify-center text-xs font-semibold text-zinc-600">Education</div>
          <div className="border border-zinc-600 -mx-1 my-1 h-px" />
          {values.education.map((exp, i) => (
            <div key={i} className="w-full">
              <p className="font-semibold text-sm break-words whitespace-normal">{exp.name}</p>
              <p className="font-semibold text-xs">{exp.date}</p>
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {values.certifications?.length > 0 && (
        <div className="w-full mt-4">
          <div className="flex items-center justify-center text-xs font-semibold text-zinc-600">Certifications</div>
          <div className="border border-zinc-600 -mx-1 my-1 h-px" />
          {values.certifications.map((exp, i) => (
            <div key={i} className="w-full">
              <p className="font-semibold text-sm break-words whitespace-normal">{exp.name}</p>
              <p className="font-semibold text-xs">{exp.date}</p>
            </div>
          ))}
        </div>
      )}

      {/* Languages */}
      {values.languages?.length > 0 && (
        <div className="w-full mt-4">
          <div className="flex items-center justify-center text-xs font-semibold text-zinc-600">Languages</div>
          <div className="border border-zinc-600 -mx-1 my-1 h-px" />
          {values.languages.map((exp, i) => (
            <div key={i} className="w-full flex items-center justify-between space-x-2">
              <p className="font-semibold text-sm break-words whitespace-normal">{exp.name}</p>
              <div className="flex gap-1">
                {Array.from({ length: 6 }).map((_, idx) => {
                  const level = exp.level ?? 0
                  const Icon = idx < level ? CircleStar : Circle
                  return <Icon key={idx} className="w-3 h-3" />
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
