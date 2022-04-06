import React, { useContext, useEffect, useState } from "react";
import io from "socket.io-client";

const SocketContext = React.createContext();

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ id, nickname, children }) {
  const [socket, setSocket] = useState();

  useEffect(() => {
    const newSocket = io("https://chat-flud.herokuapp.com", {
      query: { id, nickname },
      extraHeaders: {
        ContentType: "application/json",
      },
    });
    setSocket(newSocket);

    return () => newSocket.close();
  }, [id, nickname]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
