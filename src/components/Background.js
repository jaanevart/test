import { useAnimation, rotate, pol2car } from "../lib/index.js";

export default {
  setup() {
    // See easings at https://animejs.com/documentation/#pennerFunctions
    const angle = useAnimation({
      from: 0,
      to: 360,
      duration: 70 * 1000,
      easing: "linear"
    });
    const radius = useAnimation({
      from: 0,
      to: 300,
      duration: 14 * 1000,
      alternate: true,
      easing: "easeOutExpo"
    });
    return { rotate, pol2car, angle, radius };
  },
  template: `
    <!-- <circle
      v-for="r in 50"
      :r="r * 20 + 250"
      :stroke="'rgba(255,255,255,' + (r / 100) + ')'"
      fill="none"
    /> -->
    <g :transform="rotate(angle)">
    <line 
      v-for="a in 72"
      :x1="pol2car(a * 180, radius).x"
      :y1="pol2car(a * 180, radius).y"
      :x2="pol2car(a * 5 + 100, 1500).x"
      :y2="pol2car(a * 5 + 100, 1500).y"
      stroke="rgba(255,255,255,0.3)"
    />
    <line 
      v-for="a in 72"
      :x1="pol2car(a * radius, 180 ).x"
      :y1="pol2car(a * radius, 180).y"
      :x2="pol2car(a * 5 - 100, 1500).x"
      :y2="pol2car(a * 5 - 100, 1500).y"
      stroke="rgba(255,255,255,0.3)"
    />
    <line 
    v-for="a in 72"
    :x1="pol2car(a * 90, radius).x"
    :y1="pol2car(a * 90, radius).y"
    :x2="pol2car(a * 5 - 100, 2500).x"
    :y2="pol2car(a * 5 - 100, 2500).y"
    stroke="rgba(255,255,255,0.3)"
  />
  
    </g>
  `
};
