<template>
  <div style="position: relative">
    <div class="item" v-for="item in optionData.options" :key="item.id">
      <el-radio v-model="radio" :label="item.id"  class="ra" :value="item.id"  @change="changAnswer">
        {{item.text}}
      </el-radio>
    </div>
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
import {
getStudentCurrentPageAnswerList
} from '@/model/store.student'
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    answer: {
      type: Function,
      default: () => {}
    },
  },
  data() {
    return {
      optionData: {},
      pageId: '',
      radio: -1
    }
  },
  created() {
    this.optionData = this.data.items[0].data
    this.pageId = this.data.page_id
    const result = getStudentCurrentPageAnswerList(this.pageId, this.data.items[0].type)
    console.log(result, 'result')
    if(result && result.length > 0) {
      this.radio = parseInt(result[0].answer)
      // console.log(this.radio, 'result')
    }
  },
  methods: {
    changAnswer(value) {
      this.answer(value)
    }
  }
};
</script>
