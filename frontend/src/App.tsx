import { useState, useEffect } from "react";
import NickInput from "./components/NickInput";
import UserList from "./components/UserList";
import ChatWindow from "./components/ChatWindow";
import MessageInput from "./components/MessageInput";
import { useSocket } from "./hooks/useSocket";
import { Toast } from "./components/Toast";

type ToastMessage = {
  text: string;
  fromUser: string;
} | null;

function App() {
  const [nick, setNick] = useState<string | null>(null);
  const [nickSet, setNickSet] = useState(false);
  const {
    socket,
    users,
    messages,
    selectedUser,
    setSelectedUser,
    sendMessage,
  } = useSocket(nick);

  const [toastMessage, setToastMessage] = useState<ToastMessage>(null);

  const [isMobile, setIsMobile] = useState<boolean>(false);
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    function onResize() {
      setIsMobile(window.innerWidth < 768);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const [showUsers, setShowUsers] = useState<boolean>(true);
  useEffect(() => {
    setShowUsers(!isMobile);
  }, [isMobile]);

  const handleSetNick = (nickValue: string) => {
    socket.emit("setNick", nickValue);
  };

  useEffect(() => {
    socket.on("nickSet", (assignedNick: string) => {
      setNick(assignedNick);
      setNickSet(true);
    });

    socket.on("nickError", (msg: string) => {
      alert(msg);
      setNickSet(false);
      setNick(null);
    });

    socket.on("receiveMessage", (msg) => {
      if (msg.from && msg.from !== nick) {
        setToastMessage({
          text: `NUEVO MENSAJE de ${msg.from}`,
          fromUser: msg.from,
        });
      }
    });

    return () => {
      socket.off("nickSet");
      socket.off("nickError");
      socket.off("receiveMessage");
    };
  }, [socket, nick]);

  useEffect(() => {
    if (selectedUser && nick) {
      socket.emit("getMessages", { withUser: selectedUser });
    }
  }, [selectedUser, nick, socket]);

  const handleSendMessage = (msg: string) => {
    sendMessage(msg);
  };

  const handleNotificationClick = () => {
    if (toastMessage) {
      setSelectedUser(toastMessage.fromUser);
      setToastMessage(null);
      if (isMobile) setShowUsers(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        fontFamily: "sans-serif",
        backgroundColor: "#fff",
        position: "relative",
      }}
    >
      {!nickSet ? (
        <div style={{ width: "100%", maxWidth: 400, padding: 20 }}>
          <NickInput onSetNick={handleSetNick} />
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            height: "100vh",
            width: "100vw",
            overflow: "hidden",
          }}
        >
          {(!isMobile || showUsers) && (
            <div
              style={{
                flexBasis: isMobile ? "100%" : "20%",
                flexShrink: 0,
                borderRight: isMobile ? "none" : "1px solid #ccc",
                padding: 10,
                boxSizing: "border-box",
                height: "100vh",
                overflowY: "auto",
                backgroundColor: "#f9f9f9",
              }}
            >
              {isMobile && nickSet && (
                <button
                  onClick={() => setShowUsers(false)}
                  style={{
                    marginBottom: 10,
                    padding: "6px 12px",
                    borderRadius: 6,
                    border: "1px solid #ccc",
                    backgroundColor: "#eee",
                    cursor: "pointer",
                  }}
                  aria-label="Cerrar lista de usuarios"
                >
                  ← Usuarios
                </button>
              )}

              <UserList
                users={users}
                selectedUser={selectedUser}
                onSelectUser={setSelectedUser}
              />
            </div>
          )}

          {/* Chat */}
          <div
            style={{
              flexGrow: 1,
              flexBasis: isMobile ? (showUsers ? "0%" : "100%") : "80%",
              display: "flex",
              flexDirection: "column",
              height: "100vh",
              boxSizing: "border-box",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {isMobile && nickSet && !showUsers && (
              <button
                onClick={() => setShowUsers(true)}
                style={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  zIndex: 10,
                  padding: "6px 12px",
                  borderRadius: 6,
                  border: "1px solid #ccc",
                  backgroundColor: "#eee",
                  cursor: "pointer",
                }}
                aria-label="Mostrar lista de usuarios"
              >
                Usuarios →
              </button>
            )}

            <ChatWindow messages={messages} currentNick={nick} />
            {nickSet && selectedUser && (
              <MessageInput onSendMessage={handleSendMessage} />
            )}
          </div>
        </div>
      )}

      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
          duration={3000} 
          onClick={handleNotificationClick}
        />
      )}
    </div>
  );
}

export default App;
