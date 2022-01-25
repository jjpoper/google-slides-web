<template>
  <div class="mediaFour" v-if="vList.length > 0">
    <div :class="`mediaFourItem ${vList.length === 1 ? 'mediaFourItemfull' : ''}`" v-for="item in vList" :key="item.id">
      <item-child :item="item"/>
      <div  class="rightClose" @click="deleteItem(item.id)">
        <svg t="1642930824343" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15661" width="20" height="20"><path d="M576 512l277.333333 277.333333-64 64-277.333333-277.333333L234.666667 853.333333 170.666667 789.333333l277.333333-277.333333L170.666667 234.666667 234.666667 170.666667l277.333333 277.333333L789.333333 170.666667 853.333333 234.666667 576 512z" fill="#3c3c3c" p-id="15662"></path></svg>  
      </div>
      <div class="scale rightClose" @click="setBig(item.id)">
        <svg t="1642930667713" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11701" width="20" height="20"><path d="M430.08 558.08L153.6 834.56V665.6c0-15.36-10.24-25.6-25.6-25.6s-25.6 10.24-25.6 25.6v230.4c0 7.68 2.56 12.8 7.68 17.92 5.12 5.12 10.24 7.68 17.92 7.68h230.4c15.36 0 25.6-10.24 25.6-25.6s-10.24-25.6-25.6-25.6H189.44l276.48-276.48-35.84-35.84zM913.92 110.08c-5.12-5.12-12.8-7.68-17.92-7.68h-230.4c-15.36 0-25.6 10.24-25.6 25.6s10.24 25.6 25.6 25.6h168.96L558.08 430.08l35.84 35.84L870.4 189.44V358.4c0 15.36 10.24 25.6 25.6 25.6s25.6-10.24 25.6-25.6V128c0-7.68-2.56-12.8-7.68-17.92z" p-id="11702" fill="#3c3c3c"></path></svg>
      </div>
    </div>
    <template v-if="bigItem">
      <el-dialog
        width="85%"
        :visible="true"
        custom-class="no-padding"
        :show-close="true"
        :append-to-body="true"
      >
        <div class="innermaskmetarial">
          <item-child :item="bigItem"/>
          <div class="rightClose" @click="setBig(0)">
            <svg t="1642930824343" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15661" width="20" height="20"><path d="M576 512l277.333333 277.333333-64 64-277.333333-277.333333L234.666667 853.333333 170.666667 789.333333l277.333333-277.333333L170.666667 234.666667 234.666667 170.666667l277.333333 277.333333L789.333333 170.666667 853.333333 234.666667 576 512z" fill="#3c3c3c" p-id="15662"></path></svg>  
          </div>
        </div>
      </el-dialog>
    </template>
  </div>
</template>
<script>
import { controlProject } from '@/socket/socket.teacher';
import { mapState, mapActions } from "vuex";
import ItemChild from './itemChild.vue';
export default {
  props: {
    list: {
      type: Array,
      function() {
        return [];
      },
    },
  },
  computed: {
    ...mapState({
      selectedMetarialIds: state => state.metarial.selectedMetarialIds,
      maskMetarialId: state => state.metarial.maskMetarialId,
    }),
    vList() {
      console.log('======', this.selectedMetarialIds)
      if(this.list) {
        let result = []
        for(let i = 0 ; i < this.selectedMetarialIds.length; i++) {
          const id = this.selectedMetarialIds[i]
          const item = this.list.find(item => item.id == id)
          if(item) {
            result.push(item)
          }
        }
        return result
      }
      return []
    },
    bigItem() {
      let item = null
      if(this.list && this.maskMetarialId != 0) {
        item = this.list.filter(item => item.id == this.maskMetarialId)[0]
      }
      console.log(item)
      return item
    }
  },
  components: {
    ItemChild
  },
  mounted() {
    EventBus.$on("MeterialStatusChange", this.handleChange)
  },
  beforeDestroy() {
    EventBus.$off("MeterialStatusChange", this.handleChange)
  },
  methods: {
    ...mapActions("metarial", [
      "deleteSelectedMetarialId",
      "setMaskMetarialId"
    ]),
    deleteItem(id) {
      this.deleteSelectedMetarialId(id)
    },
    handleChange(id, status) {
      if(status == 1) {
        // 播放
      } else if(status == 2) {
        // 暂停
      } else if(status == 3) {
        // 进度调整
      }
    },
    setBig(id) {
      this.setMaskMetarialId(id)
      controlProject({result: id, controlType: 8})
    }
  }
}
</script>

<style scoped>
.mediaFour{
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  flex-wrap: wrap;
  overflow: hidden;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}
.mediaFourItem{
  width: 50%;
  height: 50%;
  overflow: hidden;
  padding: 10px;
  box-sizing: border-box;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  /* border: 1px solid #dbd4d4; */
}
.mediaFourItemfull{
  width: 100%;
  height: 100%;
}
.rightClose{
  position: absolute;
  top: 15px;
  right: 15px;
  width: 26px;
  height: 26px;
  background-color: #fff;
  border-radius: 13px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.rightClose:hover{
  background-color: tomato;
}
.scale{
  right: 50px;
}
.full{
  width: 100%;
  height: 100%;
  position: relative;
  line-height: 0;
  overflow: hidden;
}
.innermaskmetarial{
  width: 100%;
  height: 600px;
  position: relative;
}
</style>