"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"

const SocketContext = createContext<Socket | null>(null)

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_API_URL, {
      autoConnect: true,
    })
    
    setSocket(socketInstance)

    socketInstance.on("connect", () => {
      console.log("Socket connected:", socketInstance.id)
    })

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected")
    })

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}

export function useSocket(): Socket | null {
  return useContext(SocketContext)
}