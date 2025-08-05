"use client"

import { useSocket } from "@/app/context/SocketProvider"
import { PieceColor } from "@/app/types/global.enums"
import { useState, useRef, useEffect, useCallback } from "react"

interface ChatData {
  senderid: string
  text: string
  time: string
}

interface ChatPayload {
  gameid: string
  senderid: string
  text: string
  timestamp: number
}

interface ChatResult {
  senderid: string
  text: string
  timestamp: number
}

interface MultiplayerChatProps {
  newPlayerJoined: boolean
}

export default function MultiplayerChat(props: MultiplayerChatProps) {

  const {newPlayerJoined} = props

  const socket = useSocket()

  const [gameId, setGameId] = useState<string | null>(null)
  const [playerId, setPlayerId] = useState<string | null>(null)
  const [color, setColor] = useState<PieceColor | null>(null)

  const [message, setMessage] = useState<string>("")
  const [messages, setMessages] = useState<Array<ChatData>>([])
  
  const messagesEndRef = useRef<HTMLDivElement>(null)

  function formatTime(timestamp: number): string {
    const date = new Date(timestamp)

    return date.toLocaleTimeString("en-us", {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const handleChatSuccess = useCallback((payload: ChatResult) => {
    const time = formatTime(payload.timestamp)
    
    const newMsg = {
      senderid: payload.senderid,
      text: payload.text,
      time: time
    }

    setMessages(prev => [...prev, newMsg])
    setMessage("")
  }, [])

  useEffect(() => {
    if(!socket) return

    socket.on("chat-success", handleChatSuccess)

    return () => {
      socket.off("chat-success", handleChatSuccess)
    }

  }, [])

  useEffect(() => {
    async function initializeChat() {
      let storedPlayerId: string | null = localStorage.getItem("playerid")
      let storedGameId: string | null = localStorage.getItem("gameid")
      const storedColor: string | null = localStorage.getItem("color")
      const color: PieceColor | null = storedColor === PieceColor.WHITE || storedColor === PieceColor.BLACK ? storedColor : null

      if(!storedPlayerId || storedPlayerId === "undefined") {
        storedPlayerId = null
      }

      if(!storedGameId || storedGameId === "undefined") {
        storedGameId = null
      }

      setPlayerId(storedPlayerId)
      setGameId(storedGameId)
      setColor(color)
      
      
      const url: string | undefined = process.env.NEXT_PUBLIC_API_URL + `/chat?gameid=${storedGameId}`

      if(!url) {
        console.error(`Invalid URL: ${url}`)
        return;
      }

      try{
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        })

        if(!response.ok) {
          throw new Error(`HTTP status error: ${response.status}`)
        }

        const data: Array<ChatResult> = await response.json()

        const frontendChat: Array<ChatData> = data.map((msg: ChatResult) => {
          return {
            senderid: msg.senderid,
            text: msg.text,
            time: formatTime(msg.timestamp)
          }
        })

        setMessages(frontendChat)
      } catch(e) {
        console.error(e)
      }
    }

    initializeChat()
  }, [newPlayerJoined])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = () => {
    if (!message.trim()) return
    
    if(!playerId || !gameId) return

    if(!socket) return

    const payload: ChatPayload = {
      gameid: gameId,
      senderid: playerId,
      text: message,
      timestamp: Date.now()
    }

    socket.emit("chat", payload)
  }

  return (
    <div className="flex flex-col bg-gray-800 rounded-lg shadow-md h-full max-h-[550px] min-h-[500px]">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Game Chat</h2>
        <div className="flex space-x-2">
          <button 
            onClick={scrollToBottom}
            className="text-sm p-1 rounded bg-gray-700 hover:bg-gray-600"
            title="Scroll to bottom"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Online</span>
          </div>
        </div>
      </div>
      
      {/* Messages container with fixed height */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`flex ${msg.senderid === playerId ? "justify-end" : "justify-start"}`}
          >
            <div 
              className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${msg.senderid === playerId
                ? "bg-blue-500 text-white rounded-br-none" 
                : "bg-gray-700 text-white rounded-bl-none"}`}
            >
              {msg.senderid !== playerId && (
                <div className="font-medium text-sm mb-1">{color === PieceColor.WHITE ? PieceColor.BLACK.toUpperCase() : PieceColor.WHITE.toUpperCase()}</div>
              )}
              <div>{msg.text}</div>
              <div className="text-xs opacity-70 text-right mt-1">
                {msg.time}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 cursor-pointer bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={!message.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}