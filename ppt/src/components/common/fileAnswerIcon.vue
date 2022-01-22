<template>
  <div :class="`file-icon ${getIconClass(item.content.fileName)}`" @click="previewPdf"></div>
</template>
<script>
import { controlProject } from '@/socket/socket.teacher'
import {mapActions} from 'vuex'
export default {
  props: {
    className: {
      type: String,
      default: ''
    },
    item: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      isPdf: false
    }
  },
  created() {
    const name = this.item.content.fileName
    this.isPdf = name.indexOf('.pdf') > -1
  },
  methods: {
    ...mapActions("teacher", ["setCurrentPreviewData"]),
    getIconClass(name) {
      if(!name) return 'file'
      name = name.toLocaleLowerCase()
      if(name.indexOf('.pdf') > -1) return 'pdf'
      if(name.indexOf('.doc') > -1) return 'word'
      return 'file'
    },
    previewPdf() {
      if(this.isPdf) {
        const pdfUrl = this.item.content.link
        const data = {
          type: 'pdf',
          url: pdfUrl
        }
        this.setCurrentPreviewData(data)
        controlProject({result: data, controlType: 10})
      }
    }
  }
}
</script>
<style scoped>

</style>