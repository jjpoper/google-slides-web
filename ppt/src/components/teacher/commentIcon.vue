<template>
  <i class="el-icon-edit-outline commentIcon" @click="showCommentModal"/>
</template>
<style scoped>
.commentIcon{
position: absolute;
cursor: pointer;
font-size: 30px;
bottom: 10px;
right: 10px;
}
</style>
<script>
import { ModalEventsNameEnum } from '@/socket/socketEvents'
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  methods: {
    showCommentModal() {
      const {pageId, itemId, studentId, title} = this.data
      EventBus.$emit(ModalEventsNameEnum.TEACHER_COMMENT_MODAL, {pageId, itemId, title, studentId})
    }
  }
}
</script>