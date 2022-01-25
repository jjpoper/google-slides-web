<template>
  <div class="fullPage" v-bind="$attrs">
    <!-- <div
      id="integrationTest_lockScreenMessage"
      class="v2screen-lock__message"
    >Your teacher has locked responses for this slide</div>

    <br />

    <div v-if="data.items[0] && data.items[0].type != 'website'" class="answerArea">
      <div class="v2screen-lock__sub-text">Your Current Answer</div>
      <br />
      <div v-if="data.items[0].type == 'text' || data.items[0].type == 'number'" class="answerArea">
        <div v-for="(item, index) in answerList" :key="index" class="textContent">{{ item.content }}</div>
      </div>
      <div v-if="data.items[0].type == 'choice'" class="answerArea">
        <div v-for="(item, index) in answerList" :key="index" class="choiceAnswer">
          <div
            class="anser_text"
            v-for="(text,index_text) in getAnser(item.answer)"
            :key="index_text"
          >{{text}}</div>
        </div>
      </div>
      <div v-if="data.items[0].type == 'draw'" class="answerArea">
        <div v-for="(item, index) in answerList" :key="index" class="darwAnswer">
          <img :src="item.content" />
        </div>
      </div>
    </div> -->
    <div class="lock-modal">
      <img src="../../assets/picture/teacher-lock.png" class="teacher-lock"/>
      <div class="lock-right">
        <p class="info">Your teacher has locked responses for this slide</p>
        <div class="answer-box">
          <p class="tips">Your answers:</p>
          <div class="answer-box-inner">
            <template v-if="data.items[0] && currentType != 'website'" >
              <template v-if="currentType == 'text'">
                <div v-for="(item, index) in answerList" :key="index" class="textContent">{{ item.content }}</div>
              </template>
              <template v-if="currentType == 'choice'" class="answerArea">
                <div v-for="(item, index) in answerList" :key="index" class="textContent">
                  <div
                    class="anser_text"
                    v-for="(text, index_text) in getAnser(item.answer)"
                    :key="index_text"
                  >{{text}}</div>
                </div>
              </template>
              <template v-if="currentType == 'media'">
                <div v-for="(item, index) in answerList" :key="index" class="textContent">
                    <dash-right-remark-item :item="item"/>
                </div>
              </template>
              <template v-if="currentType == 'comment'">
                <div v-for="(item, index) in answerList" :key="index" class="textContent">
                    <dash-right-comment-item :item="item"/>
                </div>
              </template>
              <template v-if="currentType == 'draw'">
                <div v-for="(item, index) in answerList" :key="index" class="darwAnswer">
                  <Base64image :url="data.thumbnail_url">
                    <Base64image :url="item.result">
                    </Base64image>
                  </Base64image>
                </div>
              </template>
            </template> 
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState, mapGetters} from 'vuex'
import { getStudentCurrentPageAnswerList } from '@/model/store.student';
import Base64image from '../base64image.vue';
import DashRightRemarkItem from '../teacher/dash-answer/dash-right-media-item.vue';
import DashRightCommentItem from '../teacher/dash-answer/dash-right-comment-item.vue';
export default {
  components: {
    Base64image,
    DashRightRemarkItem,
    DashRightCommentItem
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      }
    },
  },
  computed: {
    ...mapState({
      // currentReamrkList: state => state.remark.currentReamrkList,
      allRemarks: state => state.remark.allRemarks,
      currentRemarkIndex: state => state.remark.currentRemarkIndex,
      currentInputType: state => state.remark.currentInputType,
      currentPageIndex: state => state.student.currentPageIndex,
      studentAllSlides: state => state.student.studentAllSlides,
      currentRemarkOptions: state => state.remark.currentRemarkOptions,
      userInfo: state => state.student.studentUserInfo
    }),
    ...mapGetters({
      currentPageAnswerList: "student/currentPageAnswerList",
      currentPageId: "student/currentPageId"
    }),
    mediaAnswerList() {
      const list = [].concat(this.currentPageAnswerList)
      return list.reverse().map(item => {
        const content = item.content || JSON.parse(item.data).content;
        return {
          ...item,
          id: item.id || item.response_id,
          content
        };
      });
    },
    marks() {
      let list = [];
      if (this.studentAllSlides.length > 0 && this.allRemarks.length > 0) {
        list = this.allRemarks.filter(
          item => item.page_id === this.currentPageId
        );
      }
      console.log('currentRemarkIndex', list)
      return list.reverse();
    },
    answerList() {
      if(this.currentType === 'comment') return this.marks
      if(this.currentType === 'media') return this.mediaAnswerList
      const {
        page_id,
        items
      } = this.data
      const result = getStudentCurrentPageAnswerList(
        page_id,
        items[0].type
      );
      console.log(result)
      return result || []
    },
    currentType() {
      return this.data.items[0] ? this.data.items[0].type : null
    }
  },
  mounted() {},
  methods: {
    getAnser(index) {
      let opts = this.data.items[0].data;

      let title = ["A", "B", "C", "D", "E", "F", "G"];
      let result = [];
      if (opts.isMulti) {
        let list = JSON.parse(index);
        for (let i = 0; i < opts.options.length; i++) {
          let index = list.indexOf(opts.options[i].id);
          if (index > -1) {
            result.push(title[index] + " : " + opts.options[i].text);
          }
        }
      } else {
        let flag = parseInt(index);
        let text = "";
        for (let i = 0; i < opts.options.length; i++) {
          if (index == opts.options[i].id) {
            text = opts.options[i].text;
            break;
          }
        }
        result.push(title[flag] + " : " + text);
      }
      return result;
    }
  }
};
</script>


<style  scoped>
.fullPage {
  display: flex;
  width: 100%;
  height: 100%;
  background-color: #000000;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 1000;
  position: fixed;
  top: 0;
}
.lock-modal{
  width: 80%;
  height: 590px;
  position: relative;
  background-color: #fff;
  border-radius: 10px; 
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.close-btn{
  position: absolute;
  top: 25px;
  right: 25px;
  cursor: pointer;
}
.teacher-lock{
  width: 30%;
  /* height: 306px; */
  margin-right: 20px;
}
.info{
  font-size: 22px;
  font-family: FZCuYuan-M03S;
  font-weight: 700;
  line-height: 43px;
  color: #05272A
}
.lock-right{
  flex: 1;
  height: 100%;
  box-sizing: border-box;
  padding: 15px 10px 20px 10px;
  text-align: left;
  display: flex;
  flex-direction: column;
}
.tips{
  font-size: 14px;
  font-family: Inter-Bold;
  line-height: 24px;
  color: #000000;
}
.answer-box{
  width: 100%;
  height: 100%;
}
.answer-box-inner{
  margin-top: 10px;
  height: 470px;
  background: rgba(247, 247, 247, 1);
  border-radius: 10px;
  box-sizing: border-box;
  padding: 14px;
  overflow: scroll;
}
.textContent{
  width: 100%;
  background: #FFFFFF;
  border: 1px solid #B5B5B5;
  opacity: 1;
  border-radius: 10px;
  padding: 10px;
  box-sizing: border-box;
  margin-bottom: 5px;
  font-size: 18px;
  font-family: Inter-Bold;
  line-height: 24px;
  color: #565656;
  word-break: break-word;
}
.darwAnswer{
  width: 100%;
  position: relative;
  height: 100%;
}
</style>