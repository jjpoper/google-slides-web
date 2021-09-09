<template>
  <div style="position: relative">
    <div class="item" v-for="item in optionData.options" :key="item.id">
      <el-radio
        v-model="radio"
        :disabled="showCorrect"
        :label="item.id"
        class="ra"
        :value="item.id"
        @change="changAnswer"
      >{{item.text}}</el-radio>
    </div>
    <template v-if="radio != -1">
      <div v-if="showCorrect" style="line-height: 25px; color: green">
        正确答案：
        <template v-for="item in optionData.options">
          <span :key="item.id" v-if="item.isAnswer">{{item.text}}</span>
        </template>
      </div>
      <el-switch
        v-if="hasAnswer()"
        v-model="showCorrect"
        :disabled="showCorrect"
        active-color="#13ce66"
        inactive-color="#999"
        @change="changeLocked"
        active-text="show answer"
      />
    </template>
  </div>
</template>
<style scoped>
.item {
  /* width: 100%; */
  /* width: 50%; */
  margin: 10px;
  /* display: inline-block; */
  height: 50px;
  /* border: 1px solid #fff; */
  background-color: #fff;
  border-radius: 10px;
  line-height: 50px;
  position: relative;
}
.tag {
  color: red;
}
</style>

<script>
import { getStudentCurrentPageAnswerList } from "@/model/store.student";
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      }
    },
    answer: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      optionData: {},
      pageId: "",
      radio: -1,
      showCorrect: false
    };
  },
  created() {
    this.optionData = this.data.items[0].data;
    this.pageId = this.data.page_id;
    const result = getStudentCurrentPageAnswerList(
      this.pageId,
      this.data.items[0].type
    );
    // console.log(result, "result");
    if (result && result.length > 0) {
      const { answer, locked } = result[0];
      this.radio = parseInt(answer);
      this.showCorrect = locked === "true" ? true : false;
      if (this.showCorrect) {
        this.showCorrect = this.hasAnswer();
      }
      // console.log(this.radio, "result");
    }
  },
  methods: {
    changAnswer(value) {
      this.answer(value, this.showCorrect);
    },
    changeLocked() {
      this.answer(this.radio, true);
    },
    hasAnswer() {
      if (!this.optionData.options) {
        return false;
      }
      for (let i = 0; i < this.optionData.options.length; i++) {
        if (this.optionData.options[i].isAnswer) {
          return true;
        }
      }
      return false;
    }
  }
};
</script>
