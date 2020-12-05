import { channelSources } from "../../config.js";

import Video from "./Video.js";

export default {
  components: { Video },
  setup() {
    return { channelSources };
  },
  template: `
    <div
      v-for="(src, i) in channelSources" 
      style="
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
        mix-blend-mode: difference;
      "
    >
      <Video
        :src="src"
        :style="{
         width: 800 - (i * 300) + 'px',
         clipPath: 'circle(33%)'
        }"
      />
      <!--div
        :style="{border: '3px solid red', width: (channelSources.length - i * 10 + 100) + 'px', height: (channelSources.length - i * 10 + 100) + 'px'}"
      /-->
    </div>
  `,
};
