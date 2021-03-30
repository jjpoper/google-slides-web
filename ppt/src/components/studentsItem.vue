<template>
  <div style="position: relative">
    <b><span v-if="readonly" class="tag">{{currentAnswer >= 0 ? '已回答' : '未回答'}}</span> {{title}}{{currentAnswer}}</b>
    <template v-if="readonly">
      <div class="item" v-for="item in options" :key="item.id">
        <el-radio :value="currentAnswer" :label="item.id"  class="ra">
          {{item.text}}
        </el-radio>
      </div>
    </template>
    <template v-else>
      <div class="item" v-for="item in options" :key="item.id">
        <el-radio v-model="radio" :label="item.id"  class="ra"  @change="changAnswer">
          {{item.text}}
        </el-radio>
      </div>
    </template>
    <slot />
  </div>
</template>
<style scoped>
.item{
  /* width: 100%; */
  /* width: 50%; */
  margin: 10px;
  /* display: inline-block; */
  height: 50px;
  /* border: 1px solid #fff; */
  background-color: #fff;
  border-radius: 10px;
  line-height: 50px;
  position: relative;
}
.tag{
  color: red;
}
</style>

<script>
import {getStudentsAnswer, saveStudentsAnswer} from '../utils/store'
export default {
  props: {
    options: {
      type: Array,
      default: [],
    },
    title: {
      type: String,
      default: ''
    },
    answer: {
      type: Function,
      default: () => {}
    },
    pageId: {
      type: String,
      default: ''
    },
    readonly: {
      type: Boolean,
      default: false
    },
    currentAnswer: {
      type: Number,
      default: null
    }
  },
  created() {
    console.log(this.pageId, this.currentAnswer)
  },
  data() {
    return {
      radio: getStudentsAnswer(this.pageId)
    }
  },
  methods: {
    changAnswer(value) {
      saveStudentsAnswer(this.pageId, value)
      this.answer(value)
    }
  }
};
</script>
