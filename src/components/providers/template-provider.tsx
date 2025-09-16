'use client'

import { useEffect, useState } from "react";
import { KakunaCv } from "@/components/templates/kakuna-cv";
import { OnyxCv } from "@/components/templates/onyx-cv";
import { useTemplate } from "@/hooks/use-template-store";

export const TemplateProvider = () => {
  const [isMounted, setMounted] = useState(false);
  const { type } = useTemplate();

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!isMounted) return null;

  switch(type) {
    case 'kakuna':
      return <KakunaCv />;
    case 'onxy':
      return <OnyxCv />;
    default:
      return <KakunaCv/>;
      
  }
}
