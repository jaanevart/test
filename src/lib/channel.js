import {
  ref,
  onMounted,
  onUnmounted,
} from "https://elektronstudio.github.io/live/src/deps/vue.js";

import {
  socket,
  createMessage,
  safeJsonParse,
  useUser,
} from "https://elektronstudio.github.io/live/src/lib/index.js";

export const useChannel = (channel) => {
  const users = ref([]);
  const { userName } = useUser();

  socket.addEventListener("message", ({ data }) => {
    const message = safeJsonParse(data);
    if (message && message.type === "CHANNELS_UPDATED" && message.value) {
      const channelUsers = Object.entries(
        message.value[channel].users
      ).map(([userId, user]) => ({ ...user, userId }));
      users.value = channelUsers;
    }
    if (message && message.type === "RESET") {
      channels.value = [];
    }
  });

  const joinChannel = () => {
    const outgoingMessage = createMessage({
      type: "CHANNEL_JOIN",
      channel: channel,
      value: { userName: userName.value }, // TODO: Do we need it?
    });
    socket.send(outgoingMessage);
  };

  const leaveChannel = () => {
    const outgoingMessage = createMessage({
      type: "CHANNEL_LEAVE",
      channel: channel,
    });
    socket.send(outgoingMessage);
  };

  onMounted(() => {
    joinChannel();
    window.addEventListener("beforeunload", leaveChannel);
  });

  onUnmounted(() => window.removeEventListener("beforeunload", leaveChannel));

  return { users };
};
