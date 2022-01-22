<template>
  <el-dialog :visible.sync="pdfVisable" width="80%" custom-class="custom-dialog" :show-close="false">    
    <div style="padding: 5px; background: #fff;width: 100%; height: 100%; ">
      <div style=" paddingTop: 35px; position: relative">
        <common-close-button :deletefn="setCurrentPreviewUrl"/>
        <embed width="800" height="550" :src="currentPreviewPDF"></embed>
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
      currentPreviewPDF: state => state.teacher.currentPreviewPDF
    })
  },
  watch: {
    currentPreviewPDF() {
      if(this.isProject && !this.isShowResponse) {
        this.pdfVisable = false
      } else {
        this.pdfVisable = !!this.currentPreviewPDF
        console.log(this.pdfVisable)
      }
    }
  },
  data() {
    return {
      pdfVisable: false,
      isProject: location.href.indexOf('/t/') > -1
    }
  },
  methods: {
    ...mapActions("teacher", ["setCurrentPreviewPDF"]),
    setCurrentPreviewUrl() {
      this.setCurrentPreviewPDF()
      controlProject({result: '', controlType: 10})
    }
  }
}
</script>
<style scoped>

</style>
