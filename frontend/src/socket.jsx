import { createContext, useMemo, useContext, useEffect } from "react";
import io from "socket.io-client";
import { server } from "./constants/frontendConstant.js";

const SocketContext = createContext();

const useSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
  const socket = useMemo(() => io(server, { withCredentials: true, autoConnect: false }), []);
  useEffect(() => {
    socket.connect();
    return () => socket.disconnect();
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export { SocketProvider, useSocket, useSocket as getSocket };
