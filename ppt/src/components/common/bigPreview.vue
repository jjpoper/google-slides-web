<template>
  <el-dialog :visible.sync="previewVisable" width="80%" custom-class="custom-dialog" :show-close="false">    
    <div style="padding: 5px; background: #fff;width: 100%; height: 100%; ">
      <div style=" paddingTop: 35px; position: relative">
        <common-close-button :deletefn="setCurrentPreviewUrl"/>
        <embed v-if="currentPreviewData.type === 'pdf'" width="800" height="550" :src="currentPreviewData.url"></embed>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { controlProject } from '@/socket/socket.teacher'
import {mapState, mapActions} from 'vuex'
import commonCloseButton from './commonCloseButton.vue'
export default {
  props: {
    isShowResponse: {
      type: Boolean,
      default: false
    }
  },
  components: { commonCloseButton },
  computed: {
    ...mapState({
      currentPreviewData: state => state.teacher.currentPreviewData
    })
  },
  watch: {
    currentPreviewData() {
      if(this.isProject && !this.isShowResponse) {
        this.previewVisable = false
      } else {
        this.previewVisable = !!this.currentPreviewData.url
      }
    }
  },
  data() {
    return {
      previewVisable: false,
      isProject: location.href.indexOf('/t/') > -1
    }
  },
  methods: {
    ...mapActions("teacher", ["setCurrentPreviewData"]),
    setCurrentPreviewUrl() {
      const emptyData = {
        type: '',
        url: ''
      }
      this.setCurrentPreviewData(emptyData)
      controlProject({result: emptyData, controlType: 10})
    }
  }
}
</script>
<style scoped>

</style>
