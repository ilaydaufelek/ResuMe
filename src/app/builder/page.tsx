'use client'
import { PreviewPage } from "@/components/preview"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Toaster } from "@/components/ui/sonner"
import { useRef, useState } from "react"
import { toPng } from "html-to-image"
import jsPDF from "jspdf"
import { useClerk } from "@clerk/nextjs"

const BuildPage = () => {
  const ref = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const { user } = useClerk()

  const [dragging, setDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true)
    setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return
    setPosition({ x: e.clientX - startPos.x, y: e.clientY - startPos.y })
  }

  const handleMouseUp = () => {
    setDragging(false)
  }

  const downloadPDF = async () => {
    if (!ref.current) return

    try {
      const dataUrl = await toPng(ref.current, { cacheBust: true })
      const pdf = new jsPDF("p", "mm", "a4")
      const imgProps = pdf.getImageProperties(dataUrl)
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight)
      pdf.save(`${user?.fullName}.pdf`)
    } catch (err) {
      console.error("PDF indirme hatası:", err)
    }
  }

  return (
    <ScrollArea className="h-full" >
    <div className="h-full md:h-screen w-full  flex items-center justify-center">
      <div className="w-full md:w-[800px] h-full">
        
          <div
            ref={previewRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{ transform: `translate(${position.x}px, ${position.y}px)`, cursor: dragging ? "grabbing" : "grab" }}
            className="w-full md:w-[800px] space-x-4 bg-white space-y-4 min-h-screen md:h-screen"
          >
            <PreviewPage />
            <Toaster />
          </div>
       
      </div>
    </div>
    </ScrollArea>
  )
}

export default BuildPage
