"use client"
import { useState } from "react";
import CreateNewGameModal from "./ui/components/CreateNewGameModal";
import { useRouter } from "next/navigation";
import ShareGameLinkModal from "./ui/components/ShareGameLinkModal";

export default function Home() {
  
  const [openCreateGameModal, setOpenCreateGameModal] = useState<boolean>(false)
  const [openShareGameLinkModal, setOpenShareGameLinkModal] = useState<boolean>(false)
  const [multiplayerGameCode, setMultiplayerGameCode] = useState<string>("")
  const router = useRouter()

  function navigateToSinglePlayerChess() {
    router.push("/chess")
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
