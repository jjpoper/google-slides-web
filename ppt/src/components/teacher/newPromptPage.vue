<template>
  <div class="page">
    <strong>Add a cue</strong>

    <div class="prompt--area">
      <div
        class="prompt--item"
        v-for="(item, index) in prompts"
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
          <div class="ppt--image"></div>

          <div class="prompt--name">item</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.prompt--name {
  display: flex;
  width: 100%;
  height: 50px;
  justify-content: center;
  align-items: center;
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
  background-color: aqua;
}
.page {
  width: 1200px;
  height: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-radius: 16px;
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
  width: 45%;
  height: 300px;
  background-color: white;
  position: relative;
  margin-left: 40px;
}
.mack--item {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  cursor: pointer;

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
  },
  data() {
    return {
      prompts: [1, 2, 3],
      currentPromptIndex: -1,
    };
  },
  methods: {
    mousein(index) {
      this.currentPromptIndex = index;
    },
    mouseLeave() {
      this.currentPromptIndex = -1;
    },
  },
};
</script>