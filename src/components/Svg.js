import { ref, provide } from "../deps/vue.js";

export default {
  setup() {
    const width = 1000;
    const height = 1000;
    const viewBox = `${width / -2} ${height / -2} ${width} ${height}`;

    const svgRef = ref(null);
    const groupRef = ref(null);

    const mouseX = ref(0);
    const mouseY = ref(0);

    const onMousemove = (e) => {
      let point = svgRef.value.createSVGPoint();
      point.x = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
      point.y = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
      let ctm = groupRef.value.getScreenCTM();
      if ((ctm = ctm.inverse())) {
        point = point.matrixTransform(ctm);
      }
      mouseX.value = point.x;
      mouseY.value = point.y;
    };

    provide("mouse", { mouseX, mouseY });

    return {
      svgRef,
      groupRef,
      width,
      height,
      viewBox,
      onMousemove,
    };
  },
  template: `
  <svg
    ref="svgRef"
    xmlns="http://www.w3.org/2000/svg"
    :awidth="width"
    :aheight="height"
    :view-box.camel="viewBox"
    style="
      display: block;
      margin-bottom: 16px;
      position: fixed;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
    "
    @mousemove="onMousemove"
    @touchmove="onMousemove"
  >
    <g ref="groupRef">
      <slot />
    </g>
  </svg>
  `,
};
