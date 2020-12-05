import { ref, inject, watch, computed } from "../deps/vue.js";

export default {
  props: ["x", "y"],
  setup(props, { emit }) {
    const { mouseX, mouseY } = inject("mouse");

    const mousePressed = ref(false);

    const onMousepress = () => {
      mousePressed.value = !mousePressed.value;
    };

    watch([() => mouseX.value, () => mouseY.value], () => {
      if (mousePressed.value) {
        emit("drag", { dragX: mouseX.value, dragY: mouseY.value });
      }
    });

    const transform = computed(() => `translate(${props.x},${props.y})`);

    const keyOffset = 3;

    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        emit("drag", { dragX: props.x - keyOffset, dragY: props.y });
      }
      if (e.key === "ArrowRight") {
        emit("drag", { dragX: props.x + keyOffset, dragY: props.y });
      }
      if (e.key === "ArrowUp") {
        emit("drag", { dragX: props.x, dragY: props.y - keyOffset });
      }
      if (e.key === "ArrowDown") {
        emit("drag", { dragX: props.x, dragY: props.y + keyOffset });
      }
    });

    return { onMousepress, transform };
  },
  template: `
  <g 
    :transform="transform"
    @mousedown="onMousepress"
    @touchstart="onMousepress"
    @mouseup="onMousepress"
    @touchend="onMousepress"
  >
    <slot />
  </g>
  `,
};
