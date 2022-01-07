<template>
  <div class="text-answer-container" v-if="selectedAnswerList && selectedAnswerList.length > 0">
    <common-switch-tab :currentTab="currentTab" :changeTab="changeTab" hasStatics/>
    <div class="text-scroll">
      <div class="text-answer-list" v-if="currentTab !== 3">
        <div :class="`colume${currentTab === 1 ? '1' : '5'} `" v-for="(item, index) in selectedAnswerList" :key="index">
          <div :class="`text-item-outer${currentTab === 1 ? '1' : '5'} ${!flag_1 && 'full-text-area'}`">
            <div
              v-if="shouldShow(item)"
              :class="item.star ? 'text-list-item star_bg' : 'text-list-item'"
            >
              <div :class="`text_area ${!flag_1 && 'full-text-area'}`" >
                <p v-for="ans_text in getAnswer(item)" :key="ans_text">{{ ans_text }}</p>
                <span class="text_static" v-if="flag_1 && selectedAnswerList.length > 1">
                  {{ index + 1 + " of " + selectedAnswerList.length }}
                </span>
              </div>
              <div class="text-footer" v-if="flag_1">
                <student-response-opt-bar
                  v-if="flag_1"
                  :data="{
                    pageId: data.page_id,
                    itemId: item.answer,
                    studentId: item.user_id,
                    title: getConent(item),
                    isStar: item.star,
                    isShowRes: item.show,
                    name: getUname(item.user_id),
                    answertime: item.updated_at
                  }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <v-chart
          style="minHeight: 500px"
          :option="bar"
          :init-options="initOptions"
          ref="bar"
          theme="ovilia-green"
          autoresize
        />
      </div>
    </div>    
  </div>
</template>

<script>
import {
  getCurrentPageAnswerList,
  getStundentUidAndName
} from "@/model/store.teacher";
import ECharts from "vue-echarts";
import StudentResponseOptBar from "./studentResponseOptBar.vue";
import {mapState} from 'vuex'
import CommonSwitchTab from './commonSwitchTab.vue';
export default {
  components: { StudentResponseOptBar, "v-chart": ECharts, CommonSwitchTab },
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      }
    },
    flag_1: {
      type: Boolean,
      default: false
    }
    // answerList: {
    //   type: Array,
    //   default: [],
    // },
  },
  data() {
    return {
      choiceData: null, 
      showStatistics: true,
      options: [],
      title: "",
      answerList: [],
      currentModel: 0,
      optFlags: ["A", "B", "C", "D", "E", "F", "G", "H"],
      isMulti: false,
      initOptions: {
        renderer: "canvas",
      },
      currentTab: 1,
    };
  },
  computed: {
    ...mapState({
      selectedGroupMembers: state => state.teacher.selectedGroupMembers,
    }),
    selectedAnswerList() {
      let result = []
      if(this.selectedGroupMembers.length === 0) {
        result = this.answerList
      } else {
        result = this.answerList.filter(item => {
          return this.selectedGroupMembers.indexOf(item.user_id) > -1
        })
      }
      return result
    },
    bar() {
      const names = this.options.map(item => {
        return this.optFlags[item.id] + ": " + item.text;
      });
      const values = this.options.map(item => {
        return this.getAnswerCount(item.id);
      });
      return {
        tooltip: {
          trigger: "item",
          formatter: "{c}%"
        },
        xAxis: {
          type: "category",
          data: names,
          axisLabel: {
              // rotate: '45',
              fontSize: 14,
              axisTick: {
                  alignWithLabel: true,
                  show: true
              },
              color: '#333',
              triggerEvent: true,
              formatter: function (params) {
                var valueTxt = ''
                if (params.length >6) {
                  valueTxt = params.substring(0,6) + '...'
                } else {
                  valueTxt = params
                }
                return valueTxt
              },
            },
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: values,
            type: "bar",
            label: {
              show: true,
              position: "inside",
              formatter: v => {
                const val = v.data;
                const len = this.selectedAnswerList.length;
                if (len > 0 && val > 0) {
                  const per = ((val * 100) / len).toFixed(2);
                  return `${val}（${per}/%）`;
                } else {
                  return 0;
                }
              }
            }
          }
        ]
      };
    }
  },
  created() {
    this.choiceData = this.data
    const { title, options, isMulti } = this.choiceData.items[0].data;
    this.title = title;
    this.options = options;
    this.isMulti = isMulti;
    this.answerList = getCurrentPageAnswerList(
      this.choiceData.page_id,
      this.choiceData.items[0].type
    );
  },
  mounted() {
    EventBus.$on("choice", data => {
      this.choiceData = data.data;
      const { title, options, isMulti } = this.choiceData.items[0].data;
      this.title = title;
      this.options = options;
      this.isMulti = isMulti;
      // console.log(this.data, data, "EventBus on");
      const { user_id, answer, user_name } = data;
      this.answerList = getCurrentPageAnswerList(
        this.choiceData.page_id,
        this.choiceData.items[0].type
      );
    });
  },
  methods: {
    changeTab(i) {
      this.currentTab = i
    },
    counts(id) {
      if (this.selectedAnswerList && this.selectedAnswerList.length > 0) {
        const filterData = this.selectedAnswerList.filter(item => item.answer == id);
        return filterData.length;
      } else {
        return 0;
      }
    },
    getConent(answer) {
      return JSON.stringify(this.getAnswer(answer));
      //  return this.optFlags[answer] + ": " + this.getAnswer(answer).text;
    },
    setModel(model) {
      this.currentModel = model;
      this.$forceUpdate();
    },
    getAnswerCount(value) {
      let count = 0;
      const { isMulti } = this;
      for (let i = 0; i < this.selectedAnswerList.length; i++) {
        const { answer } = this.selectedAnswerList[i];
        if (
          (!!answer && isMulti && JSON.parse(answer).indexOf(value) > -1) ||
          (!isMulti && value == parseInt(answer))
        ) {
          if (this.selectedAnswerList[i].show || this.flag_1) {
            count++;
          }
        }
      }
      return count;
    },
    getAnswer(answer) {
      const data = [];
      if (this.isMulti) {
        let list = JSON.parse(answer.answer);
        list.sort((a, b) => a - b)
        for (let i = 0; i < list.length; i++) {
          let text =
            this.optFlags[list[i]] +
            " : " +
            this.options.filter(item => item.id == list[i])[0].text;
          data.push(text);
        }
      } else {
        data.push(
          this.optFlags[answer.answer] +
            " : " +
            this.options.filter(item => item.id == answer.answer)[0].text
        );
      }
      return data;
    },
    pageChange(value) {
      this.showStatistics = value == 2;
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
      for (let i = 0; i < this.selectedAnswerList.length; i++) {
        if (this.selectedAnswerList[i].star) return false; //如果不是星标答案，且有其他的星标答案，则需要隐藏
      }
      return true;
    },

    getUserNames(index) {
      let names = "";
      for (let i = 0; i < this.selectedAnswerList.length; i++) {
        if (index == parseInt(this.selectedAnswerList[i].answer)) {
          names += this.getUname(this.selectedAnswerList[i].user_id) + ",";
        }
      }
      if (names) {
        return names;
      } else {
        return "";
      }
    },
    extension(mychart) {
　　　 //判断是否创建过div框,如果创建过就不再创建了
      var id = document.getElementById("extension");
      if(!id) {
          var div = "<div id = 'extension' sytle=\"display:none\"></div>"
          document.body.append(div);
      }

      mychart.on('mouseover', function(params) {
          if(params.componentType == "xAxis") {
              $('#extension').css({
                  "position": "absolute",
                  "color": "black",
                  //"border":"solid 2px white",
                  "font-family": "Arial",
                  "font-size": "20px",
                  "padding": "5px",
                  "display": "inline"
              }).text(params.value);

              $("html").mousemove(function(event) {
                  var xx = event.pageX - 30;
                  var yy = event.pageY + 20;
                  $('#extension').css('top', yy).css('left', xx);
              });
          }
      });

      mychart.on('mouseout', function(params) {
          if(params.componentType == "xAxis") {
            $('#extension').css('display', 'none');
        }
      });
    }
  }
};
</script>


<style scoped>
.text-answer-container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: #fff;
}
.text-scroll{
  width: 100%;
  height: 100%;
  flex-direction: column;
  overflow: scroll;
  position: relative;
  padding-bottom: 100px;
  flex: 1;
}
.text-answer-list{
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
.colume5{
  /* -webkit-column-count:  5;
  -moz-column-count:  5;
  column-count:  5;
  -webkit-column-gap:  5px;
  -moz-column-gap:  5px;
  column-gap:  5px; */
  width: 20%;
  padding: 2px;
  box-sizing: border-box;
  margin-bottom: 10px;
}
.colume1{
  width: 100%;
  padding: 5px;
  box-sizing: border-box;
  margin-bottom: 10px;
}
/* 有星标时的bg */
.star_bg {
  border: 3px solid #f7d567;
  background-color: #f8f1d3;
}
.text-item-outer1{
  /* height: 290px; */
  width: 100%;
  position: relative;
}
.text-item-outer5{
  width: 100%;
  /* padding-bottom: 85%; */
  position: relative;
}
.text-item-outer1.full-text-area{
  /* height: 148px; */
}
.text-item-outer5.full-text-area{
  padding-bottom: 45%;
}
.text-list-item {
  width: 100%;
  /* height: 100%; */
  border-radius: 8px;
  margin-right: 10px;
  border: 1px solid #F1F1F1;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.16);
  background-color: #fff;
  box-sizing: border-box;
  padding: 10px;
  /* position: absolute; */
  top: 0;
  left: 0;
  overflow: hidden;
}
.text_static {
  position: absolute;
  bottom: 10px;
  right: 7px;
}
.text_area {
  width: 100%;
  height: 59%;
  background: rgba(228,228,228,0.3);
  border-radius: 6px;
  font-size: 14px;
  font-family: Inter-Bold;
  line-height: 24px;
  color: #000000;
  box-sizing: border-box;
  padding:7px 7px 30px 7px;
  overflow: scroll;
  position: relative;
  text-align: left;
}
.text_area.full-text-area{
   height: 100%;
}
.text-footer{
  width: 100%;
  height: 41%;
}
.on-as-outer{
  width: 50%;
  min-height: 100px;
  background: #FFFFFF;
  border: 1px solid #F7F8FF;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  opacity: 1;
  border-radius: 6px;
  box-sizing: border-box;
  padding: 18px 14px;
  position: relative;
  margin: 10px auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.no-as-title{
  height: 24px;
  font-size: 18px;
  font-family: Segoe UI;
  font-weight: bold;
  line-height: 24px;
  color: #36425A;
  padding-left: 28px;
  display: inline-block;
  text-align: left;
  position: relative;
}
.no-as-title >i{
  width: 18px;
  height: 18px;
  border-radius: 9px;
  background-color: #FF1A0E;
  display: inline-block;
  top: 3px;
  left: 0;
  position: absolute;
}
.on-as-list{
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  font-size: 18px;
  font-family: Segoe UI;
  font-weight: bold;
  line-height: 24px;
  color: #BCBCBC;
  margin-top: 17px;
}
.on-as-list-item{
  margin-right: 20px;
}
</style>