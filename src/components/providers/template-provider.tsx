'use client'

import { useEffect, useState } from "react";
import { KakunaCv } from "@/components/templates/kakuna-cv";
import { OnyxCv } from "@/components/templates/onyx-cv";
import { useTemplate } from "@/hooks/use-template-store";
import { BronzorCv } from "@/components/templates/bronzor";

export const TemplateProvider = () => {
  const [isMounted, setMounted] = useState(false);
  const { type } = useTemplate();

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!isMounted) return null;

 switch(type) {
    case 'kakuna': return <KakunaCv />
    case 'onyx': return <OnyxCv  />
    case 'bronzor' : return <BronzorCv/>
    default: return <KakunaCv  />
  }
}
