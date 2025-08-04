"use client"

import { useSocket } from "@/app/context/SocketProvider"
import { useToast } from "@/app/context/ToastProvider"
import { useRouter } from "next/navigation"
import { useCallback, useEffect } from "react"

interface MultiplayerInfoProps {
  setOpenEndGameModal: React.Dispatch<React.SetStateAction<boolean>>
}

export default function MultiplayerInfo(props: MultiplayerInfoProps) {

  const {setOpenEndGameModal} = props
  const router = useRouter()
  const socket = useSocket()

  const {addToast} = useToast()

  const handleEndGameSuccess = useCallback((payload: {playerid: string}) => {
    const {playerid} = payload

    const storedPlayerId = localStorage.getItem("playerid")
    localStorage.removeItem("gameid")
    localStorage.removeItem("playerid")
    localStorage.removeItem("color")

    if(storedPlayerId === playerid) {
      setOpenEndGameModal(false)
      addToast("Game Deleted!. Redirecting...", "success", 4000)
      setTimeout(() => router.push("/"), 3000)
      return
    }

    alert("Opponent deleted the game. You'll be redirected to Homepage!")
    router.push("/")

  }, [])

  const handleEndGameAuthError = useCallback(() => {
    alert("Only Creator of the Game can end it!")
  }, [])

  useEffect(() => {
    if(!socket) return

    socket.on("end-game-success", handleEndGameSuccess)
    socket.on("end-game-auth-error", handleEndGameAuthError)

    return () => {
      socket.off("end-game-success", handleEndGameSuccess)
      socket.off("end-game-auth-error", handleEndGameAuthError)
    }
  }, [socket])

  return (
    <>
      <div className="flex justify-center">
        <button 
          className="text-white bg-red-600 cursor-pointer hover:bg-red-500 text-xl font-bold px-2 py-1 rounded-sm"
          onClick={() => setOpenEndGameModal(true)}
        >
          End Game
        </button>
      </div>
    </>
  )
}