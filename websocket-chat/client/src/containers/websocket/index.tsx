import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createContext } from "react";
import { BiErrorCircle } from "react-icons/all";
import { getWebsocketState } from "./state";
import {
  ConnectedClient,
  messageFun,
  WebsocketsContextState,
  WsMessage,
  WsMessageType,
} from "./types";

const inital: WebsocketsContextState = {clients:[]};

const WebsocketsContext = createContext<WebsocketsContextState>(inital);

type Props = {
  children: any;
};

export const WebsocketsProvider: React.FC<Props> = ({ children }) => {
  const [state, setstate] = useState<WebsocketsContextState>(inital);
  const [conn, setConn] = useState<WebSocket>();
  const onMessageReceivedRef = React.useRef<messageFun | null>();
  const onMessageReceived = onMessageReceivedRef.current;
  const addr = "ws://localhost:8080/chat";
  const updateState = (nwState: Partial<WebsocketsContextState>) => {
    setstate((prevState) => {
      return { ...prevState, ...nwState };
    });
  };
  useEffect(() => {
    let cn = new WebSocket(addr);
    setConn(cn);
    return () => {
      if (cn) {
        cn.close();
      }
    };
  }, []);
  useEffect(() => {
    if (conn) {
      conn.onopen = () => {
        let ws: WsMessage = {
          id: Date.now(),//message id 
          message_type: WsMessageType.INFO,
          content: "hassan",
          content_type: "text",
        };
        conn.send(JSON.stringify(ws));
        setstate({
          ...state,
          conn,
          stateDescription: "connected",
          stateId: WebSocket.OPEN,
        });
      };
      conn.onmessage = (ev) => {
        handleRecivedMessage(ev);
      };
      conn.onerror = (ev) => {
        conn.close();
        updateState({ stateId: conn.readyState });
      };
      conn.onclose = (cEvt) => {
        updateState({});
        console.log("connection closed");
        console.dir(cEvt);
        setTimeout(() => {
          let cn = new WebSocket(addr);
          setConn(cn);
        }, 1000);
      };
    }
  }, [conn]);
  const sendMessage = (m: WsMessage) => {
    if (!conn) {
      return;
    }
    if (!m.id) {
      m.id = Date.now();
    }
    conn.send(JSON.stringify(m));
  };

  const registerOnMessageRecived = useCallback(
    (w: messageFun | null) => {
      onMessageReceivedRef.current = w;
    },
    [onMessageReceivedRef]
  );

  const handleRecivedMessage = useCallback(
    (s: MessageEvent<any>) => {
      let ws: WsMessage | null = null;
      try {
        ws = JSON.parse(s.data);
        if (ws) {
          if (ws?.message_type == WsMessageType.CONNECTED_CLIENTS) {
            updateState({clients:ws.clients||[]})
          } else {
            if (onMessageReceived) {
              onMessageReceived(ws);
            }
          }
        }
      } catch (ex) {
        if (onMessageReceived) {
          onMessageReceived({
            message_type: WsMessageType.CHAT,
            id: 0,
            content: s.data,
          });
        }
      }
    },
    [onMessageReceived]
  );
  const memo = useMemo(() => {
    return { ...state, sendMessage, registerOnMessageRecived };
  }, [state, conn, sendMessage]);
  const stateDescription = getWebsocketState(conn?.readyState);
  return (
    <WebsocketsContext.Provider value={memo}>
      <>
        <div
          style={{
            position: "fixed",
            zIndex: 1111,
            background: stateDescription.color,
            display: "inline-block",
          }}
        >
          {conn?.readyState}-{stateDescription.describtion}
          <BiErrorCircle />
        </div>
        {children}
      </>
    </WebsocketsContext.Provider>
  );
};

export const useWebsockets = () => useContext(WebsocketsContext);
