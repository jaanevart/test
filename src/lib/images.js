import {
  ref,
  onMounted,
  onUnmounted,
  computed,
} from "https://elektronstudio.github.io/live/src/deps/vue.js";

import {
  socket,
  createMessage,
  safeJsonParse,
  uuidv4,
  useSetInterval,
  fit,
  useUser,
} from "https://elektronstudio.github.io/live/src/lib/index.js";

const imageWidth = 100;
const imageHeight = 100;
const imageQuality = 0.8;
const imageUpdateFrequency = 1000;

export const useImages = (channel) => {
  const videoEl = ref(null);
  const canvasEl = ref(null);
  const context = ref(null);
  const image = ref(null);
  const images = ref({});
  const imagesLength = computed(() => Object.entries(images.value).length);
  const videoStarted = ref(false);

  const { userId, userName } = useUser();

  onMounted(() => {
    if (canvasEl.value) {
      context.value = canvasEl.value.getContext("2d");
      videoEl.value.addEventListener("loadedmetadata", ({ srcElement }) => {
        canvasEl.value.width = imageWidth;
        canvasEl.value.height = imageHeight;
      });
    }
  });

  const startVideo = () => {
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { frameRate: 10 } })
        .then((stream) => (videoEl.value.srcObject = stream))
        .catch((e) => console.log(e));
    }
  };

  const stopVideo = () => {
    videoEl.value.srcObject.getTracks().forEach((track) => track.stop());
    delete images.value[userId.value];
  };

  socket.addEventListener("message", ({ data }) => {
    const incomingMessage = safeJsonParse(data);
    if (
      incomingMessage &&
      incomingMessage.channel === channel &&
      incomingMessage.type === "IMAGE"
    ) {
      images.value[incomingMessage.userId] = incomingMessage;
    }
    if (
      incomingMessage &&
      incomingMessage.channel === channel &&
      incomingMessage.type === "IMAGE_LEAVE"
    ) {
      delete images.value[incomingMessage.userId];
    }
  });

  const uuid = uuidv4();

  const sendImageMessage = () => {
    const { x, y, width, height } = fit(
      imageWidth,
      imageHeight,
      videoEl.value.videoWidth,
      videoEl.value.videoHeight
    );
    context.value.drawImage(videoEl.value, x, y, width, height);

    const buffer = new Uint32Array(
      context.value.getImageData(
        0,
        0,
        canvasEl.value.width,
        canvasEl.value.width
      ).data.buffer
    );

    const outgoingMessage = createMessage({
      channel,
      type: "IMAGE",
      value: canvasEl.value.toDataURL("image/jpeg", imageQuality),
    });
    if (buffer.some((color) => color !== 0)) {
      socket.send(outgoingMessage);
    }

    const payload = {
      uuid,
      feed: channel,
      imgScaled: canvasEl.value.toDataURL("image/jpeg", imageQuality),
    };

    fetch("https://elektron.live/area51/upload.php", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  };

  const sendStartMessage = () => {
    const outgoingMessage = createMessage({
      channel: channel,
      type: "IMAGE_JOIN",
      userId: userId.value,
      userName: userName.value,
    });
    socket.send(outgoingMessage);
  };

  const sendStopMessage = () => {
    const outgoingMessage = createMessage({
      channel: channel,
      type: "IMAGE_LEAVE",
      userId: userId.value,
      userName: userName.value,
    });
    socket.send(outgoingMessage);
  };

  const onStart = () => {
    startVideo();
    sendStartMessage();
    videoStarted.value = true;
  };

  const onStop = () => {
    stopVideo();
    sendStopMessage();
    videoStarted.value = false;
    window.removeEventListener("beforeunload", onStop);
  };

  window.addEventListener("beforeunload", onStop);

  const images2 = computed(() =>
    Object.values(images.value).sort((a, b) => a.userId > b.userId)
  );

  const sendImageMessages = () =>
    useSetInterval(
      sendImageMessage,
      imagesLength,
      videoStarted,
      imageUpdateFrequency
    );

  return {
    videoEl,
    canvasEl,
    sendImageMessage,
    image,
    images,
    imagesLength,
    videoStarted,
    onStart,
    onStop,
    images2,
    sendImageMessages,
  };
};
