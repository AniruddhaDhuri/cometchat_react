import { CometChat } from "@cometchat-pro/chat";

export const APP_ID = "16724302934f2ae0b"; // your App ID
export const REGION = "IN"; // provided
export const AUTH_KEY = "5e518aff944b205b67d669f95f47e3bfebdacb08"; // your auth key

let initialized = false;

export async function initCometChat() {
  if (initialized) return CometChat;
  const appSetting = new CometChat.AppSettingsBuilder()
    .subscribePresenceForAllUsers()
    .setRegion(REGION)
    .build();

  try {
    await CometChat.init(APP_ID, appSetting);
    initialized = true;
    console.log("CometChat initialized", APP_ID, REGION);
    return CometChat;
  } catch (err) {
    console.error("CometChat init failed:", err);
    throw err;
  }
}
