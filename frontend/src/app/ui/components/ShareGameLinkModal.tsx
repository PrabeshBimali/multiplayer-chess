import { useToast } from "@/app/context/ToastProvider";
import React from "react";

interface ShareGameLinkModalProps {
  setOpenShareGameLinkModal: React.Dispatch<React.SetStateAction<boolean>>
  multiplayerGameCode: string
}

export default function ShareGameLinkModal(props: ShareGameLinkModalProps) {

  const { addToast } = useToast()

  const {setOpenShareGameLinkModal, multiplayerGameCode} = props
  const url = `${window.location.origin}/game/${multiplayerGameCode}`

  function closeModal() {
    setOpenShareGameLinkModal(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative p-6 rounded-xl shadow-xl flex flex-col gap-4 items-center bg-gray-800">
      <h2 className="text-xl font-semibold text-white">Share the Link!</h2>
         <div className="flex items-center gap-2 w-full">
          <input
            type="text"
            readOnly
            value={url} // Replace with your actual link variable
            className="flex-1 px-3 py-2 rounded-lg bg-gray-700 text-white text-sm"
          />
          <button
            onClick={() => {
              navigator.clipboard.writeText(url);
              addToast("Link Copied!", "success", 2000)
            }}
            className="px-3 py-2 cursor-pointer bg-lime-600 hover:bg-lime-500 text-white text-sm rounded-lg"
          >
            Copy
          </button>
    </div>
        <p className="text-xs text-gray-300 tracking-wide">First player to join the link will be your opponent</p>
        <button 
          className="text-white bg-red-600 cursor-pointer hover:bg-red-500 text-xl font-bold px-2 py-1 rounded-sm"
          onClick={closeModal}
        >
            Close
        </button>
      </div>
    </div>
  )
}