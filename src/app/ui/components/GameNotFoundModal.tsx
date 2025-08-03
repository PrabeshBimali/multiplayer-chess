import Link from "next/link";

export default function GameNotFoundModal() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black opacity-90"></div>
        <div className="relative p-6 rounded-xl shadow-xl flex flex-col gap-4 items-center bg-gray-800">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <span className="text-red-500 text-2xl mr-2">404</span>
          Game Not Found
        </h2>
        <Link href="/" className="text-blue-500 hover:text-blue-600 cursor-pointer text-sm">Go back</Link>
      </div>
    </div>
  )
}