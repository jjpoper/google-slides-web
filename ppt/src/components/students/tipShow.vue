<template>
  <div class="page">
    <div v-if="tipText&&tipText.length>0" class="tipArea" >
      <img
        v-if="!showTips"
        src="../../assets/icon/tip_close.png"
        width="30"
        height="30"
        style="cursor:pointer"
        @click="showTip()"
      />
      <img
        v-if="showTips"
        src="../../assets/icon/tip_open.png"
        width="30"
        height="30"
        style="cursor:pointer"
        @click="showTip()"
      />
      <span v-if="showTips" class="textArea">{{tipText}}</span>
    </div>
  </div>
</template>

<style scoped>
.page {
  width: 100%;
}
.textArea {
  display: flex;
  width: 100%;
  justify-content: start;
  margin-top: 10px;
}
.tipArea {
  display: flex;
  flex-direction: column;
  line-height: 20px;
  margin: 20px
}
</style>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      tipText: null,
      showTips: false
    };
  },
  computed: {
    ...mapState({
      elements: state => state.student.elements
    })
  },
  created() {
    if (this.elements) {
      for (let i = 0; i < this.elements.length; i++) {
        if (this.elements[i].type == "tip") {
          this.tipText = "tip: " + this.elements[i].tip;
        }
      }
    }
  },
  methods: {
    showTip() {
      this.showTips = !this.showTips;
    }
  }
};
</script>