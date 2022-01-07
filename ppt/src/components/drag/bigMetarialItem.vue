<template>
  <div class="mediaFour" v-if="vList.length > 0">
    <div :class="`mediaFourItem ${vList.length === 1 ? 'mediaFourItemfull' : ''}`" v-for="item in vList" :key="item.id">
      <item-child :item="item"/>
      <div class="scale rightClose" @click="setBig(item.id)">
        <svg t="1641538703989" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2166" width="32" height="32"><path d="M852.68743 966.232318 171.311547 966.232318c-62.714867 0-113.562988-50.846038-113.562988-113.558335L57.748558 171.324994c0-62.712297 50.848122-113.558335 113.562988-113.558335l681.376907 0c62.714867 0 113.562988 50.846038 113.562988 113.558335l0 681.348989C966.250418 915.38628 915.40332 966.232318 852.68743 966.232318zM909.469948 171.324994c0-31.356149-25.424061-56.779168-56.781494-56.779168L171.311547 114.545826c-31.357433 0-56.781494 25.423019-56.781494 56.779168l0 681.348989c0 31.357172 25.424061 56.779168 56.781494 56.779168l681.376907 0c31.358457 0 56.781494-25.423019 56.781494-56.779168L909.469948 171.324994zM824.297706 483.610416c-15.665413 0-28.390747-12.697183-28.390747-28.389584l0.887243-186.638771L604.102866 461.264479l-40.145947-40.144302 193.023924-193.016015L568.782006 228.104161c-15.693044 0-28.390747-12.697183-28.390747-28.389584s12.697704-28.389584 28.390747-28.389584l254.711349 0c7.929925 0 15.082105 3.27151 20.238756 8.53949 5.490263 4.657067 8.955319 11.449773 8.955319 19.850094l0 255.506255C852.68743 470.913233 839.989727 483.610416 824.297706 483.610416zM455.219017 852.673983 200.506645 852.673983c-7.929925 0-15.082105-3.270487-20.239779-8.538467-5.489239-4.65809-8.955319-11.423167-8.955319-19.850094L171.311547 568.779168c0-15.692401 12.726357-28.389584 28.390747-28.389584 15.69202 0 28.390747 12.697183 28.390747 28.389584l-0.887243 186.6664 192.690312-192.710047 40.173577 40.143279-193.050531 193.016015 188.198837 0c15.69202 0 28.390747 12.697183 28.390747 28.389584C483.608741 839.9768 470.911038 852.673983 455.219017 852.673983z" p-id="2167" fill="#000000"></path></svg>
      </div>
      <div class="rightClose" @click="deleteItem(item.id)">
        <svg t="1641538840906" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3258" width="48" height="48"><path d="M872.802928 755.99406 872.864326 755.99406 872.864326 755.624646Z" p-id="3259" fill="#000000"></path><path d="M927.846568 511.997953c0-229.315756-186.567139-415.839917-415.838893-415.839917-229.329059 0-415.85322 186.524161-415.85322 415.839917 0 229.300406 186.524161 415.84094 415.85322 415.84094C741.278405 927.838893 927.846568 741.29836 927.846568 511.997953M512.007675 868.171955c-196.375529 0-356.172979-159.827125-356.172979-356.174002 0-196.374506 159.797449-356.157629 356.172979-356.157629 196.34483 0 356.144326 159.783123 356.144326 356.157629C868.152001 708.34483 708.352505 868.171955 512.007675 868.171955" p-id="3260" fill="#000000"></path><path d="M682.378947 642.227993 553.797453 513.264806 682.261267 386.229528c11.661597-11.514241 11.749602-30.332842 0.234337-41.995463-11.514241-11.676947-30.362518-11.765975-42.026162-0.222057L511.888971 471.195665 385.223107 344.130711c-11.602246-11.603269-30.393217-11.661597-42.025139-0.059352-11.603269 11.618619-11.603269 30.407544-0.059352 42.011836l126.518508 126.887922L342.137823 639.104863c-11.662621 11.543917-11.780301 30.305213-0.23536 41.96988 5.830799 5.89015 13.429871 8.833179 21.086248 8.833179 7.53972 0 15.136745-2.8847 20.910239-8.569166l127.695311-126.311801L640.293433 684.195827c5.802146 5.8001 13.428847 8.717546 21.056572 8.717546 7.599072 0 15.165398-2.917446 20.968567-8.659217C693.922864 672.681586 693.950494 653.889591 682.378947 642.227993" p-id="3261" fill="#000000"></path></svg>
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
            <svg t="1641540537146" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4304" width="48" height="48"><path d="M469.333333 192c153.173333 0 277.333333 124.16 277.333334 277.333333 0 68.053333-24.533333 130.410667-65.216 178.688l164.885333 170.218667-48.341333 49.877333-167.594667-172.992A276.053333 276.053333 0 0 1 469.333333 746.666667c-153.173333 0-277.333333-124.16-277.333333-277.333334S316.16 192 469.333333 192z m0 64c-117.824 0-213.333333 95.509333-213.333333 213.333333s95.509333 213.333333 213.333333 213.333334 213.333333-95.509333 213.333334-213.333334-95.509333-213.333333-213.333334-213.333333z m133.184 192v64H341.333333v-64h261.184z" p-id="4305" fill="#000000"></path></svg>
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
  background-color: rgba(255,255,255, 0.5);
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
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