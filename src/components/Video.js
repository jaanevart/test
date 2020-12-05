import { ref } from "../deps/vue.js";

import { useHls, events } from "../deps/live.js";

export default {
  props: {
    src: {
      default: "",
    },
  },
  setup(props) {
    const muted = ref(true);

    events.on("mute", () => (muted.value = true));
    events.on("unmute", () => (muted.value = false));

    const videoRef = useHls(props.src);

    return { videoRef, muted };
  },
  template: `
  <video
    ref="videoRef"
    :muted="muted"
    inline
    autoplay
  />
  `,
};
