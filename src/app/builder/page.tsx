'use client'
import { PreviewPage } from "@/components/preview"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Toaster } from "@/components/ui/sonner"
import { useRef, useState } from "react"
import { toPng } from "html-to-image"
import jsPDF from "jspdf"
import { useClerk } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"

const BuildPage = () => {
  const ref = useRef<HTMLDivElement>(null)
  const { user } = useClerk()

  const [dragging, setDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })

  // Fare eventleri
  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true)
    setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y })
  }
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return
    setPosition({ x: e.clientX - startPos.x, y: e.clientY - startPos.y })
  }
  const handleMouseUp = () => setDragging(false)

  // Dokunmatik eventleri (mobil)
  const handleTouchStart = (e: React.TouchEvent) => {
    setDragging(true)
    const touch = e.touches[0]
    setStartPos({ x: touch.clientX - position.x, y: touch.clientY - position.y })
  }
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragging) return
    const touch = e.touches[0]
    setPosition({ x: touch.clientX - startPos.x, y: touch.clientY - startPos.y })
  }
  const handleTouchEnd = () => setDragging(false)

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
        
    <div className="h-full md:h-screen w-full p-8 bg-zinc-900 flex items-center justify-center">
        
      <div className="w-full md:w-[800px] h-full">
          <div
            ref={ref}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp} // fare sayfadan çıksa sürüklemeyi durdur
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ transform: `translate(${position.x}px, ${position.y}px)`, cursor: dragging ? "grabbing" : "grab" }}
            className="w-full space-x-4 bg-white space-y-4 min-h-screen md:h-screen touch-none"
          >
            <PreviewPage />
            <Button onClick={downloadPDF} >pdf indir</Button>
            <Toaster />
          </div>
      </div>
    </div>
   
  )
}

export default BuildPage
