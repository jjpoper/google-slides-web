<template>
  <div class="mediaFour" v-if="vList.length > 0">
    <div :class="`mediaFourItem ${vList.length === 1 ? 'mediaFourItemfull' : ''}`" v-for="item in vList" :key="item.id">
      <item-child :item="item"/>
      <div  class="rightClose" @click="deleteItem(item.id)">
        <svg t="1641562651385" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2136" width="64" height="64"><path d="M511.333 127.333c51.868 0 102.15 10.144 149.451 30.15 45.719 19.337 86.792 47.034 122.078 82.321 35.287 35.286 62.983 76.359 82.321 122.078 20.006 47.3 30.15 97.583 30.15 149.451s-10.144 102.15-30.15 149.451c-19.337 45.719-47.034 86.792-82.321 122.078-35.286 35.287-76.359 62.983-122.078 82.321-47.3 20.006-97.583 30.15-149.451 30.15s-102.15-10.144-149.451-30.15c-45.719-19.337-86.792-47.034-122.078-82.321-35.287-35.286-62.983-76.359-82.321-122.078-20.006-47.3-30.15-97.583-30.15-149.451s10.144-102.15 30.15-149.451c19.337-45.719 47.034-86.792 82.321-122.078 35.286-35.287 76.359-62.983 122.078-82.321 47.301-20.006 97.583-30.15 149.451-30.15m0-64c-247.424 0-448 200.576-448 448s200.576 448 448 448 448-200.576 448-448-200.576-448-448-448z" fill="#ffffff" p-id="2137"></path><path d="M557.254 512l147.373-147.373c12.497-12.497 12.497-32.758 0-45.255-12.496-12.497-32.758-12.497-45.254 0L512 466.746 364.627 319.373c-12.497-12.497-32.758-12.497-45.255 0s-12.497 32.758 0 45.255L466.746 512 319.373 659.373c-12.497 12.496-12.497 32.758 0 45.254C325.621 710.876 333.811 714 342 714s16.379-3.124 22.627-9.373L512 557.254l147.373 147.373C665.621 710.876 673.811 714 682 714s16.379-3.124 22.627-9.373c12.497-12.496 12.497-32.758 0-45.254L557.254 512z" fill="#ffffff" p-id="2138"></path></svg>
      </div>
      <div class="scale rightClose" @click="setBig(item.id)">
        <svg t="1641562978857" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4705" width="48" height="48"><path d="M831.89 192l0.11 0.11v639.78l-0.11 0.11H192.11l-0.11-0.11V192.11l0.11-0.11h639.78m0.11-64H192a64.19 64.19 0 0 0-64 64v640a64.19 64.19 0 0 0 64 64h640a64.19 64.19 0 0 0 64-64V192a64.19 64.19 0 0 0-64-64z" p-id="4706" fill="#ffffff"></path><path d="M800 224H512v64h288v-64z" p-id="4707" fill="#ffffff"></path><path d="M800 224h-64v288h64V224z" p-id="4708" fill="#ffffff"></path><path d="M745.37 233.37L512 466.75 557.25 512l233.38-233.37-45.26-45.26zM512 736H224v64h288v-64z" p-id="4709" fill="#ffffff"></path><path d="M288 512h-64v288h64V512z" p-id="4710" fill="#ffffff"></path><path d="M466.75 512L233.37 745.37l45.26 45.26L512 557.25 466.75 512z" p-id="4711" fill="#ffffff"></path></svg>
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
            <svg t="1641562651385" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2136" width="64" height="64"><path d="M511.333 127.333c51.868 0 102.15 10.144 149.451 30.15 45.719 19.337 86.792 47.034 122.078 82.321 35.287 35.286 62.983 76.359 82.321 122.078 20.006 47.3 30.15 97.583 30.15 149.451s-10.144 102.15-30.15 149.451c-19.337 45.719-47.034 86.792-82.321 122.078-35.286 35.287-76.359 62.983-122.078 82.321-47.3 20.006-97.583 30.15-149.451 30.15s-102.15-10.144-149.451-30.15c-45.719-19.337-86.792-47.034-122.078-82.321-35.287-35.286-62.983-76.359-82.321-122.078-20.006-47.3-30.15-97.583-30.15-149.451s10.144-102.15 30.15-149.451c19.337-45.719 47.034-86.792 82.321-122.078 35.286-35.287 76.359-62.983 122.078-82.321 47.301-20.006 97.583-30.15 149.451-30.15m0-64c-247.424 0-448 200.576-448 448s200.576 448 448 448 448-200.576 448-448-200.576-448-448-448z" fill="#ffffff" p-id="2137"></path><path d="M557.254 512l147.373-147.373c12.497-12.497 12.497-32.758 0-45.255-12.496-12.497-32.758-12.497-45.254 0L512 466.746 364.627 319.373c-12.497-12.497-32.758-12.497-45.255 0s-12.497 32.758 0 45.255L466.746 512 319.373 659.373c-12.497 12.496-12.497 32.758 0 45.254C325.621 710.876 333.811 714 342 714s16.379-3.124 22.627-9.373L512 557.254l147.373 147.373C665.621 710.876 673.811 714 682 714s16.379-3.124 22.627-9.373c12.497-12.496 12.497-32.758 0-45.254L557.254 512z" fill="#ffffff" p-id="2138"></path></svg>  
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
  border: 1px solid #dbd4d4;
}
.mediaFourItemfull{
  width: 100%;
  height: 100%;
}
.rightClose{
  position: absolute;
  top: 15px;
  right: 15px;
  width: 40px;
  height: 40px;
  background-color: #afafaf;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.rightClose:hover{
  background-color: tomato;
}
.scale{
  right: 70px;
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