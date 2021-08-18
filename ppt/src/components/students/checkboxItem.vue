<template>
  <div style="position: relative;">
    <el-checkbox-group
      v-model="checkedValues"
      :disabled="showCorrect"
      @change="handleCheckedValueChange"
    >
      <div class="item" v-for="item in optionData.options" :key="item.id">
        <el-checkbox :label="item.id" :value="item.id" style="width: 100%">{{item.text}}</el-checkbox>
      </div>
    </el-checkbox-group>

    <div v-if="tipText&&tipText.length>0" class="tipArea">
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

    <template v-if="checkedValues.length > 0">
      <div v-if="showCorrect" style="line-height: 25px; color: green">
        Correct answer:
        <template v-for="item in optionData.options">
          <div class="rightA" :key="item.id" v-if="item.isAnswer">
            <span>{{getAnswerText(item)}}</span>
          </div>
        </template>
      </div>
      <el-switch
        v-if="hasAnswer()"
        v-model="showCorrect"
        :disabled="showCorrect"
        active-color="#13ce66"
        inactive-color="#999"
        @change="changeLocked"
        active-text="show answers"
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
.textArea {
  display: flex;
  width: 100%;
  justify-content: start;
  margin-top: 10px;
}
.tipArea {
  margin: 10px;
  display: flex;
  flex-direction: column;
  line-height: 20px;
}
.rightA {
  display: flex;
  flex-direction: column;
}
.tag {
  color: red;
}
</style>

<script>
import { getStudentCurrentPageAnswerList } from "@/model/store.student";
import { mapState } from "vuex";
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
    // showCorrect: {
    //   type: Boolean,
    //   default: false
    // }
  },
  data() {
    return {
      optionData: {},
      pageId: "",
      checkedValues: [],
      showCorrect: false,
      tipText: null,
      showTips: false
    };
  },
  created() {
    this.optionData = this.data.items[0].data;
    this.pageId = this.data.page_id;
    const result = getStudentCurrentPageAnswerList(
      this.pageId,
      this.data.items[0].type
    );
    if (result && result.length > 0) {
      const { answer, locked } = result[0];
      this.checkedValues = JSON.parse(answer);
      this.showCorrect = locked === "true" ? true : false;
      if (this.showCorrect) {
        this.showCorrect = this.hasAnswer();
      }
    }
    if (this.elements) {
      for (let i = 0; i < this.elements.length; i++) {
        if (this.elements[i].type == "tip") {
          this.tipText = this.elements[i].tip;
        }
      }
    }
  },
  computed: {
    ...mapState({
      elements: state => state.student.elements
    })
  },
  methods: {
    handleCheckedValueChange(value) {
      console.log(JSON.stringify(value), this.showCorrect);
      this.answer(JSON.stringify(value), this.showCorrect);
    },
    showTip() {
      this.showTips = !this.showTips;
    },
    changeLocked() {
      this.answer(JSON.stringify(this.checkedValues), true);
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
      console.log(item);
      let AA = ["A", "B", "C", "D", "E", "F", "G"];
      return AA[item.id] + ": " + item.text;
    }
  }
};
</script>
