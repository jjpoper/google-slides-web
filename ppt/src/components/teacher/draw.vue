<template>
  <div class="text-answer-container" v-if="answerList && answerList.length > 0">
    <div class="text-answer-tab">
      <button :class="`button-row ${currentTab === 1 && 'active'}`" @click="changeTab(1)"></button>
      <button :class="`button-colum ${currentTab === 2 && 'active'}`" @click="changeTab(2)"></button>
      <el-select v-model="sortValue" placeholder="Sort">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <template v-if="currentTab !== 3">
      <div class="text-scroll">
        <div class="text-answer-list">
          <div :class="`colume${currentTab === 1 ? '1' : '5'} `" v-for="(item, index) in answerList" :key="index">
            <div :class="`text-item-outer${currentTab === 1 ? '1' : '5'} ${!flag_1 && 'full-text-area'}`">
              <div
                v-if="shouldShow(item)"
                :class="item.star ? 'text-list-item star_bg' : 'text-list-item'"
              >
                <div :class="`text_area ${!flag_1 && 'full-text-area'}`" >
                  <div class="remark-item-content">
                    <Base64image :url="currentPPTUrl">
                      <Base64image :url="item.content">
                         <Base64image :url="item.content1">
                         </Base64image>
                      </Base64image>
                    </Base64image>
                  </div>
                  <span class="text_static" v-if="flag_1 && answerList.length > 1">
                    {{ index + 1 + " of " + answerList.length }}
                  </span>
                </div>
                <div class="text-footer" v-if="flag_1">
                  <student-response-opt-bar
                    :data="{
                      pageId: data.page_id,
                      itemId: item.item_id,
                      studentId: item.user_id,
                      title: item.content,
                      isStar: item.star,
                      isShowRes: item.show,
                      name: item.user_name,
                      answertime: item.updated_at
                    }"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="flag_1 && noAnswerStudents.length" class="on-as-outer">
          <div class="no-as-title">
            <i></i> No Response
          </div>
          <div class="on-as-list">
            <p class="on-as-list-item" v-for="item in noAnswerStudents" :key="item.user_id">
              {{item.user_id}}
            </p>
          </div>
        </div>
      </div>    
    </template>
  </div>
</template>

<script>
import StudentResponseOptBar from "./studentResponseOptBar.vue";
import { mapState, mapGetters } from 'vuex'
import Base64image from '../base64image.vue';
export default {
  computed: {
    // 未答题学生
    noAnswerStudents() {
      let noList = []
      for(let i = 0; i < this.studentList.length; i++) {
        const currentUser = this.studentList[i]
        const index = this.answerList.findIndex(item => item.user_id === currentUser.user_id)
        if(index === -1) {
          noList.push(currentUser)
        }
      }
      return noList
    },
    ...mapState({
      studentList: state => state.teacher.studentList,
      currentPageIndex: state => state.student.currentPageIndex,
      studentAllSlides: state => state.student.studentAllSlides,
    }),
    ...mapGetters({
      currentPageAnswerList: 'student/currentPageAnswerList'
    }),
    answerList() {
      let list = this.currentPageAnswerList.map(item => {
        return {
          ...item,
          ...JSON.parse(item.data)
        }
      })
      list = this.resortList(list)
      console.log(list)
      return list;
    },
    currentPPTUrl() {
      return this.studentAllSlides[this.currentPageIndex].thumbnail_url
    }
  },
  components: { StudentResponseOptBar, Base64image },
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
    flag_1: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      currentTab: 1,
      options: [],
      sortValue: 1
    };
  },
  created() {
    this.options = this.flag_1 ? [
        {
          value: 1,
          label: 'sort by time'
        },
        {
          value: 2,
          label: 'sort by name'
        },
        {
          value: 3,
          label: 'sort by response'
        },
      ] : [
        {
          value: 1,
          label: 'sort by time'
        },
        {
          value: 3,
          label: 'sort by response'
        },
      ]
      console.log('init =====')
  },
  // watch: {
  //   sortValue() {
  //     this.resortList()
  //   }
  // },
  methods: {
    //返回当前这个item是否应该show出来
    shouldShow(item) {
      return true;
    },
    changeTab(i) {
      this.currentTab = i
    },
    resortList(list) {
      let newList = JSON.parse(JSON.stringify(list))
      try {
        if(this.sortValue === 1) {
          newList = newList.sort((prev, next) => {
            return prev.updated_at - next.updated_at
          })
        }

        // 数字 》 英文 》中文
        if(this.sortValue === 2) {
          newList = newList.sort((prev, next)=>{
            const preName = prev.user_id
            const nextName = next.user_id
            let reg = /[a-zA-Z0-9]/
              if (reg.test(preName)|| reg.test(nextName)) {
                if (preName > nextName){
                    return 1
                } else if(preName < nextName){
                    return -1
                } else {
                    return 0
                }
              } else {
                return preName.localeCompare(nextName)
              }
          })
        }

        // 有答案 》 无答案
        if(this.sortValue === 3) {
          newList = newList.sort((prev, next)=>{
            const precontent = prev.content
            const nextcontent = next.content
            if(precontent) {
                return -1
            } else if(!precontent && nextcontent) {
                return 1
            } else {
              return 0
            }
          })
        }
        return newList
      } catch(e) {
        console.log(e)
        return []
      }
    },
    getIconClass(name) {
      if(!name) return 'file'
      name = name.toLocaleLowerCase()
      if(name.indexOf('.pdf') > -1) return 'pdf'
      if(name.indexOf('.doc') > -1) return 'word'
      return 'file'
    }
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
  background-color: #F4F4F4;
}
.text-answer-tab{
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
}
.text-answer-tab button{
  width: 32px;
  height: 32px;
  margin-right: 22px;
  background-repeat: no-repeat;
  background-position: 0 0;
  background-size: 32px 32px;
  cursor: pointer;
  border: none;
}
.button-colum{
  background-image: url(../../assets/picture/colum.png);
}
.button-colum.active{
  background-image: url(../../assets/picture/colum-s.png);
}
.button-row{
  background-image: url(../../assets/picture/row.png);
}
.button-row.active{
  background-image: url(../../assets/picture/row-s.png);
}
.button-static{
  background-image: url(../../assets/picture/static.png);
}
.button-static.active{
  background-image: url(../../assets/picture/static-s.png);
}
.text-scroll{
  width: 100%;
  height: 100%;
  flex-direction: column;
  overflow: scroll;
  position: relative;
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
  height: 290px;
  width: 100%;
  position: relative;
}
.text-item-outer5{
  width: 100%;
  padding-bottom: 85%;
  position: relative;
}
.text-item-outer1.full-text-area{
  height: 550px;
}
.text-item-outer5.full-text-area{
  padding-bottom: 45%;
}
.text-list-item {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  margin-right: 10px;
  border: 1px solid #F1F1F1;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.16);
  background-color: #fff;
  box-sizing: border-box;
  padding: 10px;
  position: absolute;
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
  padding:7px;
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
video{
  width: 100%; height: 100%; object-fit: cover
}
.remark-item-content{
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  word-break: break-all;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}
.remark-item-content.content-text-scroll{
  overflow-y: scroll;
  justify-content: flex-start;
  align-items: flex-start;
}
.teacherppt-outer{
  width: 100%;
  height: 100%;
  position: relative;
  box-sizing: border-box;
  padding-right: 360px;
}
.teacherppt-remark{
  width: 350px;
  height: 100%;
  position: absolute;
  right: 0;
  top: 0
}
.remark-file{
  height: 60px;
  display: flex;
  align-items: center;
  overflow: hidden;
}
.file-icon{
  width: 60px;
  height: 60px;
  margin-right: 10px;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
}
.file-icon.pdf{
  background-image: url(../../assets/picture/pdf.png);
}
.file-icon.word{
  background-image: url(../../assets/picture/word.png);
}
.file-icon.file{
  background-image: url(../../assets/picture/file.png);
}
.download-text{
  text-decoration: none;
  text-align: left;
  float: left;
  padding-right: 20px;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: right;
  background-image: url(../../assets/picture/download.png);
  background-size: 12px 11px;
  cursor: pointer;
  font-family: Inter-Bold;
  line-height: 24px;
  color: #15C39A;
}
.file-name{
  font-size: 10px;
  font-family: Inter-Bold;
  line-height: 24px;
  color: #000000;
  overflow:hidden;
  white-space:nowrap;
  text-overflow:ellipsis;
}
</style>