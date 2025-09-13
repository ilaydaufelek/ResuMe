'use client'

import { useEffect, useState } from "react"
import { ExperienceModal } from "@/components/modals/experience-modal";
import { EducationModal } from "@/components/modals/education-modal";
import { CertificationsModal } from "@/components/modals/certifications-modal";
import { LanguagesModal } from "@/components/modals/languages-modal";

export const ModalProvider=()=>{
    const [isMounted,setMounted]=useState(false);
    useEffect(()=>{
        setMounted(true)
    })

    if(!isMounted){
        return null
    }

    return(
        <>
        <ExperienceModal />
        <EducationModal/>
        <CertificationsModal/>
        <LanguagesModal/>
        </>
    )
}