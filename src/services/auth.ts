import axios from "axios";

const BASE_URL = process.env.LOCAL_BACKEND_URL;
const BOT_UID = process.env.BOT_UID;

type UserAuth = {
  [discordID: string]: {
    uid: string;
  };
};

let cache: UserAuth = {};

export const getUserUID = async (discordName: string, discordID: string) => {
  const params = {
    botUID: BOT_UID,
    discordName,
    discordID,
  };
  if (cache[discordID] != null) {
    console.log("cached, ", cache[discordID].uid);
    return cache[discordID].uid;
  }
  const response = await axios.get(`${BASE_URL}/botauth`, { params });
  cache[discordID] = { uid: response.data.authuid };
  console.log("not cached, ", response.data.authuid)
  return response.data.authuid;
};
