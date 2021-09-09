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
        <div class="tips-title">Tips</div>
        <div class="ppt-tips-item">
          <div class="ppt-tips-item-content">
            {{currentTips}}
          </div>
        </div>
      </div>
   </div>
  </div>
</template>
<script>
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
        return list
      }
      return []
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
  data() {
    return {
      currentIndex: 0
    }
  },
  methods: {
    changeIndex(index) {
      this.currentIndex = index
    }
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
  padding: 20px 16px;
  box-sizing: border-box;
}
.ppt-tips-item-content{
  width: 100%;
  height: 100px;
  border-radius: 4px;
  background-color: #fff;
  overflow-y: scroll;
  font-size: 14px;
  font-family: Inter-Bold;
  line-height: 24px;
  color: #11142D;
  text-align: left;
  padding: 5px;
  box-sizing: border-box;
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
</style>