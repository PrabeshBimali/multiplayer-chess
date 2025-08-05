import { useSocket } from "@/app/context/SocketProvider"

interface EndGameModalProps {
  setOpenEndGameModal: React.Dispatch<React.SetStateAction<boolean>>
}

export default function EndGameModal(props: EndGameModalProps) {

  const socket = useSocket()

  const {setOpenEndGameModal} = props

  function endGame() {
    if(!socket) return

    const gameid = localStorage.getItem("gameid")
    const playerid = localStorage.getItem("playerid")

    if(!gameid || gameid === "undefined") {
      console.error(`Gameid is not defined`)
      return
    }

    if(!playerid || playerid === "undefined") {
      console.error(`Playerid is not defined`)
      return
    }

    socket.emit("end-game", {
      gameid, playerid
    })

  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-90"></div>
        <div className="relative p-6 rounded-xl shadow-xl flex flex-col gap-4 items-center bg-gray-800">
          <h2 className="text-md font-semibold text-white flex items-center">Do you want to End this Game?</h2>
          <div className="flex gap-5">
            <button 
              className="text-white bg-red-600 cursor-pointer hover:bg-red-500 text-xl font-bold px-2 py-1 rounded-sm"
              onClick={endGame}
            >
              Yes
            </button>

            <button 
              className="text-white bg-gray-600 cursor-pointer hover:bg-gray-500 text-xl font-bold px-2 py-1 rounded-sm"
              onClick={() => setOpenEndGameModal(false)}
            >
              Cancel
            </button>
          </div>
      </div>
    </div>
  )
}