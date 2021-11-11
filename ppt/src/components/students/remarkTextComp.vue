<template>
  <div>
    <p class="remark-text" v-if="!isEdit" @click="edit">
      {{text}}
    </p>
    <record-text :onSend="sendCommentCb" v-else :defaultText="text" :cancel="cancel"/>
  </div>
</template>
<script>
import { updateRemarkItemData } from '@/socket/socket.student'
import {mapActions} from 'vuex'
import recordText from '../common/recordText.vue'
export default {
  components: { recordText },
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    index: {
      type: Number,
    }
  },
  data() {
    return {
      isEdit: false,
      text: ''
    }
  },
  created() {
    this.text = this.item.link
  },
  methods: {
    ...mapActions("remark", [
      "updateOneRemarkItem",
      "changeRemarkIndex"
    ]),
    edit() {
      this.changeRemarkIndex(this.index)
      this.$nextTick(() => {
        this.isEdit = true
      })
      // this.isEdit = true
      console.log(this.item)
    },
    cancel() {
      this.isEdit = false
    },
    sendCommentCb(text) {
      this.text = text
      this.isEdit = false
      const data = {
        ...this.item,
        link: this.text
      }
      this.updateOneRemarkItem(data)
      updateRemarkItemData(data)
    }
  }
}
</script>
<style scoped>
.remark-text {
  font-size: 10px;
  font-family: Inter-Bold;
  line-height: 24px;
  color: #000000;
  text-align: justify;
}
</style>