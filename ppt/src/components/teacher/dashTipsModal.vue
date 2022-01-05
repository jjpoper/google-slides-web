<template>
  <div class="copy_page" >
    <img
      src="../../assets/picture/closecom.png"
      width="20"
      height="20"
      class="close-btn"
      @click="close()"
    />
     <div class="content" v-if="tipsItemList && tipsItemList.length > 0">
        <div class="ppt-list">
          <div class="ppt-list-item" @click="changeIndex(index)" v-for="(item, index) in tipsItemList" :key="index">
            <pptcontent :url="item.thumbnail_url"/>
          </div>
        </div>
        <div class="ppt-content">
          <div class="ppt-content-inner">
            <pptcontent :url="tipsItemList[currentIndex].thumbnail_url"/>
          </div>
          <div class="footer">
            {{tipsItemList[currentIndex].index}}/{{studentAllSlides.length}}
          </div>
        </div>
        <div class="ppt-tips">
          <!-- <div class="tips-title">Tips</div> -->
          <div class="ppt-tips-item">
            <div class="ppt-tips-item-content">
              <div class="ppt-tips-item-top">
                <img
                  src="../../assets/picture/dash-tip.png"
                  width="24"
                  height="24"
                />
                <div v-if="isTeacher && contenteditable" class="tipsSaveButton" @click="enter">OK</div>
                <img
                  src="../../assets/picture/bianji.png"
                  width="20"
                  height="20"
                  style="cursor: pointer;"
                  v-if="isTeacher && !contenteditable" @click="editTips"
                />
                <!-- <img
                  src="../../assets/picture/morshanchu.png"
                  width="11.25"
                  height="12"
                  class="moreshanchu"
                  v-if="isTeacher"
                /> -->
              </div>
              <div  v-if="isTeacher"  style="position: relative">
                <textarea v-model="tipsValue" :disabled="!contenteditable" class="ppt-tips-item-text" ref="pptTipstext" />
              </div>
              <div v-else class="ppt-tips-item-text" >{{tipsValue}}</div>
            </div>
            <div class="ppt-tips-item-content right-answer-content"
              v-if="isTeacher && tipsItemList[currentIndex].items[0] && 
              tipsItemList[currentIndex].items[0].type === 'choice' && 
              tipsItemList[currentIndex].items[0].data.showCorrectAnswer">
              <div class="ppt-tips-item-top">
                <div class="checktext">
                  <input type="checkbox" checked="true" class="tipscheck"/>
                  正确答案
                </div>
                <img
                  src="../../assets/picture/morshanchu.png"
                  width="11.25"
                  height="12"
                  class="moreshanchu"
                />
              </div>
              <div class="ppt-tips-item-checklist">
                <!-- <el-checkbox-group v-model="rightAnswers" @change="handleCheckedChange">
                  <el-checkbox  >
                    
                  </el-checkbox>
                </el-checkbox-group> -->
                <div v-for="(item, index) in tipsItemList[currentIndex].items[0].data.options" :key="index" class="checktext checkitem">
                  <input type="checkbox" v-model="rightAnswers" @change="handleCheckedChange" :value="item.id" class="tipscheck"/>
                  <p class="checktextbox" :title="item.text">
                    {{item.text}}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
    <div v-else>
      <img
        src="../../assets/picture/tipsempty.png"
        width="600"
        height="400"
        class="tipsempty"
      />
    </div>
  </div>
</template>
<script>
import { changeAnswer, changeTips } from '@/socket/socket.teacher';
import {mapState, mapActions} from 'vuex'
import pptcontent from '../pptcontent.vue';
export default {
  components: { pptcontent },
  props: {
    close: {
      type: Function
    },
    isTeacher: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    tipsItemList() {
      if(this.studentAllSlides && this.studentAllSlides.length > 0) {
        const newList = this.studentAllSlides.map((d, index) => {
          return {
            ...d,
            index: index + 1
          }
        })
        const list = newList.filter(item => {
          const {elements = []} = item
          const tipItemIndex = elements.findIndex(ele => ele.type === 'tip')
          return tipItemIndex > -1
        })
        return list
      }
      return []
    },
    currentItemData() {
      return this.tipsItemList[this.currentIndex]
    },
    currentTips() {
      if(this.tipsItemList.length > 0) {
        const {elements} = this.tipsItemList[this.currentIndex]
        const tipItemIndex = elements.findIndex(ele => ele.type === 'tip')
        return elements[tipItemIndex]
      }
      return null
    },
    ...mapState({
      studentAllSlides: state => state.student.studentAllSlides
    }),
  },
  watch: {
    currentTips() {
      this.setTipText()
    },
    currentIndex() {
      this.setRightAnswers()
    }
  },
  data() {
    return {
      currentIndex: 0,
      contenteditable: false,
      tipsValue: '',
      rightAnswers: [],
      isEditing: false
    }
  },
  mounted() {
    this.setTipText()
    this.setRightAnswers()
  },
  methods: {
    ...mapActions("student", [
      "updateSlideItemTip",
      "updateSlideCorrectAnswer"
    ]),
    setTipText() {
      if(this.currentTips) {
        this.tipsValue = this.currentTips.tip
      } else {
        this.tipsValue = ''
      }
    },
    setRightAnswers() {
      if(this.tipsItemList.length <= 0) return
      const {type, data: {options}} = this.tipsItemList[this.currentIndex].items[0]
      if(type === 'choice') {
        this.rightAnswers = options.filter(item => item.isAnswer).map(item => item.id)
        console.log(this.rightAnswers)
      }
    },
    changeIndex(index) {
      this.currentIndex = index
    },
    editTips() {
      this.contenteditable = true
      this.$nextTick(() => {
        this.$refs.pptTipstext.focus()
      })
    },
    enter(event) {
      // if(event.keyCode === 13) {
      //   event.cancelBubble = true;
      //   event.preventDefault();
      //   event.stopPropagation();
      //   changeTips(this.currentItemData.page_id, this.tipsValue, this.currentTips.id)
      //   this.updateSlideItemTip({"page_id": this.currentItemData.page_id, "tip": this.tipsValue})
      // }
      this.contenteditable = false
      changeTips(this.currentItemData.page_id, this.tipsValue, this.currentTips.id)
      this.updateSlideItemTip({"page_id": this.currentItemData.page_id, "tip": this.tipsValue})
      // this.clearDelay();
      // this.sendDelay = setTimeout(() => {
      //   this.send(index);
      // }, 200);
    },
    handleCheckedChange() {
      console.log(this.rightAnswers)
      changeAnswer(this.currentItemData.page_id, this.rightAnswers)
      this.updateSlideCorrectAnswer({"page_id": this.currentItemData.page_id, "correct_answer": this.rightAnswers})
    }
  }
};
</script>

<style scoped>
.copy_page {
  width: 100%;
  /* max-height: 500px; */
  background: rgba(255, 255, 255, 1);
  opacity: 1;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  padding-top: 50px;
}
.close-btn{
  position: absolute;
  top: 15px;
  right: 15px;
  cursor: pointer;
}
.content{
  /* flex: 1; */
  display: flex;
  box-sizing: border-box;
  padding: 0 15px 70px;
  height: 500px;
}
.ppt-list{
  flex: 1;
  height: 100%;
  overflow-y: scroll;
}
.ppt-list-item{
  width: 100%;
  height: 136px;
  position: relative;
  margin-bottom: 10px;
  border: 1px solid #DCDCDC;
  box-sizing: border-box;
  cursor: pointer;
}
.ppt-content{
  flex: 3;
  box-sizing: border-box;
  padding: 0 10px;
  max-height: 100%;
  position: relative;
}
.ppt-content-inner{
  width: 100%;
  height: 100%;
  border-radius: 6px;
  border: 1px solid rgba(220, 220, 220, 1)
}
.ppt-tips{
  flex: 1;
  height: 100%;
  position: relative;
}
.ppt-tips-item{
  flex: 1;
  height: 100%;
  overflow-y: scroll;
  background-color: rgba(219, 219, 219, 0.2);
  border: 1px solid rgba(219, 219, 219, 1);
  border-radius: 6px;
  padding: 10px 6px;
  box-sizing: border-box;
}
.ppt-tips-item-content{
  width: 100%;
  height: 130px;
  border-radius: 4px;
  background-color: #fff;
  font-size: 14px;
  font-family: Inter-Bold;
  /* line-height: 24px; */
  color: #11142D;
  /* text-align: left; */
  padding: 9px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  margin-bottom: 6px;
}
.right-answer-content{
  height: 154px;
}
.ppt-tips-item-text{
  text-align: left;
  padding-top: 12px;
  flex: 1;
  outline: none;
  border: none;
  resize:none;
  height: 72px;
  word-break: break-word;
}
.ppt-tips-item-text:active{
  outline: none;
}
.ppt-tips-item-top{
  height: 24px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.moreshanchu{
  cursor: pointer;
}
.tips-title{
  width: 100%;
  height: 50px;
  border-radius: 25px;
  background-color: rgba(21, 195, 154, 1);
  text-align: center;
  line-height: 50px;
  position: absolute;
  top: -60px;
  font-size: 18px;
  font-family: Inter-Bold;
  color: #FFFFFF;
}
.footer{
  position: absolute;
  height: 32px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 16px;
  padding: 0 22px;
  font-size: 14px;
  font-family: Segoe UI;
  font-weight: 400;
  line-height: 32px;
  color: #fff;
  left: 10px;
  bottom: -42px;
}
.checktext{
  font-size: 14px;
  font-family: Inter-Bold;
  color: #11142D;
}
.tipscheck{
  width: 14px;
  height: 14px;
  position: relative;
}
.tipscheck::before{
  position: absolute;
  top: 0;
  background-color: #fff;
  color: #fff;
  width: 14px;
  height: 14px;
  display: inline-block;
  visibility: visible;
  padding-left: 0px;
  text-align: center;
  content: ' ';
  border-radius: 1px;
  border: 1px solid rgba(112, 112, 112, 0.2);
}
        
.tipscheck:checked::before{
  background-color: rgba(21, 195, 154, 1);
  border: 1px solid rgba(21, 195, 154, 1);
}
.tipscheck:checked::after {
  content: '';
  position: absolute;
  top: 1px;
  left: 5px;
  width: 3px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
.ppt-tips-item-checklist{
  padding: 12px 0 0 12px;
  flex: 1
}
.checkitem{
  margin-bottom: 5px;
  display: flex;
  align-items: center;
}
.checktextbox{
  width: 100%;
  height: 20px;
  background-color: rgba(245, 245, 245, 0.5);
  margin-left: 7px;
  box-sizing: border-box;
  text-align: left;
  padding-left: 7px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 120px;
}
.tipsempty{
  margin-bottom: 100px;
}
.student-tips{
  display: flex;
  background-image: url(../../assets/picture/smalltips.png);
  background-size: 62px 66px;
  background-repeat: no-repeat;
  min-height: 66px;
  min-width: 62px;
  padding-left: 70px;
  line-height: 66px;
  align-self: center;
  margin: 0 50px 50px;
}
.tipsSaveButton{
  border-radius: 10px;
  width: 40px;
  height: 20px;
  background: #16c39a;
  color: #fff;
  line-height: 20px;
  cursor: pointer;
}
</style>