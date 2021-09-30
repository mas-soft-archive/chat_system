import "./css/App.css";

import { useCallback, useEffect, useState } from "react";

import { useWebsockets } from "./containers/websocket";
import { useChat } from "./containers/chat-container";
import { WsMessage } from "./containers/websocket/types";
import { ChatSidebar } from "./components/sidebar";
import { IChatItem } from "./types";
import { MessageList, Button } from "react-chat-elements";
import { ChatInput } from "./components/input";

export const App = () => {
  const { registerOnMessageRecived } = useWebsockets();
  const { addMessage, messageList } = useChat();
  const [client, setClient] = useState<IChatItem | null>();
  useEffect(() => {
    if (registerOnMessageRecived) {
      registerOnMessageRecived(handMessage);
    }
    return () => {
      if (registerOnMessageRecived) {
        registerOnMessageRecived(null);
      }
    };
  }, [registerOnMessageRecived]);
  const handMessage = useCallback(
    (ws: WsMessage) => {
      if (addMessage && ws) {
        addMessage({
          id: ws.id,
          text: ws.content,
          position: ws.from == ws.my_id ? "left" : "right",
          title: ws.from?.toString(),
          date:ws.date,
          wsMessage:ws
        });
      } else {
        console.log("skiping");
        console.dir({ addMessage, ws });
      }
    },
    [addMessage]
  );
  let filteredMessageList=messageList;
  if(client){
    let id=client.id;
    filteredMessageList=messageList.filter(a=>(a.wsMessage?.from==id) || (a.wsMessage?.to==id));
  }
  return (
    <div className="container">
      <ChatSidebar />
      <div className="right-panel">
        <MessageList
          className="message-list"
          lockable={true}
          downButtonBadge={10}
          dataSource={filteredMessageList}
        />
        <ChatInput />
      </div>
    </div>
  );
};

export default App;
