'use client'
import { PreviewPage } from "@/components/preview"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Toaster } from "@/components/ui/sonner"
import {  useState } from "react"




const BuildPage = () => {


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


  return (
    <div className="h-full md:h-screen w-full flex bg-zinc-900 justify-center items-center">
      <div className="w-full md:w-[800px]  h-full md:h-screen ">
        <div
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
           onTouchStart={handleTouchStart}
          onMouseLeave={handleMouseUp}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
            cursor: dragging ? "grabbing" : "grab",
          }}
          className="w-full h-screen space-x-4 bg-white space-y-4 min-h-screen md:h-screen touch-none mt-6 md:mt-1"
        >
          <ScrollArea className="h-full" >
          <PreviewPage />
           </ScrollArea>
        </div>
          <Toaster />
      </div>
      </div>
  )
}

export default BuildPage
