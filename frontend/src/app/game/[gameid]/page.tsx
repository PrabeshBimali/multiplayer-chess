"use client"

import { PieceColor } from "@/app/types/global.enums"
import GameNotFoundModal from "@/app/ui/components/GameNotFoundModal"
import JoinNewGameModal from "@/app/ui/components/JoinNewGameModal"
import WaitingForOpponentToJoinModal from "@/app/ui/components/WaitingForOpponentToJoinModal"
import  {useParams} from "next/navigation"
import { useEffect, useState } from "react"

export default function Page() {
  const router = useParams()
  const [openWaitingForOpponentToJoinModal, setOpenWaitingForOpponentToJoinModal] = useState(false)
  const [openJoinNewGameModal, setOpenJoinNewGameModal] = useState(false)
  const [openGameNotFoundModal, setOpenGameNotFoundModal] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [colorForJoiningPlayer, setColorForJoiningPlayer] = useState<PieceColor | null>(null)
  const [gameid, setGameid] = useState<string>("")


  useEffect(() => {
    if(!router.gameid) return
    
    setGameid(router.gameid.toString())

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
            gameid: gameid,
            playerid: storedPlayerId
          })
        })

        if(response.status === 404) {
          setOpenGameNotFoundModal(true)
          return
        }

        if(response.status === 204) {
          setOpenWaitingForOpponentToJoinModal(true)
          return
        }

        if(response.status === 200) {
          const data = await response.json()
          setColorForJoiningPlayer(data.color)
          setOpenJoinNewGameModal(true)
          return
        }

      } catch(e) {
        console.error(e)
      } finally {
        setPageLoading(false)
      }
    }

    joinNewGame()

  }, [gameid])

  return (
    <>
      {openGameNotFoundModal ? <GameNotFoundModal/> : ""}
      {openWaitingForOpponentToJoinModal ? <WaitingForOpponentToJoinModal/> : ""}
      {openJoinNewGameModal ? <JoinNewGameModal color={colorForJoiningPlayer} gameid={gameid}/> : ""}
      {pageLoading ? "" : 
        <div>
          {gameid}
        </div>
      }
    </>
  )
}