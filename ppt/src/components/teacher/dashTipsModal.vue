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
                src="../../assets/picture/smalltips.png"
                width="24"
                height="24"
              />
              <img
                src="../../assets/picture/morshanchu.png"
                width="11.25"
                height="12"
                class="moreshanchu"
              />
            </div>
            <textarea v-model="tipsValue" @keypress="enter" class="ppt-tips-item-text" ref="pptTipstext" @click="editTips" />
          </div>
          <div class="ppt-tips-item-content right-answer-content"
            v-if="tipsItemList[currentIndex].items[0] && 
            tipsItemList[currentIndex].items[0].type === 'choice' && 
            tipsItemList[currentIndex].items[0].data.showCorrectAnswer">
            <div class="ppt-tips-item-top">
              <div class="checktext">
                <input type="checkbox" checked="true" disabled class="tipscheck"/>
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
              <div class="checktext checkitem"
                v-for="(item, index) in tipsItemList[currentIndex].items[0].data.options"
                :key="index">
                <input type="checkbox" :checked="item.isAnswer" class="tipscheck"/>
                <p class="checktextbox">
                  {{item.text}}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
   </div>
  </div>
</template>
<script>
import { changeTips } from '@/socket/socket.teacher';
import {mapState} from 'vuex'
import pptcontent from '../pptcontent.vue';
export default {
  components: { pptcontent },
  props: {
    close: {
      type: Function
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
        console.log(list[0].items[0])
        return list
      }
      return []
    },
    currentItemData() {
      return this.tipsItemList[this.currentIndex]
    },
    currentTips() {
      const {elements} = this.tipsItemList[this.currentIndex]
      const tipItemIndex = elements.findIndex(ele => ele.type === 'tip')
      return elements[tipItemIndex].tip
    },
    ...mapState({
      studentAllSlides: state => state.student.studentAllSlides
    }),
  },
  watch: {
    currentTips() {
      this.tipsValue = this.currentTips
      console.log(this.tipsValue)
    }
  },
  data() {
    return {
      currentIndex: 0,
      contenteditable: false,
      tipsValue: ''
    }
  },
  mounted() {
    this.tipsValue = this.currentTips
  },
  methods: {
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
      if(event.keyCode === 13) {
        event.cancelBubble = true;
        event.preventDefault();
        event.stopPropagation();
        changeTips(this.currentItemData.page_id, this.tipsValue)
      }
      // this.clearDelay();
      // this.sendDelay = setTimeout(() => {
      //   this.send(index);
      // }, 200);
    },
  }
};
</script>

<style scoped>
.copy_page {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 1);
  opacity: 1;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  padding-top: 110px;
}
.close-btn{
  position: absolute;
  top: 15px;
  right: 15px;
  cursor: pointer;
}
.content{
  flex: 1;
  display: flex;
  box-sizing: border-box;
  padding: 0 15px 70px;
  height: 100%;
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
  height: 100%;
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
  resize:none
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
  background: #E4E4E4;
  opacity: 0.4;
  border-radius: 16px;
  padding: 0 22px;
  font-size: 14px;
  font-family: Segoe UI;
  font-weight: 400;
  line-height: 32px;
  color: #808191;
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
}
</style>