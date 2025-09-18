'use client'
import { TemplateType, useTemplate } from "@/hooks/use-template-store"
import Image from "next/image"
import { ScrollArea } from "../ui/scroll-area"
import { Button } from "../ui/button"
import { useFormContext } from "react-hook-form"
import { FormValues } from "@/types/formValues"

const TemplatesMap = [
  { name: 'kakuna', src: '/kakuna.jpg' },
  { name: 'onyx', src: '/onyx.jpg' },
  { name: 'bronzor', src: '/bronzor.jpg' }
]

export const TemplatePage = () => {
  const { onOpen, type } = useTemplate()
  const { watch } = useFormContext<FormValues>()
  const values = watch()

  const downloadPdf = async () => {
    // Template type'ı da verilere ekliyoruz
    const pdfData = {
      ...values,
      templateType: type 
    }

    const res = await fetch('/api/pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pdfData)
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cv-${type}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <ScrollArea className="h-full">
      <div className="space-y-4 p-4">
        {TemplatesMap.map(t => (
          <Image
            key={t.name}
            alt={t.name}
            onClick={() => onOpen(t.name as TemplateType)}
            src={t.src}
            width={250}
            height={260}
            className={`cursor-pointer transition ${
              type === t.name ? "brightness-100" : "brightness-50 hover:brightness-100"
            }`}
          />
        ))}
        <Button className="w-full" onClick={downloadPdf} disabled={!type}>
          Download PDF
        </Button>
      </div>
    </ScrollArea>
  )
}