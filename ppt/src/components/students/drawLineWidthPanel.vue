<template>
  <div class="widthlist">
    <div class="item">
      <span
        class="icon"
        :style="`width: 10px;height: 10px; background-color: ${widthValue === 3 ? color : 'rgb(212 208 208)'};
        }`"
        @click="changeWidth(3, tabIndex)"
      ></span>
      <span class="icontext">3</span>
    </div>

    <div class="item">
      <span
        class="icon"
        :style="`width: 15px;height: 15px; background-color: ${widthValue === 5 ? color : 'rgb(212 208 208)'}; border-color: ${
          widthValue === 5 ? 'red' : color
        }`"
        @click="changeWidth(5, tabIndex)"
      ></span>
      <span class="icontext">5</span>
    </div>
    <div class="item">
      <span
        class="icon"
        :style="`width: 20px;height: 20px; background-color: ${widthValue === 10 ? color : 'rgb(212 208 208)'}; border-color: ${
          widthValue === 10 ? 'red' : color
        }`"
        @click="changeWidth(10, tabIndex)"
      ></span>
      <span class="icontext">10</span>
    </div>

    <div class="item">
      <span
        class="icon"
        :style="`width: 25px;height: 25px; background-color: ${widthValue === 20 ? color : 'rgb(212 208 208)'}; border-color: ${
          widthValue === 20 ? 'red' : color
        }`"
        @click="changeWidth(20, tabIndex)"
      ></span>
      <span class="icontext">20</span>
    </div>
    <div class="item">
      <span
        class="icon"
        :style="`width: 30px;height: 30px; background-color: ${widthValue === 30 ? color : 'rgb(212 208 208)'}; border-color: ${
          widthValue === 30 ? 'red' : color
        }`"
        @click="changeWidth(30, tabIndex)"
      ></span>
      <span class="icontext">30</span>
    </div>
  </div>
</template>

<style scoped>
.page {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.widthlist {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.widthlist .item {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: auto;
  position: relative;
  flex-direction: column;
  height: 100%;
}
.widthlist .icon {
  cursor: pointer;
  border-radius: 50%;
  /* border: 2px solid #999; */
}
.icontext {
  position: absolute;
  bottom: -15px;
}
</style>

<script>
export default {
  props: {
    color: {
      type: String,
      default: "#02a3ee",
    },
    widthValue: {
      type: Number,
      default: 3,
    },
    changeWidth: {
      type: Function,
    },
    tabIndex: {
      type: Number,
      default: 1,
    },
  },

  data() {
    return {};
  },
};
</script>