<template>
  <div class="widthlist">
    <div class="item">
      <span
        class="icon"
        :style="`width: 10px;height: 10px; background-color: ${
          widthValue === 3
            ? tabIndex == 3
              ? 'red'
              : color
            : 'rgb(212 208 208)'
        };border:1px solid ${
          widthValue == 3
            ? color == '#FFFFFF'
              ? 'red'
              : '#FFFFFF'
            : 'rgb(212 208 208)'
        }
        }`"
        @click="changeWidth(3, tabIndex)"
      ></span>
      <span class="icontext">3</span>
    </div>

    <div class="item">
      <span
        class="icon"
        :style="`width: 15px;height: 15px; background-color: ${
          widthValue === 5
            ? tabIndex == 3
              ? 'red'
              : color
            : 'rgb(212 208 208)'
        }; border:1px solid ${
          widthValue == 5
            ? color == '#FFFFFF'
              ? 'red'
              : '#FFFFFF'
            : 'rgb(212 208 208)'
        }`"
        @click="changeWidth(5, tabIndex)"
      ></span>
      <span class="icontext">5</span>
    </div>
    <div class="item">
      <span
        class="icon"
        :style="`width: 20px;height: 20px; background-color: ${
          widthValue === 10
            ? tabIndex == 3
              ? 'red'
              : color
            : 'rgb(212 208 208)'
        }; border:1px solid ${
          widthValue == 10
            ? color == '#FFFFFF'
              ? 'red'
              : '#FFFFFF'
            : 'rgb(212 208 208)'
        }`"
        @click="changeWidth(10, tabIndex)"
      ></span>
      <span class="icontext">10</span>
    </div>

    <div class="item">
      <span
        class="icon"
        :style="`width: 25px;height: 25px; background-color: ${
          widthValue === 20
            ? tabIndex == 3
              ? 'red'
              : color
            : 'rgb(212 208 208)'
        }; border:1px solid ${
          widthValue == 20
            ? color == '#FFFFFF'
              ? 'red'
              : '#FFFFFF'
            : 'rgb(212 208 208)'
        }`"
        @click="changeWidth(20, tabIndex)"
      ></span>
      <span class="icontext">20</span>
    </div>
    <div class="item">
      <span
        class="icon"
        :style="`width: 30px;height: 30px; background-color: ${
          widthValue === 30
            ? tabIndex == 3
              ? 'red'
              : color
            : 'rgb(212 208 208)'
        }; border:1px solid ${
          widthValue == 30
            ? color == '#FFFFFF'
              ? 'red'
              : '#FFFFFF'
            : 'rgb(212 208 208)'
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