"use client"

import { useState } from "react"
import BlackQueenIcon from "./images/BlackQueenIcon"
import WhiteQueenIcon from "./images/WhiteQueenIcon"
import { PieceColor } from "@/app/types/global.enums"
import { useSocket } from "@/app/context/SocketProvider"
import { useToast } from "@/app/context/ToastProvider"

interface CreateNewGameModalProps {
  setOpenCreateGameModal: React.Dispatch<React.SetStateAction<boolean>>
  setOpenShareGameLinkModal: React.Dispatch<React.SetStateAction<boolean>>
  setMultiplayerGameCode: React.Dispatch<React.SetStateAction<string>>
}

export default function CreateNewGameModal(props: CreateNewGameModalProps) {

  const { addToast } = useToast()
  
  const socket = useSocket()

  const {setOpenCreateGameModal, setOpenShareGameLinkModal, setMultiplayerGameCode} = props

  const randomColor: PieceColor = (Math.floor(Math.random() * 10)) < 5 ? PieceColor.WHITE : PieceColor.BLACK
  const [selectedColor, setSelectedColor] = useState<PieceColor>(randomColor)
  const [isPieceSelected, setIsPieceselected] = useState<boolean>(false)
  const [createGameLoad, setCreateGameLoad] = useState<boolean>(false)

  function handleColorChange(color: PieceColor) {
    if(selectedColor === color && isPieceSelected) {
      setSelectedColor(randomColor)
      setIsPieceselected(false)
      return
    }

    setSelectedColor(color)
    setIsPieceselected(true)
  }

  function closeModal(e: React.MouseEvent) {
    if(e.target === e.currentTarget) {
      setOpenCreateGameModal(false)
    }
  }

  async function createNewGame() {
    // return if previous promise is not resolved
    if(createGameLoad) return

    const url: string | undefined = process.env.NEXT_PUBLIC_API_URL + "/create-game"

    if(!url) {
      console.error(`Invalid URL: ${url}`)
      return;
    }

    let storedGameId: string | null = localStorage.getItem("gameid")
    let storedPlayerId: string | null = localStorage.getItem("playerid")

    if(!storedGameId || storedGameId === "undefined") {
      storedGameId = null
    }

    if(!storedPlayerId || storedPlayerId === "undefined") {
      storedPlayerId = null
    }

    if(storedGameId) {
      const shouldProceed = window.confirm("Are you sure you want to create new game? previous game will be deleted!")

      if(!shouldProceed) return
    }

    try {
      setCreateGameLoad(true)
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "gameid": storedGameId,
          "playerid": storedPlayerId,
          "color": selectedColor
        })
      })

      if(!response.ok) {
        addToast("Server Error", "error")
        throw new Error(`HTTP ERROR! status: ${response.status}`)
      }

      const data = await response.json()
      const {gameid, playerid, color} = data

      localStorage.setItem("gameid", gameid)
      localStorage.setItem("playerid", playerid)
      localStorage.setItem("color", color)

      setOpenCreateGameModal(false)
      setOpenShareGameLinkModal(true)
      setMultiplayerGameCode(gameid)

      if(socket) {
        socket.emit("join-game", { gameid, playerid }) 
      }
    } catch(e) {
      addToast("Could not Create New Game", "error")
      console.error(e)

    } finally {
      setCreateGameLoad(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black opacity-50"
        onClick={closeModal}
      ></div>
      
      <div className="relative p-6 rounded-xl shadow-xl flex flex-col gap-4 items-center bg-gray-800">
        <h2 className="text-xl font-semibold text-white">Choose Piece Color</h2>
        <div className="flex gap-5">
          <div className={`border border-gray-500 rounded-full p-1 w-14 h-14 
                           cursor-pointer hover:bg-gray-400 flex justify-center 
                           ${selectedColor === PieceColor.WHITE && isPieceSelected ? "bg-gray-400" : "bg-gray-200"}`}
               onClick={() => handleColorChange(PieceColor.WHITE)}
          >
            <WhiteQueenIcon/>
          </div>
          <div className={`border border-gray-500 rounded-full p-1 w-14 h-14 
                           cursor-pointer hover:bg-gray-400 flex justify-center 
                           ${selectedColor === PieceColor.BLACK && isPieceSelected ? "bg-gray-400" : "bg-gray-200"}`}
               onClick={() => handleColorChange(PieceColor.BLACK)}
          >
            <BlackQueenIcon/>
          </div>
        </div>
        <button 
          className="bg-lime-600 text-white font-bold text-xl cursor-pointer hover:bg-lime-500 p-2 rounded-sm"
          onClick={createNewGame}
        >
          {createGameLoad ? "Creating..." : "Create Game"}
        </button>
        <p className="text-xs text-gray-300 tracking-wide">Color will be selected randomly if you do not choose!</p>
      </div>
    </div>
  )
}