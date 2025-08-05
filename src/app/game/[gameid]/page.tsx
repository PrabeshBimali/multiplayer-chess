"use client"

import { useSocket } from "@/app/context/SocketProvider"
import { PieceColor } from "@/app/types/global.enums"
import EndGameModal from "@/app/ui/components/EndGameModal"
import GameNotFoundModal from "@/app/ui/components/GameNotFoundModal"
import JoinNewGameModal from "@/app/ui/components/JoinNewGameModal"
import MultiplayerChat from "@/app/ui/components/multiplayer-chess/MultiplayerChat"
import MultiplayerChessBoard from "@/app/ui/components/multiplayer-chess/MultiplayerChessBoard"
import MultiplayerInfo from "@/app/ui/components/multiplayer-chess/MultiplayerInfo"
import WaitingForOpponentToJoinModal from "@/app/ui/components/WaitingForOpponentToJoinModal"
import  { useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function Page() {
  const socket = useSocket()
  const params = useParams()
  const [openWaitingForOpponentToJoinModal, setOpenWaitingForOpponentToJoinModal] = useState<boolean>(false)
  const [openJoinNewGameModal, setOpenJoinNewGameModal] = useState<boolean>(false)
  const [newPlayerJoined, setNewPlayerJoined] = useState<boolean>(false)
  const [openGameNotFoundModal, setOpenGameNotFoundModal] = useState<boolean>(false)
  const [openEndGameModal, setOpenEndGameModal] = useState<boolean>(false)
  const [pageLoading, setPageLoading] = useState<boolean>(true)
  const [errorWhenJoining, setErrorWhenJoining] = useState<boolean>(false)
  const [colorForJoiningPlayer, setColorForJoiningPlayer] = useState<PieceColor | null>(null)
  const [gameid, setGameid] = useState<string>("")

  useEffect(() => {
    if (!socket) return
    

    const handleGameJoin = (gameid: string, playerid: string) => {
      socket.emit("join-game", {gameid, playerid})
    }

    const gameid = localStorage.getItem("gameid")
    const playerid = localStorage.getItem("playerid")

    if(gameid && playerid) {
      handleGameJoin(gameid, playerid)
    }
  }, [socket])

  useEffect(() => {
    if(!params.gameid) return
    
    const gameId = params.gameid
    setGameid(params.gameid.toString())

    async function joinNewGame() {
      
      const url: string | undefined = process.env.NEXT_PUBLIC_API_URL + "/join-new-game"

      if(!url) {
        console.error(`Invalid URL: ${url}`)
        return;
      }

      let storedPlayerId: string | null = localStorage.getItem("playerid")

      if(!storedPlayerId || storedPlayerId === "undefined") {
        storedPlayerId = null
      }

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            gameid: gameId,
            playerid: storedPlayerId
          })
        })

        if(response.status === 404) {
          setOpenGameNotFoundModal(true)
          setErrorWhenJoining(true)
          return
        }

        if(response.status === 204) {
          setOpenWaitingForOpponentToJoinModal(true)
          setErrorWhenJoining(true)
          return
        }

        // means game has already started
        if(response.status === 403) {
          return
        }

        if(response.status === 200) {
          const data = await response.json()
          setColorForJoiningPlayer(data.color)
          setOpenJoinNewGameModal(true)
          setErrorWhenJoining(false)
          return
        }

        if(!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`)
        }

      } catch(e) {
        console.error(e)
        setErrorWhenJoining(true)
      } finally {
        setPageLoading(false)
      }
    }

    joinNewGame()

  }, [gameid])

  return (
    <>
      {openEndGameModal ? <EndGameModal setOpenEndGameModal={setOpenEndGameModal}/> : ""}
      {openGameNotFoundModal ? <GameNotFoundModal/> : ""}
      {openWaitingForOpponentToJoinModal ? <WaitingForOpponentToJoinModal/> : ""}
      {openJoinNewGameModal ? 
        <JoinNewGameModal 
          color={colorForJoiningPlayer} 
          gameid={gameid} 
          setOpenJoinNewGameModal={setOpenJoinNewGameModal}
          setNewPlayerJoined={setNewPlayerJoined}
        /> 
        : ""
      }
      {!pageLoading && !errorWhenJoining && 
        <div className="grid 2xl:grid-cols-3 grid-cols-1 gap-5 my-5 mx-5">
          <div className="order-3 2xl:order-1">
            <MultiplayerChat newPlayerJoined={newPlayerJoined}/>
          </div>
          <div className="order-1 2xl:order-2">
            <MultiplayerChessBoard
              newPlayerJoined={newPlayerJoined}
            />
          </div>
          <div className="order-2 2xl:order-3">
            <MultiplayerInfo setOpenEndGameModal={setOpenEndGameModal}/>
          </div>
        </div>
      }
    </>
  )
}