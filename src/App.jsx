import React, { useEffect, useState } from "react";
import { initCometChat, AUTH_KEY } from "./cometChatInit";
import Login from "./pages/Login";
import Chat from "./pages/Chat";

function App() {
  const [user, setUser] = useState(null); // logged in CometChat user

  useEffect(() => {
    initCometChat().catch((e) => {
      console.error("Init error", e);
    });
  }, []);

  return (
    <div className="app-root">
      {!user ? (
        <Login onLogin={(u) => setUser(u)} />
      ) : (
        <Chat user={user} onLogout={() => setUser(null)} />
      )}
    </div>
  );
}

export default App;
