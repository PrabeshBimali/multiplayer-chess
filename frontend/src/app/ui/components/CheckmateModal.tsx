import { PieceColor } from "@/app/types/global.enums";
import Link from "next/link";

interface CheckmateModalProps {
  playerColor: PieceColor
  checkmateColor: PieceColor,
  setOpenCheckmateModal: React.Dispatch<React.SetStateAction<boolean>>
} 


export default function CheckmateModal(props: CheckmateModalProps) {

  const { playerColor, checkmateColor, setOpenCheckmateModal } = props

  function closeModal() {
    setOpenCheckmateModal(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black opacity-90"></div>
        <div className="relative p-6 rounded-xl shadow-xl flex flex-col gap-4 items-center bg-gray-800">
        <h2 className="text-xl font-semibold text-white flex items-center">
          {checkmateColor.toUpperCase()} King Checkmate
        </h2>
        <h2 className="text-md font-semibold text-white">
          {checkmateColor === playerColor ? "You Lost!" : "You Won!"}
        </h2>
        <button
          className="bg-lime-600 text-white font-bold text-xl cursor-pointer hover:bg-lime-500 px-3 py-1 rounded-sm"
          onClick={closeModal}
        >
          ok
        </button>
        <Link href="/" className="text-blue-500 hover:text-blue-600 cursor-pointer text-sm">Go back</Link>
      </div>
    </div>
  )
}