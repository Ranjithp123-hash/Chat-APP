import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { io } from "socket.io-client";
import  { createContext,useContext,useRef,useEffect } from  "react";

const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext);
};


export const SocketProvider = ({children}) => {
    const socket = useRef(null);

    const {userInfo} = useAppStore();

    useEffect(() => {
        if (userInfo){
            socket.current = io(HOST, {
                withCredentials:true,
                query:{userId:userInfo.id},
            });

            socket.current.on("connect", () =>    {
                console.log("Connected to server to socket server");
            });

            const handleRecieveMessage = (message) => {
              

                const {selectedChatData,selectedChatType,addMessage,addContactsInDMContacts } = useAppStore.getState();

                if (selectedChatType !== undefined && 
                    (selectedChatData._id  === message.sender._id || 
                    selectedChatData._id === message.recipient._id )
                )
                     {
                        // console.log("message rcv",message);
                        addMessage(message);
                }
                addContactsInDMContacts(message);

            }

            const handleReceiveChannelMessage = (message) => {
                const {selectedChatData,selectedChatType,addMessage,
                    addChannelInChannelList
                 } = useAppStore.getState();

                if (selectedChatType !== undefined && selectedChatData._id  === message.channelId){
                        // console.log("message rcv",message);
                        addMessage(message);
                }
                addChannelInChannelList(message);
            }
 
            socket.current.on("receiveMessage", handleRecieveMessage);
            socket.current.on("receive-channel-message", handleReceiveChannelMessage)

            return () => {
                socket.current.off("receiveMessage",handleRecieveMessage);
                socket.current.disconnect();
        }

        }

    },[userInfo]);

    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    )


}

