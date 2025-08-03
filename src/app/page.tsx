"use client"
import { useState, useEffect } from "react";
import CreateNewGameModal from "./ui/components/CreateNewGameModal";
import { useRouter } from "next/navigation";
import ShareGameLinkModal from "./ui/components/ShareGameLinkModal";
import { useSocket } from "./context/SocketProvider";

export default function Home() {
  const socket = useSocket()
  
  const [openCreateGameModal, setOpenCreateGameModal] = useState<boolean>(false)
  const [openShareGameLinkModal, setOpenShareGameLinkModal] = useState<boolean>(false)
  const [multiplayerGameCode, setMultiplayerGameCode] = useState<string>("")
  const router = useRouter()

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
    
    socket.on("player-joined", ({gameid}) => {

      const storedGameId = localStorage.getItem("gameid")

      if(gameid === storedGameId) {
        router.push(`/game/${gameid}`)
      } 
    })

  }, [socket])

  function navigateToSinglePlayerChess() {
    router.push("/local-chess")
  }

  return (
    <> 
      {openCreateGameModal ? <CreateNewGameModal 
                                setOpenCreateGameModal={setOpenCreateGameModal} 
                                setOpenShareGameLinkModal={setOpenShareGameLinkModal}
                                setMultiplayerGameCode={setMultiplayerGameCode}
                              />
                            : ""
      }

      {openShareGameLinkModal ? <ShareGameLinkModal
                                  setOpenShareGameLinkModal={setOpenShareGameLinkModal}
                                  multiplayerGameCode={multiplayerGameCode} /> 
                                
                                : ""
      }
      <div className="flex justify-center items-center">
        <div className="bg-gray-800 p-10 flex flex-col gap-5">
          <button 
            className="cursor-pointer bg-lime-600 text-white font-bold text-xl p-3 rounded-sm"
            onClick={() => setOpenCreateGameModal(true)}
          >
            Create new game
          </button>
          <button 
            className="cursor-pointer bg-lime-600 text-white font-bold text-xl p-3 rounded-sm"
            onClick={navigateToSinglePlayerChess}
          >
            Play Single Player
          </button>
        </div>
      </div>
    </>
  );
}
