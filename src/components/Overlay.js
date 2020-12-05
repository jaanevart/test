import { ref } from "../deps/vue.js";
import { useUser, events, IconMute, IconUnmute } from "../deps/live.js";

export default {
  components: { IconMute, IconUnmute },
  setup() {
    const muted = ref(true);
    const camera = ref(false);

    const onMute = () => {
      muted.value = true;
      events.emit("mute");
    };

    const onUnmute = () => {
      muted.value = false;
      events.emit("unmute");
    };

    const onCameraon = () => {
      camera.value = true;
      events.emit("cameraon");
    };

    const onCameraoff = () => {
      camera.value = false;
      events.emit("cameraoff");
    };

    const { userName } = useUser();

    return {
      muted,
      onMute,
      onUnmute,
      camera,
      onCameraon,
      onCameraoff,
      userName,
    };
  },
  template: `
  <div
    style="
      position: fixed;
      top: 16px;
      right: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    "
  >
  </div>
  <div
    style="
      position: fixed;
      bottom: 16px;
      right: 16px;
      left: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    ">
    <IconMute v-if="muted" @click="onUnmute" />
    <IconUnmute v-if="!muted" @click="onMute" />
    <input v-model="userName" style="width: 300px" />
    <button v-if="camera" @click="onCameraoff">Stop camera</button>
    <button v-if="!camera" @click="onCameraon">Start camera</button>
  </div>  
  `,
};
