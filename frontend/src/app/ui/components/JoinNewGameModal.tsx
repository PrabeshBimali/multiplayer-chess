import { PieceColor } from "@/app/types/global.enums"
import { useEffect, useState } from "react"
import { useSocket } from "@/app/context/SocketProvider"
import { useRouter } from "next/navigation"

interface JoinNewGameModalProps {
  color: PieceColor | null
  gameid: string
}


export default function JoinNewGameModal(props: JoinNewGameModalProps) {

  const { color, gameid } = props

  const socket = useSocket()
  const router = useRouter()

  const [joining, setJoining] = useState<boolean>(false)

  useEffect(() => {
    if (!socket) return

    const handleSuccess = ({ gameid, playerid, color }: any) => {
      console.log("Join Success", { gameid, playerid, color })

      localStorage.setItem("gameid", gameid)
      localStorage.setItem("playerid", playerid)
      localStorage.setItem("color", color)

      router.refresh()
      router.push(`/game/${gameid}`)
    }

    const handleFail = () => {
      alert("Failed to join game. Game might have already started.")
    }

    socket.on("join-success", handleSuccess)
    socket.on("join-fail", handleFail)

    return () => {
      socket.off("join-success", handleSuccess)
      socket.off("join-fail", handleFail)
    }
  }, [socket, router])

  const joinGame = () => {
    setJoining(true)
    if (!socket) return
    socket.emit("join-new-game", { gameid })
    setJoining(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black opacity-90"></div>
        <div className="relative p-6 rounded-xl shadow-xl flex flex-col gap-4 items-center bg-gray-800">
        <h2 className="text-xl font-semibold text-white flex items-center">Join New Game</h2>
        <p>Your Color: {color?.toUpperCase()}</p>
        <p>Game Type: Standard</p>
        <button 
          className="bg-lime-600 text-white font-bold text-xl cursor-pointer hover:bg-lime-500 p-2 rounded-sm"
          onClick={joinGame}
        >
          { joining ? "Joining..." : "Join Game" }
        </button>
      </div>
    </div>
  )
}