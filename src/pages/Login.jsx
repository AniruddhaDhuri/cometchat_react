import React, { useState } from "react";
import { CometChat } from "@cometchat-pro/chat";
import { AUTH_KEY } from "../cometChatInit";

/**
 * Login component:
 * - enter a UID (unique user id)
 * - will attempt to login; if user doesn't exist, createUser then login
 */

function Login({ onLogin }) {
  const [uid, setUid] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setErr("");
    if (!uid) return setErr("Enter a UID (eg. alice)");

    setLoading(true);
    try {
      // Try login
      const loggedInUser = await CometChat.login(uid, AUTH_KEY);
      console.log("Logged in:", loggedInUser);
      onLogin(loggedInUser);
    } catch (loginErr) {
      console.warn("Login failed, trying to create user", loginErr);
      try {
        // Create user then login
        const newUser = new CometChat.User(uid);
        newUser.setName(uid);
        const created = await CometChat.createUser(newUser, AUTH_KEY);
        console.log("User created:", created);
        const loggedInUser = await CometChat.login(uid, AUTH_KEY);
        onLogin(loggedInUser);
      } catch (createErr) {
        console.error("Create/Login failed:", createErr);
        setErr("Could not login/create user: " + (createErr.message || createErr));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-card">
      <h2>CometChat — Login / Create user</h2>
      <form onSubmit={handleLogin}>
        <input
          placeholder="UID (eg. alice)"
          value={uid}
          onChange={(e) => setUid(e.target.value.trim())}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Working..." : "Login / Create"}
        </button>
      </form>
      {err && <div className="error">{err}</div>}
      <p className="hint">
        Use different UID values (alice, bob) in different browser windows to test chat.
      </p>
    </div>
  );
}

export default Login;
