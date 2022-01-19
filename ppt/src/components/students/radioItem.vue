<template>
  <div style="position: relative">
    <div class="item" v-for="item in optionData.options" :key="item.id">
      <el-radio
        v-model="radio"
        :disabled="showCorrect"
        :label="item.id"
        class="rabox"
        :value="item.id"
        @change="changAnswer"
        :title="item.text"
      >{{getAnswerText(item)}}</el-radio>
    </div>
    <template v-if="radio != -1">
      <div v-if="showCorrect" style="line-height: 25px; color: green">
        Correct answer：
        <template v-for="item in optionData.options">
          <span :key="item.id" v-if="item.isAnswer">{{getAnswerText(item)}}</span>
        </template>
      </div>
      <div class="item" style="background: transparent">
        <el-switch
          :value="showCorrect"
          :disabled="showCorrect"
          active-color="#13ce66"
          inactive-color="#999"
          @change="changeLocked"
          active-text="show answer"
        />
      </div>
      <div class="refresh-line" v-show="showRefreshAnswer">
        <span>Correct answer updated!</span>
        <img width="40" height="40" src="../../assets/picture/refresh.png"  @click="refreshNewAnswer"/>
      </div>
    </template>
  </div>
</template>
<style scoped>
.item {
  /* width: 100%; */
  /* width: 50%; */
  margin: 10px;
  /* display: inline-block; */
  /* min-height: 50px; */
  /* border: 1px solid #fff; */
  background-color: #fff;
  border-radius: 10px;
  line-height: 50px;
  position: relative;
  align-items: center;
  display: flex;
  justify-content: flex-start;
  padding-left: 20px;
}
.tag {
  color: red;
}
.refresh-line{
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
</style>

<script>
import { getStudentCurrentPageAnswerList } from "@/model/store.student";
import {mapGetters} from 'vuex'
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
      showCorrect: false,
      showRefreshAnswer: false
    };
  },
  mounted() {
    EventBus.$on('refresh-new-answer', () => {
      this.showRefreshAnswer = true
    })
  },
  created() {
    this.optionData = JSON.parse(JSON.stringify(this.data.items[0].data))
    this.pageId = this.data.page_id;
    const result = getStudentCurrentPageAnswerList(
      this.pageId,
      this.data.items[0].type
    );
    // console.log(result, "result");
    if (result && result.length > 0) {
      const { answer, locked } = result[0];
      this.radio = parseInt(answer);
      this.showCorrect = (locked && locked !== "false") ? true : false;
      if (this.showCorrect) {
        this.showCorrect = this.hasAnswer();
      }
      // console.log(this.radio, "result");
    }
  },
  computed: {
    ...mapGetters({
      currentPagePPTData: 'student/currentPagePPTData',
    }),
  },
  methods: {
    refreshData() {
      this.optionData = JSON.parse(JSON.stringify(this.currentPagePPTData.items[0].data))
    },
    refreshNewAnswer() {
      this.showRefreshAnswer = false
      this.refreshData()
    },
    changAnswer(value) {
      this.answer(value, this.showCorrect);
    },
    changeLocked() {
      this.showCorrect = true
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
    },
    getAnswerText(item) {
      // console.log(item);
      let AA = ["A", "B", "C", "D", "E", "F", "G"];
      return AA[item.id] + ": " + item.text;
    }
  }
};
</script>
