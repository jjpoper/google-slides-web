<template>
  <div class="page">
    <div class="title--text">Add a cue</div>
    <div class="prompt--area">
      <div
        class="prompt--item"
        v-for="(item, index) in currentShowPrompts"
        :key="index"
        @mouseenter="mousein(index)"
        @mouseleave="mouseLeave()"
      >
        <div
          class="mack--item"
          v-if="currentPromptIndex == index"
          @click="addPPTItem(item)"
        >
          Click to add
        </div>
        <div class="ppt--content">
          <div class="ppt--image">
            <img
              src="../../assets/newprompt_img.png"
              width="195"
              height="150"
              style="margin-top: 10px"
            />
          </div>
          <div class="prompt--name">{{ item.type }}</div>
        </div>
      </div>
    </div>
    <img
      src="../../assets/picture/close_icon.png"
      style="
        width: 30px;
        height: 30px;
        cursor: pointer;
        position: absolute;
        top: 20px;
        right: 20px;
      "
      @click="closeBtn"
    />

    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      width="68"
      height="68"
      viewBox="0 0 68 68"
      style="position: absolute; top: 30%; left: 10px; cursor: pointer"
      @click="leftPage"
      class="b"
    >
      <defs>
        <filter
          id="a"
          x="0"
          y="0"
          width="68"
          height="68"
          filterUnits="userSpaceOnUse"
        >
          <feOffset dy="3" input="SourceAlpha" />
          <feGaussianBlur stdDeviation="3" result="b" />
          <feFlood flood-color="#7a7a7a" flood-opacity="0.161" />
          <feComposite operator="in" in2="b" />
          <feComposite in="SourceGraphic" />
        </filter>
      </defs>
      <g transform="translate(9 6)">
        <g class="c" transform="matrix(1, 0, 0, 1, -9, -6)">
          <path
            class="a"
            d="M25,0A25,25,0,1,1,0,25,25,25,0,0,1,25,0Z"
            transform="translate(9 6)"
          />
        </g>
        <path
          d="M269.254,97.759l7.193-6.953a1.025,1.025,0,0,0,0-1.484,1.113,1.113,0,0,0-1.536,0l-7.96,7.7a1.025,1.025,0,0,0,0,1.483l7.96,7.7a1.112,1.112,0,0,0,1.536,0,1.024,1.024,0,0,0,0-1.483l-7.193-6.953"
          transform="translate(-246.765 -73.014)"
        />
      </g>
    </svg>

    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      width="68"
      height="68"
      viewBox="0 0 68 68"
      style="position: absolute; top: 30%; right: 10px; cursor: pointer"
      @click="rightPage"
      class="b"
    >
      <defs>
        <filter
          id="a"
          x="0"
          y="0"
          width="68"
          height="68"
          filterUnits="userSpaceOnUse"
        >
          <feOffset dy="3" input="SourceAlpha" />
          <feGaussianBlur stdDeviation="3" result="b" />
          <feFlood flood-color="#7a7a7a" flood-opacity="0.161" />
          <feComposite operator="in" in2="b" />
          <feComposite in="SourceGraphic" />
        </filter>
      </defs>
      <g transform="translate(11895 14721)">
        <g class="c" transform="matrix(1, 0, 0, 1, -11895, -14721)">
          <path
            class="a"
            d="M25,0A25,25,0,1,0,50,25,25,25,0,0,0,25,0Z"
            transform="translate(9 6)"
          />
        </g>
        <path
          d="M274.145,97.759l-7.193-6.953a1.025,1.025,0,0,1,0-1.484,1.113,1.113,0,0,1,1.536,0l7.96,7.7a1.025,1.025,0,0,1,0,1.483l-7.96,7.7a1.112,1.112,0,0,1-1.536,0,1.024,1.024,0,0,1,0-1.483l7.193-6.953"
          transform="translate(-12132.634 -14788.014)"
        />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.a {
  fill: rgba(255, 255, 255, 0.9);
}
.b {
  fill: gray;
}
.b:hover {
  fill: #15c39a;
}
.c {
  filter: url(#a);
}
.page {
  width: 1150px;
  height: 900px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 10px;
  position: relative;
}
.title--text {
  flex: 1;
  font-size: 22px;
  font-family: Arial;
  font-weight: 900;
  line-height: 20px;
  color: #070707;
  opacity: 1;
}
.prompt--name {
  height: 35px;
  font-size: 18px;
  font-family: Inter-Bold;
  line-height: 24px;
  color: #000000;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin-left: 10px;
  align-items: center;
  opacity: 1;
}
.ppt--content {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
.ppt--image {
  width: 100%;
  flex: 1;
}
.prompt--area {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin-top: 20px;
}
.prompt--item {
  width: 440px;
  height: 240px;
  background: #ffffff;
  border: 1px solid #e7e7e7;
  opacity: 1;
  border-radius: 6px;
  background-color: white;
  position: relative;
  margin-left: 85px;
}
.mack--item {
  width: 440px;
  height: 240px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  background: #000000;
  opacity: 0.5;
  border-radius: 5px;

  font-size: 22px;
  font-family: Arial;
  font-weight: normal;
  line-height: 20px;
  color: #ffffff;

  position: absolute;
  left: 0;
  top: 0;
}
</style>

<script>
export default {
  props: {
    addPPTItem: {
      type: Function,
    },
    closeBtn: {
      type: Function,
    },
  },
  data() {
    return {
      prompts: [
        { type: "text" },
        { type: "draw" },
        { type: "comment" },
        { type: "media" },
        { type: "text" },
        { type: "draw" },
        { type: "comment2" },
        { type: "media2" },
        { type: "text2" },
        { type: "draw2" },
        { type: "comment2" },
        { type: "media2" },
        { type: "text3" },
        { type: "draw3" },
        { type: "comment3" },
        { type: "media3" },
      ],
      currentShowPrompts: [],
      currentPromptIndex: -1,
      currentPage: 0,
    };
  },
  created() {
    for (let i = 0; i < 6; i++) {
      if (this.currentPage * 6 + i < this.prompts.length) {
        this.currentShowPrompts.push(this.prompts[this.currentPage * 6 + i]);
      }
    }
  },
  methods: {
    mousein(index) {
      this.currentPromptIndex = index;
    },
    mouseLeave() {
      this.currentPromptIndex = -1;
    },
    leftPage() {
      if (this.currentPage > 0) {
        this.currentShowPrompts = [];
        this.currentPage--;
        for (let i = 0; i < 6; i++) {
          if (this.currentPage * 6 + i < this.prompts.length) {
            this.currentShowPrompts.push(
              this.prompts[this.currentPage * 6 + i]
            );
          }
        }
      }
    },
    rightPage() {
      if (this.currentPage < this.prompts.length / 6 - 1) {
        this.currentShowPrompts = [];
        this.currentPage++;
        for (let i = 0; i < 6; i++) {
          if (this.currentPage * 6 + i < this.prompts.length) {
            this.currentShowPrompts.push(
              this.prompts[this.currentPage * 6 + i]
            );
          }
        }
      }
    },
  },
};
</script>