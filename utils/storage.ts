import AsyncStorage from "@react-native-async-storage/async-storage";

interface Token {
  access_token: string;
  refresh_token: string;
}

export const getTokens = async (): Promise<Token | null> => {
  const tokens = await AsyncStorage.getItem("tokens");
  return tokens ? JSON.parse(tokens) : null;
};

export const setToken = async (access_token: string, refresh_token: string) => {
  await AsyncStorage.setItem("tokens", JSON.stringify({ access_token, refresh_token }));
};

export const removeToken = async () => {
  await AsyncStorage.removeItem("tokens");
};
