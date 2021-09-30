import "./css/App.css";

import { useCallback, useEffect, useState } from "react";

import { useWebsockets } from "./containers/websocket";
import { useChat } from "./containers/chat-container";
import { WsMessage } from "./containers/websocket/types";
import { IChatItem } from "./types";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

export const MapApp = () => {
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
          date: ws.date,
          wsMessage: ws,
        });
      } else {
        console.log("skiping");
        console.dir({ addMessage, ws });
      }
    },
    [addMessage]
  );
  let filteredMessageList = messageList;
  if (client) {
    let id = client.id;
    filteredMessageList = messageList.filter(
      (a) => a.wsMessage?.from == id || a.wsMessage?.to == id
    );
  }
  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[51.505, -0.09]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
};
