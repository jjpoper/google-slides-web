<template>
  <div class="page">
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

    <!--  统计模式-->
    <div v-if="currentModel == 0" class="statistics">
      <el-tooltip
        placement="bottom"
        :disabled="!data.flag || getAnswerCount(item.id) == 0"
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
      </el-tooltip>
    </div>

    <!--普通模式-->
    <div v-else class="personal">
      <el-tooltip
        placement="bottom"
        :disabled="!data.flag"
        v-for="item in answerList"
        :key="item.id"
      >
        <div slot="content">{{ getUname(item.user_id) }}</div>
        <div class="personal_item">
          <strong>{{
            optFlags[item.answer] + ": " + getAnswer(item.answer).text
          }}</strong>
        </div>
      </el-tooltip>
    </div>
  </div>
</template>
<style scoped>
.page {
  min-height: 500px;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px;
}
.span_content {
  flex: 1;
  display: flex;
  line-height: 30px;
}
.flag_area {
  display: flex;
  height: 50px;
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

.icon_focus {
  fill: #404040;
}

.statistics {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 10px;
}
.static_item {
  width: 100%;
  border: 1px solid #404040;
  border-radius: 4px;
  height: 40px;
  margin-bottom: 10px;
  padding-left: 10px;
  padding-right: 10px;
  display: flex;
  align-items: center;
}
.personal {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}
.personal_item {
  width: 200px;
  height: 200px;
  margin: 20px 20px 20px 20px;
  display: flex;
  background-color: white;
  border-radius: 5px;
  justify-content: center;
  align-items: center;
  border: 1px solid #404040;
}
</style>

<script>
import {
  getCurrentPageAnswerList,
  getStundentUidAndName,
} from "@/model/store.teacher";
import commentIcon from "./commentIcon.vue";
export default {
  components: { commentIcon },
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      showStatistics: true,
      answerList: [],
      options: [],
      title: "",
      currentModel: 0,
      optFlags: ["A", "B", "C", "D", "E", "F", "G", "H"],
    };
  },
  mounted() {
    console.log(this.data);
    const { title, options } = this.data.items[0].data;
    this.title = title;
    this.options = options;
    this.answerList = getCurrentPageAnswerList(
      this.data.page_id,
      this.data.items[0].type
    );
    console.log(this.options);
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
    setModel(model) {
      this.currentModel = model;
      this.$forceUpdate();
    },
    getAnswerCount(index) {
      let count = 0;
      for (let i = 0; i < this.answerList.length; i++) {
        if (index == parseInt(this.answerList[i].answer)) {
          count++;
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
      console.log(getStundentUidAndName(id));
      const name = getStundentUidAndName(id);
      return name ? name : id;
    },

    getUserNames(index) {
      let count = "";
      for (let i = 0; i < this.answerList.length; i++) {
        if (index == parseInt(this.answerList[i].answer)) {
          count += this.getUname(this.answerList[i].user_id) + ",";
        }
      }
      console.log(count);
      if(count){
          return count;
      }else{
          return 0;
      }
    },
  },
};
</script>
