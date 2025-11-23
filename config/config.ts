import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra ?? {};

export const config = {
  API_BASE_URL: extra.API_BASE_URL as string,
  WS_BASE_URL: extra.WS_BASE_URL as string,
  DEFAULT_ROOMS: {
    KIT01: extra.DEFAULT_ROOM_KIT01 as string,
  },
} as const;

console.log(config);
