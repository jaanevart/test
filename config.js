export const channel = "hackaton";

export const channels = [channel, "hackaton_kristjan", "hackaton_hendrik"];

export const channelSources = channels.map(
  (c) => `https://elektron-live.babahhcdn.com/bb1150-le/${c}/index.m3u8`
);
