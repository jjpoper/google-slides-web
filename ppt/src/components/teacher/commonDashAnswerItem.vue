<template>
  <div :class="`colume${currentTab === 1 ? '1' : '5'} `" >
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
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
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
  padding: 5px;
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
  /* height: 59%; */
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