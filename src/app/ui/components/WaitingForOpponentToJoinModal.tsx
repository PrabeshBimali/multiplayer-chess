export default function WaitingForOpponentToJoinModal() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black opacity-90"></div>
        <div className="relative p-6 rounded-xl shadow-xl flex flex-col gap-4 items-center bg-gray-800">
        <h2 className="text-xl font-semibold text-white flex items-center">Waiting For Opponent to Join
          <span className="ml-2 flex space-x-1">
            <span className="animate-bounce [animation-delay:0s]">.</span>
            <span className="animate-bounce [animation-delay:0.2s]">.</span>
            <span className="animate-bounce [animation-delay:0.4s]">.</span>
          </span>
        </h2>
        <p className="text-white text-xs">
          (please refresh the page if opponent has joined)
        </p>
      </div>
    </div>
  )
}