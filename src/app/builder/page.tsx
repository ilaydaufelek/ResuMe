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
  




  return (
    <div className="h-full md:h-screen w-full flex bg-zinc-900  justify-center items-center ">
      <div className="w-full md:w-[800px] mt-20 flex items-center justify-center  h-full md:h-screen ">
        <div className="w-[650px] md:w-[800px] h-screen space-x-4 bg-white space-y-4 min-h-screen md:h-screen  ">
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
