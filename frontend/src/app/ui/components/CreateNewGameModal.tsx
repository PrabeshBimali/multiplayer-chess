"use client"

import { useState } from "react"
import BlackQueenIcon from "./images/BlackQueenIcon"
import WhiteQueenIcon from "./images/WhiteQueenIcon"
import { PieceColor } from "@/app/types/global.enums"

export default function CreateNewGameModal() {

  const randomColor: PieceColor = (Math.floor(Math.random() * 10)) < 5 ? PieceColor.WHITE : PieceColor.BLACK
  const [selectedColor, setSelectedColor] = useState<PieceColor>(randomColor)

  function handleColorChange(color: PieceColor) {
    setSelectedColor(color)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      
      <div className="relative p-6 rounded-xl shadow-xl flex flex-col gap-4 items-center bg-gray-700">
        <h2 className="text-xl font-semibold text-white">Choose Piece Color</h2>
        <div className="flex gap-5">
          <div className={`border border-gray-500 rounded-full 
                           p-1 w-14 h-14 cursor-pointer hover:bg-gray-400 flex 
                           justify-center ${selectedColor === PieceColor.WHITE ? "bg-gray-400" : "bg-gray-200"}`}
               onClick={() => handleColorChange(PieceColor.WHITE)}
          >
            <WhiteQueenIcon/>
          </div>
          <div className={`border border-gray-500 rounded-full 
                           p-1 w-14 h-14 cursor-pointer hover:bg-gray-400 flex 
                           justify-center ${selectedColor === PieceColor.BLACK ? "bg-gray-400" : "bg-gray-200"}`}
               onClick={() => handleColorChange(PieceColor.BLACK)}
          >
            <BlackQueenIcon/>
          </div>
        </div>
        <button className="bg-lime-600 text-white font-bold text-xl cursor-pointer hover:bg-lime-500 p-2 rounded-sm">Create Game</button>
        <p className="text-xs text-white tracking-wide">Color will be selected randomly if you do not choose!</p>
      </div>
    </div>
  )
}