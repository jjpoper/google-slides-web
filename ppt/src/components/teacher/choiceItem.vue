<template>
  <div class="page_choice">
    <div class="flag_area">
      <svg
        t="1619507788646"
        v-bind:class="currentModel == 0 ? 'icon icon_focus' : 'icon'"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="2036"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        @click="setModel(0)"
      >
        <path
          d="M157.538462 866.461538h787.692307v78.769231H78.769231V78.769231h78.769231v787.692307z m78.76923-374.153846h78.769231v315.076923h-78.769231V492.307692z m177.23077-118.153846h78.76923v433.230769h-78.76923V374.153846z m177.230769 118.153846h78.769231v315.076923h-78.769231V492.307692z m177.230769-157.538461h78.769231v472.615384h-78.769231V334.769231z m-470.468923 13.075692l-43.697231-65.536L452.923077 149.582769l173.784615 115.849846 154.505846-137.334153 52.322462 58.88-199.936 177.723076L452.923077 244.263385l-155.392 103.581538z"
          p-id="2037"
        ></path>
      </svg>
      <svg
        t="1619507881682"
        v-bind:class="currentModel == 1 ? 'icon icon_focus' : 'icon'"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="2980"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        @click="setModel(1)"
      >
        <path
          d="M64 163.7c0 22.6 18.3 40.9 40.9 40.9 22.6 0 40.9-18.3 40.9-40.9 0-22.6-18.3-40.9-40.9-40.9-22.6 0-40.9 18.3-40.9 40.9zM64 512c0 22.6 18.3 40.9 40.9 40.9 22.6 0 40.9-18.3 40.9-40.9 0-22.6-18.3-40.9-40.9-40.9-22.6 0-40.9 18.3-40.9 40.9zM64 860.3c0 22.6 18.3 40.9 40.9 40.9 22.6 0 40.9-18.3 40.9-40.9 0-22.6-18.3-40.9-40.9-40.9-22.6 0.1-40.9 18.3-40.9 40.9zM935 189.2H289.9c-13.7 0-25-11.3-25-25v-1.1c0-13.7 11.3-25 25-25H935c13.8 0 25 11.3 25 25v1.1c0 13.8-11.2 25-25 25zM935 537.5H289.9c-13.7 0-25-11.2-25-25v-1.1c0-13.8 11.3-25 25-25H935c13.8 0 25 11.2 25 25v1.1c0 13.8-11.2 25-25 25zM935 885.9H289.9c-13.7 0-25-11.2-25-25v-1.1c0-13.8 11.3-25 25-25H935c13.8 0 25 11.3 25 25v1.1c0 13.7-11.2 25-25 25z"
          p-id="2981"
        ></path>
      </svg>
    </div>

    <span class="flag_text">
      {{ currentModel == 0 ? "Statistics" : "Personal" }}
    </span>

    <div v-if="currentModel == 0" class="statistics">
      <!-- <el-tooltip
        placement="bottom"
        :disabled="!flag_1 || getAnswerCount(item.id) == 0"
        v-for="item in options"
        :key="item.id"
      >
        <div slot="content">{{ getUserNames(item.id) }}</div>
        <div class="static_item">
          <span class="span_content">{{
            optFlags[item.id] + ": " + item.text
          }}</span>
          <span>{{ getAnswerCount(item.id) }}</span>
        </div>
      </el-tooltip> -->
      <v-chart
        style="height: 500px"
        :option="bar"
        :init-options="initOptions"
        ref="bar"
        theme="ovilia-green"
        autoresize
      />
    </div>

    <div v-else class="personal">
      <div v-for="(item, index) in answerList" :key="index">
        <div v-if="shouldShow(item)">
          <template v-if="isMulti">
            <div :class="item.star ? 'parent_1 star_bg' : 'parent_1'" v-for="ans in JSON.parse(item.answer)" :key="ans">
              <div class="text_content">
                {{ optFlags[ans] + ": " + getAnswer(ans).text }}
              </div>
              <student-response-opt-bar
                v-if="flag_1"
                :data="{
                  pageId: data.page_id,
                  itemId: ans,
                  studentId: item.user_id,
                  title: getConent(ans),
                  isStar: item.star,
                  isShowRes: item.show,
                  name: getUname(item.user_id),
                }"
              />
            </div>
          </template>
          <template v-else>
            <div :class="item.star ? 'parent_1 star_bg' : 'parent_1'">
              <div class="text_content">
                {{ optFlags[item.answer] + ": " + getAnswer(item.answer).text }}
              </div>
              <student-response-opt-bar
                v-if="flag_1"
                :data="{
                  pageId: data.page_id,
                  itemId: item.answer,
                  studentId: item.user_id,
                  title: getConent(item.answer),
                  isStar: item.star,
                  isShowRes: item.show,
                  name: getUname(item.user_id),
                }"
              />
            </div>
          </template>
        </div>
      </div>

      <!-- <el-tooltip
        placement="bottom"
        :disabled="!flag_1"
        v-for="item in answerList"
        :key="item.id"
      >
        <div slot="content">{{ getUname(item.user_id) }}</div>
        <div class="personal_item">
          <strong>{{
            optFlags[item.answer] + ": " + getAnswer(item.answer).text
          }}</strong>
        </div>
      </el-tooltip> -->
    </div>
  </div>
</template>
<style scoped>
.page_choice {
  display: flex;
  width: 100%;
  height: auto;
  padding-left: 20px;
  flex-direction: column;
}
.span_content {
  flex: 1;
  display: flex;
  line-height: 30px;
}
.flag_area {
  display: flex;
  height: 50px;
  width: 80%;
  align-items: center;
}
.flag_text {
  display: flex;
  line-height: 20px;
  height: 20px;
}
.icon {
  width: 30px;
  height: 30px;
  margin-right: 10px;
  cursor: pointer;
  fill: #aaaaaa;
}
/* 有星标时的bg */
.star_bg {
  border: 3px solid #f7d567;
  background-color: #f8f1d3;
}

.icon_focus {
  fill: #404040;
}

.statistics {
  display: flex;
  flex-direction: column;
  width: 90%;
  margin-top: 10px;
}
.static_item {
  width: 90%;
  border: 3px solid #cfcfcf;
  border-radius: 8px;
  height: 50px;
  background-color: white;
  color: cadetblue;
  margin-bottom: 10px;
  padding-left: 10px;
  padding-right: 10px;
  font-size: 20px;
  display: flex;
  align-items: center;
}
.personal {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}

.parent_1 {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 350px;
  flex-wrap: wrap;
  height: 250px;
  border-radius: 8px;
  margin-right: 20px;
  border: 1px solid #cfcfcf;
}
.text_content {
  width: 80%;
  height: 70%;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  margin-left: 20px;
  margin-right: 20px;
  background-color: white;
  color: cadetblue;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

<script>
import {
  getCurrentPageAnswerList,
  getStundentUidAndName,
} from "@/model/store.teacher";
import ECharts from 'vue-echarts'
import commentIcon from "./commentIcon.vue";
import StudentResponseOptBar from "./studentResponseOptBar.vue";
export default {
  components: { commentIcon, StudentResponseOptBar, 'v-chart': ECharts },
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
    flag_1: {
      type: Boolean,
      default: false,
    },
    // answerList: {
    //   type: Array,
    //   default: [],
    // },
  },
  data() {
    return {
      showStatistics: true,
      options: [],
      title: "",
      answerList: [],
      currentModel: 0,
      optFlags: ["A", "B", "C", "D", "E", "F", "G", "H"],
      isMulti: false,
      initOptions: {
        renderer: "canvas"
      },
    };
  },
  computed: {
    'bar' () {
      const names = this.options.map((item) => {
        return this.optFlags[item.id] + ": " + item.text
      })
      const values = this.options.map((item) => {
        return this.getAnswerCount(item.id)
      })
      return {
        tooltip: {
          trigger: 'item',
          formatter:'{c}%'
        },
        xAxis: {
            type: 'category',
            data: names
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: values,
            type: 'bar',
            label: {
                show: true,
                position: 'inside',
                formatter: (v) => {
                  const val = v.data;
                  const len = this.answerList.length
                  if(len > 0 && val > 0) {
                    const per = (val * 100 / len).toFixed(2)
                    return `${val}（${per}/%）`;
                  } else {
                    return 0
                  }
                },
            },
        }]
      }
    }
  },
  created() {
    const { title, options, isMulti } = this.data.items[0].data;
    this.title = title;
    this.options = options;
    this.isMulti = isMulti
    this.answerList = getCurrentPageAnswerList(
      this.data.page_id,
      this.data.items[0].type
    );
    console.log(this.answerList, 'getCurrentPageAnswerList')
  },
  mounted() {
    EventBus.$on("choice", (data) => {
      const { user_id, answer, user_name } = data;
      this.answerList = getCurrentPageAnswerList(
        this.data.page_id,
        this.data.items[0].type
      );
      console.log(this.answerList, "refresh answer");
    });
  },
  methods: {
    counts(id) {
      if (this.answerList && this.answerList.length > 0) {
        const filterData = this.answerList.filter((item) => item.answer == id);
        return filterData.length;
      } else {
        return 0;
      }
    },
    getConent(answer) {
      return (
        this.optFlags[answer] + ": " + this.getAnswer(answer).text
      );
    },
    setModel(model) {
      this.currentModel = model;
      this.$forceUpdate();
    },
    getAnswerCount(value) {
      let count = 0;
      const {isMulti} = this
      for (let i = 0; i < this.answerList.length; i++) {
        const {answer} = this.answerList[i]
        if (
          !!answer && 
          (isMulti && JSON.parse(answer).indexOf(value) > -1) ||
          (!isMulti && value == parseInt(answer))
        ) {
          if(this.answerList[i].show || this.flag_1){
              count++;
          }
        }
      }
      return count;
    },
    getAnswer(answer) {
      const data = this.options.filter((item) => item.id == answer)[0];
      return data;
    },
    pageChange(value) {
      if (value == 2) {
        this.showStatistics = false;
      } else {
        this.showStatistics = true;
      }
    },
    getUname(id) {
      const name = getStundentUidAndName(id);
      return name ? name : id;
    },

    //返回当前这个item是否应该show出来
    shouldShow(item) {
      if (this.flag_1) return true; //如果是dashboard 模式，则一定show
      if (!item.show) return false; //如果要求隐藏，则一定需要隐藏
      if (item.star) return true; //如果是星标答案，则需要显示
      for (let i = 0; i < this.answerList.length; i++) {
        if (this.answerList[i].star) return false; //如果不是星标答案，且有其他的星标答案，则需要隐藏
      }
      return true;
    },

    getUserNames(index) {
      let names = "";
      for (let i = 0; i < this.answerList.length; i++) {
        if (index == parseInt(this.answerList[i].answer)) {
          names += this.getUname(this.answerList[i].user_id) + ",";
        }
      }
      if (names) {
        return names;
      } else {
        return "";
      }
    },
  },
};
</script>
